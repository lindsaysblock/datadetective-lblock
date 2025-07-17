
import React from 'react';

interface NewProjectLayoutProps {
  children: React.ReactNode;
}

const NewProjectLayout: React.FC<NewProjectLayoutProps> = ({ children }) => {
  console.log('NewProjectLayout rendering');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 py-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Start New Project
          </h1>
          <p className="text-lg text-gray-600">
            Let's explore your data together
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 py-8">
        {children}
      </div>
    </div>
  );
};

export default NewProjectLayout;
