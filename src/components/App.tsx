
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, Suspense, lazy } from "react";
import { performanceMonitor, trackMemory } from "../utils/performance/performanceMonitor";

// Lazy load pages for better performance
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Home = lazy(() => import("../pages/Home"));
const Profile = lazy(() => import("../pages/Profile"));
const NewProject = lazy(() => import("../pages/NewProject"));
const NotFound = lazy(() => import("../pages/NotFound"));
const QueryHistory = lazy(() => import("../pages/QueryHistory"));
const QADashboard = lazy(() => import("../pages/QADashboard"));

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});

// Loading component for Suspense
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const App = () => {
  useEffect(() => {
    console.log('📱 Main app loaded successfully');
    
    // Start performance monitoring
    performanceMonitor.startMetric('App Initialization');
    
    // Track initial memory usage
    trackMemory();
    
    // Set up periodic memory monitoring with optimization
    const memoryInterval = setInterval(() => {
      const snapshot = trackMemory();
      if (snapshot && performanceMonitor.detectMemoryLeaks()) {
        console.warn('🚨 Memory leak detected in App component');
        // Trigger garbage collection if available
        if (window.gc) {
          window.gc();
        }
      }
    }, 60000); // Reduced frequency to every 60 seconds
    
    // Optimized route change monitoring
    const handleRouteChange = () => {
      performanceMonitor.startMetric('Route Change');
      trackMemory();
      
      // End route change measurement after a short delay
      setTimeout(() => {
        performanceMonitor.endMetric('Route Change');
      }, 100);
    };
    
    // More efficient path monitoring
    let currentPath = window.location.pathname;
    const pathCheckInterval = setInterval(() => {
      if (window.location.pathname !== currentPath) {
        currentPath = window.location.pathname;
        handleRouteChange();
      }
    }, 500); // Reduced frequency
    
    performanceMonitor.endMetric('App Initialization');
    
    return () => {
      clearInterval(memoryInterval);
      clearInterval(pathCheckInterval);
      
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
        <Toaster position="top-right" />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/new-project" element={<NewProject />} />
                <Route path="/query-history" element={<QueryHistory />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/qa-dashboard" element={<QADashboard />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </Suspense>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
