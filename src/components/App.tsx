
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "../pages/Index";
import Auth from "../pages/Auth";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import NewProject from "../pages/NewProject";
import NotFound from "../pages/NotFound";
import QueryHistory from "../pages/QueryHistory";
import BehavioralAnalysisDemo from "../pages/BehavioralAnalysisDemo";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // App loaded successfully
    console.log('📱 Main app loaded successfully');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/new-project" element={<NewProject />} />
              <Route path="/query-history" element={<QueryHistory />} />
              <Route path="/behavioral-demo" element={<BehavioralAnalysisDemo />} />
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
