
import { useState } from 'react';
import { Activity, Settings, BarChart3, Zap, CheckCircle } from 'lucide-react';

interface TestResult {
  step: string;
  status: 'success' | 'warning' | 'error';
  details: string;
  timestamp: Date;
  optimizations?: string[];
}

export const useE2ETestLogic = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [optimizationsApplied, setOptimizationsApplied] = useState<string[]>([]);

  const testSteps = [
    { name: 'System Health Check', icon: Settings, weight: 15 },
    { name: 'Performance Analysis', icon: BarChart3, weight: 25 },
    { name: 'QA Analysis', icon: Settings, weight: 20 },
    { name: 'Load Testing', icon: Activity, weight: 20 },
    { name: 'Optimization Application', icon: Zap, weight: 15 },
    { name: 'Final Verification', icon: CheckCircle, weight: 5 }
  ];

  return {
    isRunning,
    currentStep,
    progress,
    testResults,
    optimizationsApplied,
    setIsRunning,
    setCurrentStep,
    setProgress,
    setTestResults,
    setOptimizationsApplied,
    testSteps
  };
};
