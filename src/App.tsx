
/**
 * Main Application Component
 * Refactored to meet coding standards with centralized constants and proper error handling
 */

import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ROUTES } from '@/config/routes';
import { CACHE_TIMES, RETRY_COUNTS, SPACING } from '@/constants/ui';
import Index from '@/pages/Index';
import QueryHistory from '@/pages/QueryHistory';
import Auth from '@/pages/Auth';
import NewProject from '@/pages/NewProject';
import Analysis from '@/pages/Analysis';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';
import NotFound from '@/pages/NotFound';
import DataValidationDebug from '@/pages/DataValidationDebug';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: CACHE_TIMES.STALE_TIME,
      gcTime: CACHE_TIMES.GC_TIME,
      retry: RETRY_COUNTS.DEFAULT,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ErrorBoundary>
          <Router>
            <div className="min-h-screen bg-background">
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className={`animate-spin rounded-full h-${SPACING.XL} w-${SPACING.XL} border-b-2 border-primary`}></div>
                </div>
              }>
                <Routes>
                  <Route path={ROUTES.HOME} element={<Index />} />
                  <Route path={ROUTES.QUERY_HISTORY} element={<QueryHistory />} />
                  <Route path={ROUTES.AUTH} element={<Auth />} />
                  <Route path={ROUTES.NEW_PROJECT} element={<NewProject />} />
                  <Route path="/analysis" element={<Analysis />} />
                  <Route path={ROUTES.PROFILE} element={<Profile />} />
                  <Route path={ROUTES.ADMIN} element={<Admin />} />
                  <Route path="/debug" element={<DataValidationDebug />} />
                  <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
                </Routes>
              </Suspense>
              <Toaster />
            </div>
          </Router>
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
