
import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NewProject from "./pages/NewProject";
import Dashboard from "./pages/Dashboard";
import QueryHistory from "./pages/QueryHistory";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import { ErrorBoundary } from "./components/common/ErrorBoundary";

function App() {
  const [isReactReady, setIsReactReady] = useState(false);
  const [queryClient, setQueryClient] = useState<QueryClient | null>(null);

  // Ensure React is fully initialized before proceeding
  useEffect(() => {
    console.log("App useEffect - React:", React);
    console.log("App useEffect - React.version:", React.version);
    
    if (React && React.version) {
      // Initialize QueryClient only after React is confirmed to be ready
      const client = new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      });
      
      console.log("QueryClient initialized:", client);
      setQueryClient(client);
      setIsReactReady(true);
    } else {
      console.error("React is not fully available!");
    }
  }, []);

  // Show loading state while React initializes
  if (!isReactReady || !queryClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Initializing application...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/new-project" element={<NewProject />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/query-history" element={<QueryHistory />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
