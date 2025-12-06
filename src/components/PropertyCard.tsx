import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';
import { Property, formatPrice, getPropertyTypeLabel } from '@/data/properties';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const priceLabel = property.listingType === 'rent' 
    ? `${formatPrice(property.price, property.listingType)}/mo`
    : formatPrice(property.price, property.listingType);

  return (
    <Link 
      to={`/properties/${property.id}`}
      className={cn(
        "group block bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1",
        className
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={property.images[0]} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant={property.listingType === 'sale' ? 'default' : 'secondary'} className="uppercase text-xs font-semibold">
            For {property.listingType}
          </Badge>
          {property.featured && (
            <Badge className="bg-accent text-accent-foreground uppercase text-xs font-semibold">
              Featured
            </Badge>
          )}
        </div>

        {/* Favorite Button */}
        <button 
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-card transition-colors"
          onClick={(e) => {
            e.preventDefault();
            // TODO: Add to favorites
          }}
        >
          <Heart className="w-5 h-5" />
        </button>

        {/* Property Type */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1 rounded-full bg-card/80 backdrop-blur-sm text-xs font-medium text-foreground">
            {getPropertyTypeLabel(property.type)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Price */}
        <div className="mb-2">
          <span className="text-2xl font-bold text-foreground">{priceLabel}</span>
          {property.listingType === 'rent' && property.deposit && (
            <span className="text-sm text-muted-foreground ml-2">
              (Deposit: {formatPrice(property.deposit, 'sale')})
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-accent transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="text-sm line-clamp-1">{property.location.area}, {property.location.city}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 pt-4 border-t border-border">
          {property.bedrooms > 0 && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Bed className="w-4 h-4" />
              <span className="text-sm font-medium">{property.bedrooms} Beds</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Bath className="w-4 h-4" />
              <span className="text-sm font-medium">{property.bathrooms} Baths</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Square className="w-4 h-4" />
            <span className="text-sm font-medium">{property.areaSqFt.toLocaleString()} sqft</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
