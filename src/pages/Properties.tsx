import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PageTransition } from '@/components/PageTransition';
import { PropertyCard } from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { properties, Property, PropertyType, ListingType } from '@/data/properties';
import { Search, Filter, X, SlidersHorizontal, MapPin, Home, Building2 } from 'lucide-react';
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
  { value: '50000000-999999999', label: 'Above ₹5 Cr' },
];

const cities = ['All Cities', 'Vijayawada', 'Mumbai', 'Pune', 'Bangalore', 'Hyderabad'];

export default function Properties() {
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') as ListingType || 'sale';
  const initialQuery = searchParams.get('q') || '';

  const [listingType, setListingType] = useState<ListingType>(initialType);
  const [propertyType, setPropertyType] = useState<PropertyType | ''>('');
  const [priceRange, setPriceRange] = useState('');
  const [city, setCity] = useState('All Cities');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Listing type filter
      if (property.listingType !== listingType) return false;

      // Property type filter
      if (propertyType && property.type !== propertyType) return false;

      // City filter
      if (city !== 'All Cities' && property.location.city !== city) return false;

      // Price range filter
      if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        if (property.price < min || property.price > max) return false;
      }

      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          property.title.toLowerCase().includes(query) ||
          property.location.city.toLowerCase().includes(query) ||
          property.location.area.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [listingType, propertyType, priceRange, city, searchQuery]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearFilters = () => {
    setPropertyType('');
    setPriceRange('');
    setCity('All Cities');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const hasActiveFilters = propertyType || priceRange || city !== 'All Cities' || searchQuery;

  return (
    <PageTransition>
      <Layout>
      {/* Hero Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Find Your Perfect Property
            </h1>
            <p className="text-lg text-primary-foreground/70">
              Browse through our curated collection of properties for sale and rent
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Search and Filter Bar */}
          <div className="bg-card rounded-xl shadow-card p-6 mb-8 animate-fade-up">
            {/* Listing Type Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => { setListingType('sale'); setCurrentPage(1); }}
                className={cn(
                  "flex-1 py-3 px-6 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2",
                  listingType === 'sale'
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                <Home className="w-4 h-4" />
                Buy Property
              </button>
              <button
                onClick={() => { setListingType('rent'); setCurrentPage(1); }}
                className={cn(
                  "flex-1 py-3 px-6 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2",
                  listingType === 'rent'
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                <Building2 className="w-4 h-4" />
                Rent Property
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by location, property name..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-accent" />
                )}
              </Button>
            </div>

            {/* Expandable Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-border animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Property Type
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => { setPropertyType(e.target.value as PropertyType | ''); setCurrentPage(1); }}
                      className="w-full py-3 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      {propertyTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Price Range
                    </label>
                    <select
                      value={priceRange}
                      onChange={(e) => { setPriceRange(e.target.value); setCurrentPage(1); }}
                      className="w-full py-3 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      {priceRanges.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      City
                    </label>
                    <select
                      value={city}
                      onChange={(e) => { setCity(e.target.value); setCurrentPage(1); }}
                      className="w-full py-3 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      {cities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      className="w-full gap-2"
                      onClick={clearFilters}
                      disabled={!hasActiveFilters}
                    >
                      <X className="w-4 h-4" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredProperties.length}</span> properties
              {listingType === 'sale' ? ' for sale' : ' for rent'}
            </p>
          </div>

          {/* Properties Grid */}
          {paginatedProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProperties.map((property, index) => (
                  <div
                    key={property.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No properties found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search criteria
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  </PageTransition>
  );
}
