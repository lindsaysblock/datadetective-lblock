
import React from 'react';
import { Activity, Settings, BarChart3, Zap, CheckCircle } from 'lucide-react';

interface TestStep {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  weight: number;
}

interface TestCoverageIndicatorProps {
  testSteps: TestStep[];
}

const TestCoverageIndicator: React.FC<TestCoverageIndicatorProps> = ({ testSteps }) => {
  return (
    <div className="border-t pt-4">
      <h4 className="font-medium mb-2">Test Coverage Areas</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {testSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
              <Icon className="w-4 h-4 text-gray-600" />
              <span className="text-sm">{step.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestCoverageIndicator;
