import { lazy } from 'react';
import { Property } from '@/data/properties';
import { Skeleton } from '@/components/ui/skeleton';
import { LazyComponentBoundary } from '@/components/RouteErrorBoundary';
import { MapPin } from 'lucide-react';

const PropertyMapLazy = lazy(() => import('./PropertyMapContent'));

interface PropertyMapWrapperProps {
  properties: Property[];
  className?: string;
}

/**
 * Map loading skeleton with visual indicator
 */
function MapLoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={`rounded-xl overflow-hidden bg-muted relative ${className}`}>
      <Skeleton className="w-full h-full min-h-[500px]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <MapPin className="w-8 h-8 animate-pulse" />
          <span className="text-sm">Loading map...</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Error fallback for map failures
 */
function MapErrorFallback({ className }: { className?: string }) {
  const handleRetry = () => window.location.reload();
  
  return (
    <div className={`rounded-xl overflow-hidden bg-muted/50 border border-border ${className}`}>
      <div className="w-full min-h-[500px] flex flex-col items-center justify-center p-8">
        <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Map couldn't load
        </h3>
        <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
          There was a problem loading the interactive map. You can still browse properties in the list on the right.
        </p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Reload Page
        </button>
      </div>
    </div>
  );
}

export function PropertyMap({ properties, className = '' }: PropertyMapWrapperProps) {
  return (
    <LazyComponentBoundary
      componentName="Property Map"
      inline={true}
      loadingFallback={<MapLoadingSkeleton className={className} />}
    >
      <PropertyMapLazy properties={properties} className={className} />
    </LazyComponentBoundary>
  );
}
