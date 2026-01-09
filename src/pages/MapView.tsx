import { useState, useMemo } from 'react';
import { Layout } from '@/components/layout/Layout';
import { PropertyMap } from '@/components/PropertyMap';
import { PropertyCard } from '@/components/PropertyCard';
import { properties, PropertyType, ListingType } from '@/data/properties';
import { Button } from '@/components/ui/button';
import { List, Map, Home, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const propertyTypes: { value: PropertyType | ''; label: string }[] = [
  { value: '', label: 'All Types' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'house', label: 'House' },
  { value: 'plot', label: 'Plot' },
  { value: 'commercial', label: 'Commercial' },
];

export default function MapView() {
  const [listingType, setListingType] = useState<ListingType>('sale');
  const [propertyType, setPropertyType] = useState<PropertyType | ''>('');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      if (property.listingType !== listingType) return false;
      if (propertyType && property.type !== propertyType) return false;
      return true;
    });
  }, [listingType, propertyType]);

  const selectedProperty = selectedPropertyId 
    ? properties.find(p => p.id === selectedPropertyId) 
    : null;

  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary py-8">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground">
                Property Map View
              </h1>
              <p className="text-primary-foreground/70 mt-1">
                Explore properties on the map
              </p>
            </div>
            <Button variant="hero-outline" asChild>
              <a href="/properties" className="gap-2">
                <List className="w-4 h-4" />
                List View
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Filters */}
          <div className="bg-card rounded-xl shadow-card p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Listing Type Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setListingType('sale')}
                  className={cn(
                    "py-2 px-4 rounded-lg font-medium text-sm transition-all flex items-center gap-2",
                    listingType === 'sale'
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  <Home className="w-4 h-4" />
                  Buy
                </button>
                <button
                  onClick={() => setListingType('rent')}
                  className={cn(
                    "py-2 px-4 rounded-lg font-medium text-sm transition-all flex items-center gap-2",
                    listingType === 'rent'
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  <Building2 className="w-4 h-4" />
                  Rent
                </button>
              </div>

              {/* Property Type */}
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType | '')}
                className="py-2 px-4 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <div className="flex-1" />

              <div className="text-sm text-muted-foreground flex items-center">
                <Map className="w-4 h-4 mr-2" />
                {filteredProperties.length} properties found
              </div>
            </div>
          </div>

          {/* Map and List */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Map */}
            <div className="lg:col-span-2 h-[600px]">
              <PropertyMap 
                properties={filteredProperties} 
                className="h-full shadow-card"
              />
            </div>

            {/* Property List */}
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              <h3 className="font-semibold text-foreground sticky top-0 bg-background py-2">
                Properties ({filteredProperties.length})
              </h3>
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedPropertyId === property.id && "ring-2 ring-accent rounded-xl"
                  )}
                  onClick={() => setSelectedPropertyId(property.id)}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
              {filteredProperties.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Map className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No properties found for the selected filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}