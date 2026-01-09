import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Link } from 'react-router-dom';
import { Property, formatPrice } from '@/data/properties';
import { Bed, Bath, Square, MapPin } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface PropertyMapProps {
  properties: Property[];
  className?: string;
}

export function PropertyMap({ properties, className = '' }: PropertyMapProps) {
  // Filter properties with valid coordinates
  const propertiesWithCoords = properties.filter(
    (p) => p.location.coordinates?.lat && p.location.coordinates?.lng
  );

  // Calculate center based on properties or default to India
  const center = propertiesWithCoords.length > 0
    ? {
        lat: propertiesWithCoords.reduce((sum, p) => sum + (p.location.coordinates?.lat || 0), 0) / propertiesWithCoords.length,
        lng: propertiesWithCoords.reduce((sum, p) => sum + (p.location.coordinates?.lng || 0), 0) / propertiesWithCoords.length
      }
    : { lat: 19.0760, lng: 72.8777 }; // Default to Mumbai

  return (
    <div className={`rounded-xl overflow-hidden ${className}`}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={10}
        style={{ height: '100%', width: '100%', minHeight: '500px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {propertiesWithCoords.map((property) => (
          <Marker
            key={property.id}
            position={[property.location.coordinates!.lat, property.location.coordinates!.lng]}
            icon={defaultIcon}
          >
            <Popup>
              <div className="min-w-[200px]">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-24 object-cover rounded-lg mb-2"
                />
                <h3 className="font-semibold text-sm mb-1 line-clamp-1">{property.title}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                  <MapPin className="w-3 h-3" />
                  <span>{property.location.area}, {property.location.city}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                  {property.bedrooms > 0 && (
                    <div className="flex items-center gap-1">
                      <Bed className="w-3 h-3" />
                      <span>{property.bedrooms}</span>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="flex items-center gap-1">
                      <Bath className="w-3 h-3" />
                      <span>{property.bathrooms}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Square className="w-3 h-3" />
                    <span>{property.areaSqFt} sqft</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-primary">
                    {formatPrice(property.price, property.listingType)}
                    {property.listingType === 'rent' && '/mo'}
                  </span>
                  <Link
                    to={`/property/${property.id}`}
                    className="text-xs text-accent hover:underline font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}