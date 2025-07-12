
import React from 'react';
import AutoE2ETestRunner from '@/components/testing/AutoE2ETestRunner';

const TestRunner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            E2E Test Runner
          </h1>
          <p className="text-gray-600">
            Comprehensive end-to-end testing with automatic error resolution
          </p>
        </div>
        
        <AutoE2ETestRunner />
      </div>
    </div>
  );
};

export default TestRunner;
