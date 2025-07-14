
import { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from './contexts/AuthContext';
import { EnhancedAnalyticsProvider } from './contexts/EnhancedAnalyticsContext';
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NewProject from "./pages/NewProject";
import QueryHistory from "./pages/QueryHistory";
import { LazyAdmin } from './components/LazyComponents';
import { preloadCriticalComponents } from './components/LazyComponents';
import { ErrorBoundary } from './components/common/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    },
  },
});

// Preload critical components after initial render
setTimeout(preloadCriticalComponents, 100);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <EnhancedAnalyticsProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/new-project" element={<NewProject />} />
                  <Route path="/query-history" element={<QueryHistory />} />
                  <Route 
                    path="/admin" 
                    element={
                      <Suspense fallback={<div className="p-8">Loading admin panel...</div>}>
                        <LazyAdmin />
                      </Suspense>
                    } 
                  />
                </Routes>
              </ErrorBoundary>
            </BrowserRouter>
          </TooltipProvider>
        </EnhancedAnalyticsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
