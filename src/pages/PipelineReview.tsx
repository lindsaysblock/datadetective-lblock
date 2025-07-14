
import React from 'react';
import AnalyticsPipelineReview from '@/components/testing/AnalyticsPipelineReview';

const PipelineReview = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analytics Pipeline Review
          </h1>
          <p className="text-gray-600">
            Comprehensive end-to-end analytics pipeline analysis and optimization
          </p>
        </div>
        
        <AnalyticsPipelineReview />
      </div>
    </div>
  );
};

export default PipelineReview;
