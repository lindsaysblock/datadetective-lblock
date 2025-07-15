
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Ensure React is fully available before rendering
console.log("Main.tsx - React available:", !!React);
console.log("Main.tsx - React version:", React.version);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);

// Wrap in StrictMode to catch React issues early
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
