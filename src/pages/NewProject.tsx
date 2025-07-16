import React from 'react';

const SPACING = {
  LARGE: 8,
  MEDIUM: 4,
  SMALL: 2,
} as const;

const TEXT_SIZES = {
  HEADING: 'text-4xl',
  SUBHEADING: 'text-2xl', 
  BODY: 'text-xl',
  ICON: 'text-6xl',
} as const;

/**
 * Direct test of NewProject page to bypass container issues
 */
const NewProject: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className={`text-center mb-${SPACING.LARGE}`}>
          <h1 className={`${TEXT_SIZES.HEADING} font-bold text-gray-900 mb-${SPACING.MEDIUM}`}>
            🔍 New Project - Direct Test
          </h1>
          <p className={`${TEXT_SIZES.BODY} text-gray-600`}>
            Testing direct page render without container
          </p>
        </div>
        
        <div className={`bg-white rounded-lg shadow-lg p-${SPACING.LARGE}`}>
          <div className="text-center">
            <div className={`${TEXT_SIZES.ICON} mb-${SPACING.MEDIUM}`}>✅</div>
            <h2 className={`${TEXT_SIZES.SUBHEADING} font-semibold text-green-600 mb-${SPACING.MEDIUM}`}>
              Page is Working!
            </h2>
            <p className={`text-gray-700 mb-6`}>
              If you can see this message, the basic routing and React rendering is working.
              The issue was likely with complex component dependencies.
            </p>
            
            <div className={`bg-blue-50 p-${SPACING.MEDIUM} rounded-lg`}>
              <h3 className={`font-semibold text-blue-900 mb-${SPACING.SMALL}`}>Next Steps:</h3>
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