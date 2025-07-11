
import React, { memo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';
import NewProject from './pages/NewProject';
import QueryHistory from './pages/QueryHistory';
import Index from './pages/Index';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    },
  },
});

// Memoize components to prevent unnecessary re-renders
const MemoizedNewProject = memo(NewProject);
const MemoizedQueryHistory = memo(QueryHistory);
const MemoizedIndex = memo(Index);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MemoizedIndex />} />
            <Route path="/new-project" element={<MemoizedNewProject />} />
            <Route path="/query-history" element={<MemoizedQueryHistory />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default memo(App);
