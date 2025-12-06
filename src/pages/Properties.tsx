import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Grid3X3, List } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { PropertyCard } from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { properties, PropertyType, ListingType } from '@/data/properties';
import { cn } from '@/lib/utils';

const propertyTypes: { value: PropertyType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'house', label: 'House' },
  { value: 'plot', label: 'Plot' },
  { value: 'commercial', label: 'Commercial' },
];

const priceRanges = [
  { value: '', label: 'Any Price' },
  { value: '0-5000000', label: 'Under ₹50 Lac' },
  { value: '5000000-10000000', label: '₹50 Lac - ₹1 Cr' },
  { value: '10000000-50000000', label: '₹1 Cr - ₹5 Cr' },
  { value: '50000000-', label: 'Above ₹5 Cr' },
];

const bedroomOptions = [
  { value: '', label: 'Any Beds' },
  { value: '1', label: '1 BHK' },
  { value: '2', label: '2 BHK' },
  { value: '3', label: '3 BHK' },
  { value: '4', label: '4+ BHK' },
];

export default function Properties() {
  const [searchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const [filters, setFilters] = useState({
    listingType: (searchParams.get('type') as ListingType) || '',
    propertyType: '' as PropertyType | '',
    priceRange: '',
    bedrooms: '',
    search: searchParams.get('q') || '',
  });

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Listing type filter
      if (filters.listingType && property.listingType !== filters.listingType) {
        return false;
      }

      // Property type filter
      if (filters.propertyType && property.type !== filters.propertyType) {
        return false;
      }

      // Price range filter
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-').map(Number);
        if (min && property.price < min) return false;
        if (max && property.price > max) return false;
      }

      // Bedrooms filter
      if (filters.bedrooms) {
        const beds = parseInt(filters.bedrooms);
        if (beds === 4 && property.bedrooms < 4) return false;
        if (beds < 4 && property.bedrooms !== beds) return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = property.title.toLowerCase().includes(searchLower);
        const matchesLocation = property.location.city.toLowerCase().includes(searchLower) ||
          property.location.area.toLowerCase().includes(searchLower);
        if (!matchesTitle && !matchesLocation) return false;
      }

      return true;
    });
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      listingType: '',
      propertyType: '',
      priceRange: '',
      bedrooms: '',
      search: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Find Your Perfect Property
          </h1>
          <p className="text-primary-foreground/70 max-w-xl">
            Browse through our extensive collection of verified properties for sale and rent.
          </p>
        </div>
      </section>

      {/* Filters & Listings */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Search & Filter Bar */}
          <div className="bg-card rounded-xl shadow-card p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by location, property name..."
                  value={filters.search}
                  onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              {/* Quick Filters - Desktop */}
              <div className="hidden lg:flex gap-3">
                {/* Listing Type */}
                <select
                  value={filters.listingType}
                  onChange={(e) => setFilters(f => ({ ...f, listingType: e.target.value as ListingType }))}
                  className="px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
                >
                  <option value="">Buy / Rent</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>

                {/* Property Type */}
                <select
                  value={filters.propertyType}
                  onChange={(e) => setFilters(f => ({ ...f, propertyType: e.target.value as PropertyType }))}
                  className="px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
                >
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>

                {/* Price Range */}
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters(f => ({ ...f, priceRange: e.target.value }))}
                  className="px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
                >
                  {priceRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>

                {/* Bedrooms */}
                <select
                  value={filters.bedrooms}
                  onChange={(e) => setFilters(f => ({ ...f, bedrooms: e.target.value }))}
                  className="px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
                >
                  {bedroomOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Filter Toggle */}
              <Button 
                variant="outline" 
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </Button>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mt-4 pt-4 border-t border-border grid grid-cols-2 gap-3">
                <select
                  value={filters.listingType}
                  onChange={(e) => setFilters(f => ({ ...f, listingType: e.target.value as ListingType }))}
                  className="px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="">Buy / Rent</option>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
                <select
                  value={filters.propertyType}
                  onChange={(e) => setFilters(f => ({ ...f, propertyType: e.target.value as PropertyType }))}
                  className="px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                <select
                  value={filters.priceRange}
                  onChange={(e) => setFilters(f => ({ ...f, priceRange: e.target.value }))}
                  className="px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {priceRanges.map(range => (
                    <option key={range.value} value={range.value}>{range.label}</option>
                  ))}
                </select>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => setFilters(f => ({ ...f, bedrooms: e.target.value }))}
                  className="px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {bedroomOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredProperties.length}</span> properties found
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-sm text-accent hover:text-accent/80"
                >
                  <X className="w-4 h-4" />
                  Clear filters
                </button>
              )}
            </div>

            {/* View Toggle */}
            <div className="hidden md:flex items-center gap-2 bg-secondary rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === 'grid' ? 'bg-card shadow-sm' : 'hover:bg-card/50'
                )}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  viewMode === 'list' ? 'bg-card shadow-sm' : 'hover:bg-card/50'
                )}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Properties Grid */}
          {filteredProperties.length > 0 ? (
            <div className={cn(
              "grid gap-8",
              viewMode === 'grid' 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            )}>
              {filteredProperties.map((property, index) => (
                <div 
                  key={property.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No properties found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
              <Button variant="accent" onClick={clearFilters}>Clear All Filters</Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
