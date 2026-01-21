import { lazy, Suspense } from 'react';
import { Property } from '@/data/properties';
import { Skeleton } from '@/components/ui/skeleton';

const PropertyMapLazy = lazy(() => import('./PropertyMapContent'));

interface PropertyMapWrapperProps {
  properties: Property[];
  className?: string;
}

export function PropertyMap({ properties, className = '' }: PropertyMapWrapperProps) {
  return (
    <Suspense fallback={
      <div className={`rounded-xl overflow-hidden bg-muted ${className}`}>
        <Skeleton className="w-full h-full min-h-[500px]" />
      </div>
    }>
      <PropertyMapLazy properties={properties} className={className} />
    </Suspense>
  );
}
