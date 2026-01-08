import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building2, ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';


export function HeroSection() {
  const navigate = useNavigate();
  const [listingType, setListingType] = useState<'sale' | 'rent'>('sale');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.bottom > 0) {
          setScrollY(window.scrollY);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = () => {
    navigate(`/properties?type=${listingType}&q=${searchQuery}`);
  };

  const whatsappUrl = `https://wa.me/918099952200?text=${encodeURIComponent('Hi! I am interested in your real estate services. Please help me find a property.')}`;

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/85 hero-shimmer"
    >
      {/* Parallax Background Elements */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <div className="absolute top-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-accent/5 rounded-full blur-2xl" />
      </div>

      {/* Slower parallax layer */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      >
        <div className="absolute top-40 right-1/4 w-32 h-32 bg-primary-foreground/10 rounded-full blur-2xl" />
        <div className="absolute bottom-40 left-1/4 w-56 h-56 bg-accent/8 rounded-full blur-3xl" />
      </div>

      <div 
        className="container mx-auto px-4 lg:px-8 relative z-10"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/15 backdrop-blur-sm mb-8 animate-fade-up border border-primary-foreground/20 opacity-0 [animation-delay:200ms] [animation-fill-mode:forwards]">
            <span className="w-2 h-2 rounded-full bg-accent" />
            <span className="text-primary-foreground text-sm font-medium drop-shadow-lg">
              Trusted by 10,000+ Happy Customers
            </span>
          </div>

          {/* Heading with text shadow */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6 animate-fade-up drop-shadow-2xl opacity-0 [animation-delay:400ms] [animation-fill-mode:forwards]" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.6)' }}>
            Your Trusted Partner for
            <span className="block text-accent drop-shadow-lg" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>Homes & Plots</span>
          </h1>

          {/* Tagline with text shadow */}
          <p className="text-lg md:text-xl text-primary-foreground max-w-2xl mx-auto mb-4 animate-fade-up drop-shadow-lg opacity-0 [animation-delay:600ms] [animation-fill-mode:forwards]" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
            BUY • SELL • INVEST
          </p>
          <p className="text-base md:text-lg text-primary-foreground/90 max-w-2xl mx-auto mb-10 animate-fade-up drop-shadow-md opacity-0 [animation-delay:700ms] [animation-fill-mode:forwards]">
            Independent Houses | Apartments | Open Plots
          </p>

          {/* Search Box */}
          <div className="bg-card/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl max-w-3xl mx-auto animate-scale-in border border-border/50 opacity-0 [animation-delay:900ms] [animation-fill-mode:forwards]">
            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setListingType('sale')}
                className={cn(
                  "flex-1 py-3 px-6 rounded-lg font-semibold text-sm transition-all",
                  listingType === 'sale'
                    ? "bg-primary text-primary-foreground shadow-lg"
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
                    ? "bg-primary text-primary-foreground shadow-lg"
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
                  className="w-full pl-12 pr-4 py-4 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
              </div>
              
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <select className="w-full pl-12 pr-4 py-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent appearance-none cursor-pointer transition-all">
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
                className="w-full gap-2 shadow-lg hover:shadow-xl transition-all"
                onClick={handleSearch}
              >
                <Search className="w-5 h-5" />
                Search Properties
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-fade-up opacity-0 [animation-delay:1100ms] [animation-fill-mode:forwards]">
            <Button 
              variant="accent" 
              size="lg" 
              className="gap-2 shadow-lg hover:shadow-xl"
              onClick={() => navigate('/properties')}
            >
              Explore Properties
              <ArrowRight className="w-4 h-4" />
            </Button>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 h-12 rounded-lg bg-[#25D366] hover:bg-[#20BD5C] text-white font-semibold transition-colors shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="w-5 h-5" />
              Contact on WhatsApp
            </a>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12 animate-fade-up opacity-0 [animation-delay:1300ms] [animation-fill-mode:forwards]">
            {[
              { value: '500+', label: 'Properties Listed' },
              { value: '1000+', label: 'Happy Clients' },
              { value: '50+', label: 'Cities Covered' },
              { value: '10+', label: 'Years Experience' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent drop-shadow-lg">{stat.value}</div>
                <div className="text-sm text-primary-foreground/80 drop-shadow-md">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
