
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Index from './pages/Index';
import Home from './pages/Home';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import NewProject from './pages/NewProject';
import QueryHistory from './pages/QueryHistory';
import Profile from './pages/Profile';
import QARunner from './components/QARunner';
import AutoRefactorPrompts from './components/AutoRefactorPrompts';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/new-project" element={<NewProject />} />
            <Route path="/query-history" element={<QueryHistory />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <QARunner />
          <AutoRefactorPrompts />
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
