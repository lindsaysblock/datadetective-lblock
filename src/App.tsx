
import React from "react";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  // Add debugging to understand the issue
  console.log("App rendering - React:", React);
  console.log("React.version:", React.version);
  console.log("QueryClient:", queryClient);
  
  if (!React) {
    console.error("React is not available!");
    return <div>Loading...</div>;
  }
  
  return (
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
  );
}

export default App;
