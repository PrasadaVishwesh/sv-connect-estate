/**
 * Error monitoring service for production
 * Captures errors, route info, browser metadata, and user context
 */

interface ErrorContext {
  route?: string;
  componentStack?: string;
  userAgent?: string;
  url?: string;
  timestamp?: string;
  [key: string]: unknown;
}

interface UserContext {
  id?: string;
  email?: string;
  [key: string]: unknown;
}

class ErrorMonitor {
  private isProduction = import.meta.env.PROD;
  private userContext: UserContext = {};
  private breadcrumbs: Array<{ type: string; message: string; timestamp: number }> = [];
  private maxBreadcrumbs = 20;

  /**
   * Initialize the error monitor
   */
  init() {
    if (typeof window === 'undefined') return;

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(event.reason, {
        type: 'unhandledrejection',
        promise: String(event.promise),
      });
    });

    // Capture global errors
    window.addEventListener('error', (event) => {
      this.captureError(event.error || new Error(event.message), {
        type: 'window.onerror',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Track navigation
    this.addBreadcrumb('navigation', `Initial load: ${window.location.pathname}`);

    console.info('[ErrorMonitor] Initialized in', this.isProduction ? 'production' : 'development', 'mode');
  }

  /**
   * Set user context for error reports
   */
  setUser(user: UserContext) {
    this.userContext = user;
  }

  /**
   * Clear user context (e.g., on logout)
   */
  clearUser() {
    this.userContext = {};
  }

  /**
   * Add a breadcrumb for debugging
   */
  addBreadcrumb(type: string, message: string) {
    this.breadcrumbs.push({
      type,
      message,
      timestamp: Date.now(),
    });

    // Keep only the last N breadcrumbs
    if (this.breadcrumbs.length > this.maxBreadcrumbs) {
      this.breadcrumbs.shift();
    }
  }

  /**
   * Capture and report an error
   */
  captureError(error: Error | unknown, context: ErrorContext = {}) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    
    const errorReport = {
      name: errorObj.name,
      message: errorObj.message,
      stack: errorObj.stack,
      context: {
        ...context,
        route: window.location.pathname,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        connection: (navigator as Navigator & { connection?: { effectiveType?: string } }).connection?.effectiveType,
      },
      user: this.userContext,
      breadcrumbs: [...this.breadcrumbs],
    };

    // Always log to console for debugging
    console.error('[ErrorMonitor] Captured error:', errorReport);

    // In production, send to monitoring service
    if (this.isProduction) {
      this.sendToMonitoringService(errorReport);
    }

    return errorReport;
  }

  /**
   * Capture a message (non-error event)
   */
  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    const messageReport = {
      message,
      level,
      context: {
        route: window.location.pathname,
        url: window.location.href,
        timestamp: new Date().toISOString(),
      },
      user: this.userContext,
      breadcrumbs: [...this.breadcrumbs],
    };

    console.log(`[ErrorMonitor] ${level.toUpperCase()}:`, messageReport);

    if (this.isProduction && level === 'error') {
      this.sendToMonitoringService(messageReport);
    }
  }

  /**
   * Send error report to monitoring service
   * This is a placeholder that can be replaced with Sentry, LogRocket, etc.
   */
  private async sendToMonitoringService(report: unknown) {
    try {
      // In a real implementation, this would send to Sentry/LogRocket/etc.
      // For now, we store in localStorage for debugging and could send to an edge function
      
      const storedErrors = JSON.parse(localStorage.getItem('error_reports') || '[]');
      storedErrors.push(report);
      
      // Keep only last 10 errors
      if (storedErrors.length > 10) {
        storedErrors.shift();
      }
      
      localStorage.setItem('error_reports', JSON.stringify(storedErrors));

      // Optional: Send to a backend endpoint
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(report),
      // });
    } catch {
      // Silently fail - don't disrupt user experience
      console.warn('[ErrorMonitor] Failed to send error report');
    }
  }

  /**
   * Get stored error reports (for debugging)
   */
  getStoredErrors() {
    try {
      return JSON.parse(localStorage.getItem('error_reports') || '[]');
    } catch {
      return [];
    }
  }

  /**
   * Clear stored error reports
   */
  clearStoredErrors() {
    localStorage.removeItem('error_reports');
  }
}

// Export singleton instance
export const errorMonitor = new ErrorMonitor();

// Export hook for React components
export function useErrorMonitor() {
  return {
    captureError: errorMonitor.captureError.bind(errorMonitor),
    captureMessage: errorMonitor.captureMessage.bind(errorMonitor),
    addBreadcrumb: errorMonitor.addBreadcrumb.bind(errorMonitor),
    setUser: errorMonitor.setUser.bind(errorMonitor),
    clearUser: errorMonitor.clearUser.bind(errorMonitor),
  };
}
