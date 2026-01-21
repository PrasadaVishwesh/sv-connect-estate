import { ReactNode, Suspense } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Skeleton } from '@/components/ui/skeleton';

interface RouteErrorBoundaryProps {
  children: ReactNode;
  /** Page name for better error messages */
  pageName?: string;
}

/**
 * Error boundary specifically for route-level components.
 * Catches errors in individual pages without breaking the entire app.
 */
export function RouteErrorBoundary({ children, pageName }: RouteErrorBoundaryProps) {
  return (
    <ErrorBoundary
      title={pageName ? `Failed to load ${pageName}` : 'Page failed to load'}
      onError={(error, errorInfo) => {
        console.error(`[RouteError] ${pageName || 'Unknown page'} crashed:`, error);
        console.error('[RouteError] Stack:', errorInfo.componentStack);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

interface LazyComponentBoundaryProps {
  children: ReactNode;
  /** Custom loading fallback */
  loadingFallback?: ReactNode;
  /** Whether to show inline error (vs full page) */
  inline?: boolean;
  /** Component name for error messages */
  componentName?: string;
}

/**
 * Wrapper for lazily-loaded components with both Suspense and Error Boundary.
 * Use this for any component loaded with React.lazy().
 */
export function LazyComponentBoundary({ 
  children, 
  loadingFallback,
  inline = true,
  componentName 
}: LazyComponentBoundaryProps) {
  const defaultFallback = (
    <div className="w-full h-64 flex items-center justify-center">
      <Skeleton className="w-full h-full rounded-xl" />
    </div>
  );

  return (
    <ErrorBoundary 
      inline={inline}
      title={componentName ? `Failed to load ${componentName}` : undefined}
      onError={(error) => {
        console.error(`[LazyComponent] ${componentName || 'Component'} failed to load:`, error);
      }}
    >
      <Suspense fallback={loadingFallback || defaultFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}
