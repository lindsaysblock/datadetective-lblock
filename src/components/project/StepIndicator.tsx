
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

  return (
    <div className="container mx-auto px-6 mb-8">
      <div className="flex items-center justify-center gap-16">
        {steps.map((item, index) => (
          <div key={item.step} className="flex items-center">
            {/* Step Circle */}
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200
              ${currentStep === item.step 
                ? 'bg-blue-600 text-white shadow-lg' 
                : currentStep > item.step
                ? 'bg-gray-400 text-white'
                : 'border-2 border-gray-300 text-gray-400 bg-white'
              }
            `}>
              {item.step}
            </div>
            
            {/* Step Label */}
            <span className={`
              ml-3 text-sm font-medium transition-colors duration-200
              ${currentStep >= item.step ? 'text-gray-900' : 'text-gray-400'}
            `}>
              {item.label}
            </span>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`
                w-20 h-0.5 mx-8 transition-colors duration-200
                ${currentStep > item.step ? 'bg-gray-400' : 'bg-gray-300'}
              `} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
