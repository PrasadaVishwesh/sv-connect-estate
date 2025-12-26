import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, Building2, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import svBanner from '@/assets/sv-banner.jpg';

export function HeroSection() {
  const navigate = useNavigate();
  const [listingType, setListingType] = useState<'sale' | 'rent'>('sale');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    navigate(`/properties?type=${listingType}&q=${searchQuery}`);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${svBanner})` }}
      />
      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-primary/60" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-primary-foreground/80 text-sm font-medium">
              Trusted by 10,000+ Happy Customers
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-up stagger-1">
            Find Your Perfect
            <span className="block text-accent">Dream Property</span>
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-10 animate-fade-up stagger-2">
            Connecting people to the right property, stress-free. Your trusted real estate mediator for buying, selling, and renting.
          </p>

          {/* Search Box */}
          <div className="bg-card rounded-2xl p-6 shadow-xl max-w-3xl mx-auto animate-fade-up stagger-3">
            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setListingType('sale')}
                className={cn(
                  "flex-1 py-3 px-6 rounded-lg font-semibold text-sm transition-all",
                  listingType === 'sale'
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                Buy Property
              </button>
              <button
                onClick={() => setListingType('rent')}
                className={cn(
                  "flex-1 py-3 px-6 rounded-lg font-semibold text-sm transition-all",
                  listingType === 'rent'
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                Rent Property
              </button>
            </div>

            {/* Search Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Enter location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>
              
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select className="w-full pl-12 pr-4 py-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer">
                  <option value="">Property Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="house">House</option>
                  <option value="plot">Plot</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <Button 
                variant="accent" 
                size="xl" 
                className="w-full gap-2"
                onClick={handleSearch}
              >
                <Search className="w-5 h-5" />
                Search Properties
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12 animate-fade-up stagger-4">
            {[
              { value: '500+', label: 'Properties Listed' },
              { value: '1000+', label: 'Happy Clients' },
              { value: '50+', label: 'Cities Covered' },
              { value: '10+', label: 'Years Experience' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent">{stat.value}</div>
                <div className="text-sm text-primary-foreground/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
