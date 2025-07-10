
import React from 'react';
import FinalQARunner from '../components/FinalQARunner';

const FinalQA: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Final QA & Compliance Validation
          </h1>
          <p className="text-gray-600">
            Running comprehensive tests before publication
          </p>
        </div>
        
        <FinalQARunner />
      </div>
    </div>
  );
};

export default FinalQA;
