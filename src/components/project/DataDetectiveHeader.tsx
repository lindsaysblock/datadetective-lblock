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

      {/* Feature Highlights */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-${SPACING.LG} mt-${SPACING.XL} max-w-4xl mx-auto`}>
        {[
          {
            icon: Search,
            title: 'Smart Analysis',
            description: 'AI-powered insights from your data'
          },
          {
            icon: Database,
            title: 'Multiple Formats',
            description: 'CSV, JSON, Excel and more'
          },
          {
            icon: TrendingUp,
            title: 'Visual Reports',
            description: 'Interactive charts and dashboards'
          }
        ].map((feature, index) => (
          <div key={index} className={`text-center p-${SPACING.LG} bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow`}>
            <div className={`w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mx-auto mb-${SPACING.MD}`}>
              <feature.icon className={`w-${SPACING.LG} h-${SPACING.LG} text-blue-600`} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataDetectiveHeader;