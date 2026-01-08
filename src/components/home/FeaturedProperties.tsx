import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PropertyCard } from '@/components/PropertyCard';
import { PropertyCardSkeleton } from '@/components/PropertyCardSkeleton';
import { properties } from '@/data/properties';
import { ArrowRight } from 'lucide-react';

export function FeaturedProperties() {
  const [isLoading, setIsLoading] = useState(true);
  const featuredProperties = properties.filter((p) => p.featured).slice(0, 3);

  // Simulate loading state for demo purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">Featured Listings</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">
              Discover Your Dream Property
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl">
              Handpicked properties that match quality, location, and value
            </p>
          </div>
          <Button variant="outline" asChild className="mt-6 md:mt-0 gap-2">
            <Link to="/properties">
              View All Properties
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              {[1, 2, 3].map((i) => (
                <PropertyCardSkeleton key={i} />
              ))}
            </>
          ) : (
            featuredProperties.map((property, index) => (
              <div
                key={property.id}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PropertyCard property={property} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
