
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import DataUploadFlowWrapper from './components/DataUploadFlowWrapper';
import QueryBuilder from './components/QueryBuilder';
import QueryHistory from './pages/QueryHistory';
import DashboardTabsWrapper from './components/DashboardTabsWrapper';
import AdminDashboard from './components/admin/AdminDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/new-project" replace />} />
            <Route path="/new-project" element={<DataUploadFlowWrapper />} />
            <Route path="/query-builder" element={<QueryBuilder />} />
            <Route path="/query-history" element={<QueryHistory />} />
            <Route path="/dashboard" element={<DashboardTabsWrapper />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/new-project" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
