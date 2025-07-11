
import React from 'react';
import AnalysisSimulationTest from '@/components/analysis/AnalysisSimulationTest';

const AnalysisTest: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Analysis Engine Testing
          </h1>
          <p className="text-gray-600">
            Comprehensive testing suite for the data analysis engine with generated datasets
          </p>
        </div>
        
        <AnalysisSimulationTest />
      </div>
    </div>
  );
};

export default AnalysisTest;
