
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface E2ETestProgressProps {
  isRunning: boolean;
  progress: number;
  currentStep: string;
}

const E2ETestProgress: React.FC<E2ETestProgressProps> = ({
  isRunning,
  progress,
  currentStep
}) => {
  if (!isRunning) return null;

  return (
    <div className="space-y-2">
      <Progress value={progress} className="w-full" />
      {currentStep && (
        <p className="text-sm text-gray-600">{currentStep}</p>
      )}
    </div>
  );
};

export default E2ETestProgress;
