
import React from 'react';
import Header from '@/components/Header';

interface NewProjectLayoutProps {
  children: React.ReactNode;
}

const NewProjectLayout: React.FC<NewProjectLayoutProps> = ({ children }) => {
  console.log('🚀 NewProjectLayout rendering with Header component');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default NewProjectLayout;
