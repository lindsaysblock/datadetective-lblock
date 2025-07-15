
import React, { ReactNode } from 'react';

interface ReactReadinessCheckProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ReactReadinessCheck: React.FC<ReactReadinessCheckProps> = ({ 
  children, 
  fallback 
}) => {
  // Verify React is fully available
  if (!React || !React.version || !React.useEffect) {
    console.error("React is not fully initialized:", {
      React: !!React,
      version: React?.version,
      useEffect: !!React?.useEffect
    });
    
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-red-600">React initialization error. Please refresh the page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ReactReadinessCheck;
