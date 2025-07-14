
import React from 'react';
import Header from '@/components/Header';
import LegalFooter from '@/components/LegalFooter';

interface NewProjectLayoutProps {
  children: React.ReactNode;
}

const NewProjectLayout: React.FC<NewProjectLayoutProps> = ({ children }) => {
  console.log('NewProjectLayout rendering');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <LegalFooter />
    </div>
  );
};

export default NewProjectLayout;
