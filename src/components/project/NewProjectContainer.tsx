import React from 'react';

/**
 * Minimal test version of NewProjectContainer to debug rendering issues
 */
const NewProjectContainer: React.FC = () => {
  console.log('🔍 NewProjectContainer - MINIMAL VERSION RENDERING');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">New Project - Test Version</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg text-gray-700">
            🔍 This is a minimal test version to verify rendering works.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            If you can see this message, the basic component is working.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewProjectContainer;