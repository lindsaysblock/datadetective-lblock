import React from 'react';

/**
 * Direct test of NewProject page to bypass container issues
 */
const NewProject = () => {
  console.log('🔍 NewProject page - DIRECT RENDER TEST');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔍 New Project - Direct Test
          </h1>
          <p className="text-xl text-gray-600">
            Testing direct page render without container
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-semibold text-green-600 mb-4">
              Page is Working!
            </h2>
            <p className="text-gray-700 mb-6">
              If you can see this message, the basic routing and React rendering is working.
              The issue was likely with complex component dependencies.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
              <ul className="text-left text-blue-800 space-y-1">
                <li>• ✅ Routing is working</li>
                <li>• ✅ React rendering is working</li>
                <li>• 🔧 Need to rebuild form components carefully</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProject;