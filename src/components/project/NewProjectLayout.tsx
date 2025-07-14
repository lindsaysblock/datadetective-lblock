
import React from 'react';

interface NewProjectLayoutProps {
  children: React.ReactNode;
}

const NewProjectLayout: React.FC<NewProjectLayoutProps> = ({ children }) => {
  console.log('NewProjectLayout rendering');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default NewProjectLayout;
