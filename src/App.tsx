
import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ROUTES } from '@/config/routes';
import Index from '@/pages/Index';
import QueryHistory from '@/pages/QueryHistory';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import NewProject from '@/pages/NewProject';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';
import QADashboard from '@/pages/QADashboard';
import QARunner from '@/pages/QARunner';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
      retry: 1,
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
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              }>
                <Routes>
                  <Route path={ROUTES.HOME} element={<Index />} />
                  <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                  <Route path={ROUTES.QUERY_HISTORY} element={<QueryHistory />} />
                  <Route path={ROUTES.AUTH} element={<Auth />} />
                  <Route path={ROUTES.NEW_PROJECT} element={<NewProject />} />
                  <Route path={ROUTES.PROFILE} element={<Profile />} />
                  <Route path={ROUTES.ADMIN} element={<Admin />} />
                  <Route path={ROUTES.QA_DASHBOARD} element={<QADashboard />} />
                  <Route path={ROUTES.QA_RUNNER} element={<QARunner />} />
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
