import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { performanceMonitor, trackMemory } from "../utils/performance/performanceMonitor";
import Index from "../pages/Index";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import NewProject from "../pages/NewProject";
import NotFound from "../pages/NotFound";
import QueryHistory from "../pages/QueryHistory";
import Dashboard from "../pages/Dashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    },
  },
});

const App = () => {
  useEffect(() => {
    console.log('📱 Main app loaded successfully');
    
    // Start performance monitoring
    performanceMonitor.startMetric('App Initialization');
    
    // Track initial memory usage
    trackMemory();
    
    // Set up periodic memory monitoring
    const memoryInterval = setInterval(() => {
      const snapshot = trackMemory();
      if (snapshot && performanceMonitor.detectMemoryLeaks()) {
        console.warn('🚨 Memory leak detected in App component');
      }
    }, 30000); // Every 30 seconds
    
    // Performance monitoring for route changes
    const handleRouteChange = () => {
      performanceMonitor.startMetric('Route Change');
      trackMemory();
      
      // End route change measurement after a short delay
      setTimeout(() => {
        performanceMonitor.endMetric('Route Change');
      }, 100);
    };
    
    // Listen for route changes (simple approach)
    let currentPath = window.location.pathname;
    const pathInterval = setInterval(() => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        handleRouteChange();
      }
    }, 100);
    
    performanceMonitor.endMetric('App Initialization');
    
    return () => {
      clearInterval(memoryInterval);
      clearInterval(pathInterval);
      
      // Generate final performance report
      const report = performanceMonitor.generateReport();
      console.log('📊 App Performance Report:', report.summary);
      
      // Cleanup performance monitor
      performanceMonitor.cleanup();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/new-project" element={<NewProject />} />
              <Route path="/query-history" element={<QueryHistory />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
