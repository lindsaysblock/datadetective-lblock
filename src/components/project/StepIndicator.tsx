
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { label: 'Question', step: 1 },
    { label: 'Data Source', step: 2 },
    { label: 'Business Context', step: 3 },
    { label: 'Analysis', step: 4 }
  ];

  return (
    <div className="flex items-center justify-center gap-8 mb-12">
      {steps.map((item, index) => (
        <div key={item.step} className="flex items-center">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
            currentStep >= item.step 
              ? 'bg-blue-500 text-white' 
              : 'border border-gray-300 text-gray-400 bg-white'
          }`}>
            {currentStep > item.step ? '✓' : item.step}
          </div>
          <span className={`ml-2 text-sm ${
            currentStep >= item.step ? 'text-gray-700' : 'text-gray-400'
          }`}>
            {item.label}
          </span>
          {index < 3 && (
            <div className={`w-12 h-px mx-4 ${
              currentStep > item.step ? 'bg-blue-500' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
