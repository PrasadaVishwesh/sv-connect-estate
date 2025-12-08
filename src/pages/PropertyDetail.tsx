import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight, 
  Heart, Share2, Phone, MessageCircle, Mail, Calendar,
  Building2, Car, Shield, Zap, Droplets, Wifi
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PropertyCard } from '@/components/PropertyCard';
import { properties, formatPrice, getPropertyTypeLabel } from '@/data/properties';
import { useToast } from '@/hooks/use-toast';

const amenityIcons: Record<string, typeof Building2> = {
  'Swimming Pool': Droplets,
  'Gym': Building2,
  'Parking': Car,
  'Security': Shield,
  'Power Backup': Zap,
  'High-Speed Internet': Wifi,
};

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    preferredTime: '',
  });

  const property = properties.find(p => p.id === id);

  if (!property) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Property Not Found</h1>
          <p className="text-muted-foreground mb-6">The property you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/properties">Browse All Properties</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const priceLabel = property.listingType === 'rent' 
    ? `${formatPrice(property.price, property.listingType)}/month`
    : formatPrice(property.price, property.listingType);

  const similarProperties = properties
    .filter(p => p.id !== property.id && p.type === property.type)
    .slice(0, 3);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Submit to backend
    toast({
      title: "Enquiry Submitted!",
      description: "Our team will contact you shortly.",
    });
    setFormData({ name: '', phone: '', email: '', message: '', preferredTime: '' });
  };

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary py-4">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link to="/properties" className="hover:text-foreground">Properties</Link>
            <span>/</span>
            <span className="text-foreground">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative rounded-xl overflow-hidden aspect-[16/10]">
              <img 
                src={property.images[currentImageIndex]} 
                alt={property.title}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-card transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant={property.listingType === 'sale' ? 'default' : 'secondary'} className="uppercase">
                  For {property.listingType}
                </Badge>
                {property.featured && (
                  <Badge className="bg-accent text-accent-foreground uppercase">
                    Featured
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex 
                        ? 'w-8 bg-accent' 
                        : 'bg-card/60 hover:bg-card'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {property.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex 
                        ? 'border-accent' 
                        : 'border-transparent hover:border-border'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Property Info */}
            <div className="bg-card rounded-xl p-6 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-sm text-muted-foreground">{getPropertyTypeLabel(property.type)} • ID: {property.id}</span>
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mt-1">{property.title}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mt-2">
                    <MapPin className="w-4 h-4" />
                    <span>{property.location.address}, {property.location.area}, {property.location.city}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-accent">{priceLabel}</div>
                  {property.listingType === 'rent' && property.deposit && (
                    <div className="text-sm text-muted-foreground">
                      Security Deposit: {formatPrice(property.deposit, 'sale')}
                    </div>
                  )}
                </div>
              </div>

              {/* Key Features */}
              <div className="flex flex-wrap gap-6 py-6 border-y border-border">
                {property.bedrooms > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                      <Bed className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{property.bedrooms}</div>
                      <div className="text-sm text-muted-foreground">Bedrooms</div>
                    </div>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                      <Bath className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{property.bathrooms}</div>
                      <div className="text-sm text-muted-foreground">Bathrooms</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                    <Square className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{property.areaSqFt.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Sq. Ft.</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="py-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">About This Property</h2>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </div>

              {/* Amenities */}
              <div className="pt-6 border-t border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">Amenities & Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity] || Building2;
                    return (
                      <div key={amenity} className="flex items-center gap-3 p-3 rounded-lg bg-secondary">
                        <Icon className="w-5 h-5 text-accent" />
                        <span className="text-sm text-foreground">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-card rounded-xl p-6 shadow-card sticky top-24">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                  SV
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">S.V Real Estate</h3>
                  <p className="text-sm text-muted-foreground">Verified Mediator</p>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="space-y-3 mb-6">
                <a 
                  href="tel:+918099952200"
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                >
                  <Phone className="w-5 h-5 text-accent" />
                  <span className="font-medium text-foreground">+91 80999 52200</span>
                </a>
                <a 
                  href="https://wa.me/918099952200?text=Hi%2C%20I%20am%20interested%20in%20this%20property"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 hover:bg-green-500/20 transition-colors text-green-600"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">WhatsApp: 80999 52200</span>
                </a>
              </div>

              {/* Enquiry Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <h4 className="font-semibold text-foreground">Send Enquiry</h4>
                <input
                  type="text"
                  placeholder="Your Name *"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(f => ({ ...f, phone: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <input
                  type="email"
                  placeholder="Email (Optional)"
                  value={formData.email}
                  onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <textarea
                  placeholder="Message"
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData(f => ({ ...f, message: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
                <select
                  value={formData.preferredTime}
                  onChange={(e) => setFormData(f => ({ ...f, preferredTime: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">Preferred Time to Call</option>
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                  <option value="evening">Evening (5 PM - 9 PM)</option>
                </select>
                <Button type="submit" variant="accent" className="w-full">
                  Send Enquiry
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
