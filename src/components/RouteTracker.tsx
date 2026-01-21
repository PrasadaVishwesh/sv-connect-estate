import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { errorMonitor } from '@/lib/errorMonitor';

/**
 * Component that tracks route changes for error monitoring
 */
export function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // Add breadcrumb for navigation
    errorMonitor.addBreadcrumb('navigation', `Navigated to: ${location.pathname}`);
  }, [location.pathname]);

  return null;
}
