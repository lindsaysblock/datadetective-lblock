import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"
import Index from './pages/Index';
import Auth from './pages/Auth';
import AnalysisPage from './pages/AnalysisPage';
import { QueryClient } from 'react-query';
import ProtectedRoute from './components/ProtectedRoute';
import QARunner from './components/QARunner';
import BehavioralAnalysisDemo from "./pages/BehavioralAnalysisDemo";

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Toaster />
          <QARunner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/demo" element={<BehavioralAnalysisDemo />} />
            <Route path="/analysis/:datasetId" element={
              <ProtectedRoute>
                <AnalysisPage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
