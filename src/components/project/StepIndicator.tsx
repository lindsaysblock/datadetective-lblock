
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
          {index < MAX_STEP_INDEX && (
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
