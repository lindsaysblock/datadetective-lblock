/**
 * Data Detective Header Component
 * Branded header for the new project flow
 */

import React from 'react';
import { Search, Database, TrendingUp } from 'lucide-react';
import { SPACING, TEXT_SIZES } from '@/constants/ui';

const DataDetectiveHeader: React.FC = () => {
  return (
    <div className="text-center mb-12">
      {/* Mission Statement */}
      <div className={`max-w-3xl mx-auto p-${SPACING.LG} bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200`}>
        <div className="flex items-center justify-center gap-2 mb-4">
          <TrendingUp className={`w-${SPACING.MD} h-${SPACING.MD} text-blue-600`} />
          <h2 className="text-xl font-semibold text-gray-800">Start Your Investigation</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          Transform your data into actionable insights with our AI-powered analytics engine. 
          Upload your datasets, ask research questions, and let our platform uncover hidden patterns, 
          trends, and correlations that drive informed decision-making.
        </p>
      </div>
    </div>
  );
};

export default DataDetectiveHeader;