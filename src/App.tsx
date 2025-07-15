
import { Suspense } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ROUTES } from '@/config/routes';
import Index from '@/pages/Index';
import QueryHistory from '@/pages/QueryHistory';
import Auth from '@/pages/Auth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path={ROUTES.HOME} element={<Index />} />
              <Route path={ROUTES.QUERY_HISTORY} element={<QueryHistory />} />
              <Route path={ROUTES.AUTH} element={<Auth />} />
            </Routes>
          </Suspense>
          <Toaster />
        </Router>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
