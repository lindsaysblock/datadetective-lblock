
import React, { memo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import { performanceMonitor, trackMemory } from './utils/performance/performanceMonitor';

// Lazy load components for better performance
const NewProject = React.lazy(() => import('./pages/NewProject'));
const QueryHistory = React.lazy(() => import('./pages/QueryHistory'));
const Index = React.lazy(() => import('./pages/Index'));

// Create query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1, // Reduce retries for better performance
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
    },
  },
});

// Memoized route components
const MemoizedNewProject = memo(NewProject);
const MemoizedQueryHistory = memo(QueryHistory);
const MemoizedIndex = memo(Index);

function App() {
  useEffect(() => {
    console.log('🚀 App component mounted');
    // Performance monitoring setup
    performanceMonitor.startMetric('App Initialization');
    trackMemory();
    
    // Memory leak detection
    const memoryInterval = setInterval(() => {
      const snapshot = trackMemory();
      if (snapshot && performanceMonitor.detectMemoryLeaks()) {
        console.warn('🚨 Memory leak detected');
      }
    }, 60000); // Check every minute
    
    performanceMonitor.endMetric('App Initialization');
    
    return () => {
      clearInterval(memoryInterval);
      performanceMonitor.cleanup();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={300}>
        <Toaster position="top-right" />
        <BrowserRouter>
          <React.Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<MemoizedIndex />} />
              <Route path="/new-project" element={<MemoizedNewProject />} />
              <Route path="/query-history" element={<MemoizedQueryHistory />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </React.Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default memo(App);
