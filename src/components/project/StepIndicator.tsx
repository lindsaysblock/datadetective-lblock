
import React from 'react';
import { FORM_STEPS } from '@/constants/ui';

interface StepIndicatorProps {
  currentStep: number;
}

interface Step {
  label: string;
  step: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  console.log('StepIndicator rendering with current step:', currentStep);

  const steps: Step[] = [
    { label: 'Question', step: FORM_STEPS.RESEARCH_QUESTION },
    { label: 'Data Source', step: FORM_STEPS.DATA_SOURCE },
    { label: 'Business Context', step: FORM_STEPS.BUSINESS_CONTEXT },
    { label: 'Analysis', step: FORM_STEPS.ANALYSIS_SUMMARY }
  ];

  const MAX_STEP_INDEX = steps.length - 1;
  
  return (
    <div className="flex items-center justify-center gap-8 mb-12 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      {steps.map((item, index) => (
        <div key={item.step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
            currentStep >= item.step 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'border-2 border-gray-300 text-gray-400 bg-white'
          }`}>
            {currentStep > item.step ? '✓' : item.step}
          </div>
          <span className={`ml-3 text-sm font-medium ${
            currentStep >= item.step ? 'text-gray-900' : 'text-gray-400'
          }`}>
            {item.label}
          </span>
          {index < MAX_STEP_INDEX && (
            <div className={`w-16 h-0.5 mx-6 ${
              currentStep > item.step ? 'bg-blue-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
