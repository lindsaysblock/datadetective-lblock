
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
import QARunner from "./QARunner";
import AutoRefactorPrompts from "./AutoRefactorPrompts";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Run initial QA analysis after app loads
    const timer = setTimeout(() => {
      console.log('🔍 App loaded, QA Runner will initialize comprehensive analysis...');
    }, 1000);
    
    return () => clearTimeout(timer);
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
            <QARunner />
            <AutoRefactorPrompts />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
