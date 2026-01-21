import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import { RouteTracker } from "@/components/RouteTracker";
import { LoadingBar } from "@/components/LoadingBar";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ListProperty from "./pages/ListProperty";
import MapView from "./pages/MapView";
import NotFound from "./pages/NotFound";
import { WhatsAppButton } from "./components/WhatsAppButton";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Prevent queries from throwing errors to the error boundary
      throwOnError: false,
      retry: 1,
      // Add stale time to prevent unnecessary refetches
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => (
  // Global error boundary catches any uncaught errors at app root
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Route change tracker for error monitoring */}
          <RouteTracker />
          {/* Loading indicator for route transitions */}
          <LoadingBar />
          
          <Routes>
            <Route path="/" element={
              <RouteErrorBoundary pageName="Home">
                <Index />
              </RouteErrorBoundary>
            } />
            <Route path="/properties" element={
              <RouteErrorBoundary pageName="Properties">
                <Properties />
              </RouteErrorBoundary>
            } />
            <Route path="/property/:id" element={
              <RouteErrorBoundary pageName="Property Details">
                <PropertyDetail />
              </RouteErrorBoundary>
            } />
            <Route path="/map" element={
              <RouteErrorBoundary pageName="Map View">
                <MapView />
              </RouteErrorBoundary>
            } />
            <Route path="/about" element={
              <RouteErrorBoundary pageName="About">
                <About />
              </RouteErrorBoundary>
            } />
            <Route path="/contact" element={
              <RouteErrorBoundary pageName="Contact">
                <Contact />
              </RouteErrorBoundary>
            } />
            <Route path="/list-property" element={
              <RouteErrorBoundary pageName="List Property">
                <ListProperty />
              </RouteErrorBoundary>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <WhatsAppButton />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
