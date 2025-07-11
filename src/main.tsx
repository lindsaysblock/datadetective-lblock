
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import NewProject from './pages/NewProject.tsx'
import { Toaster } from "@/components/ui/toaster"
import './index.css'

createRoot(document.getElementById("root")!).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/new-project" element={<NewProject />} />
    </Routes>
    <Toaster />
  </Router>
);
