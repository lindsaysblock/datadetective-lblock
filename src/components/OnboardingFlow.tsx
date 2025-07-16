
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ChevronRight, ChevronLeft, Upload, Database, BarChart3, Lightbulb, X } from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: string;
  target?: string;
}

interface OnboardingFlowProps {
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip }) => {
  const INITIAL_STEP = 0;
  const [currentStep, setCurrentStep] = useState(INITIAL_STEP);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Welcome to Data Detective",
      description: "Your AI-powered business intelligence companion. Let's get you started with a quick tour of the key features.",
      icon: <Lightbulb className="w-8 h-8 text-blue-500" />
    },
    {
      id: 2,
      title: "Connect Your Data",
      description: "Upload CSV files, connect to databases, or integrate with APIs. Start by uploading a sample dataset to explore the platform.",
      icon: <Upload className="w-8 h-8 text-green-500" />,
      action: "Upload a file",
      target: "connect-tab"
    },
    {
      id: 3,
      title: "Build SQL Queries",
      description: "Use our visual query builder or learn SQL step-by-step with our interactive tutorial. Perfect for both beginners and experts.",
      icon: <Database className="w-8 h-8 text-purple-500" />,
      action: "Try the query builder",
      target: "query-tab"
    },
    {
      id: 4,
      title: "Create Visualizations",
      description: "Transform your data into beautiful charts and dashboards. Our AI will suggest the best visualization types for your data.",
      icon: <BarChart3 className="w-8 h-8 text-orange-500" />,
      action: "Explore visualizations",
      target: "visualize-tab"
    },
    {
      id: 5,
      title: "Generate Insights",
      description: "Let AI analyze your data and discover patterns, trends, and actionable insights automatically.",
      icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
      action: "Get AI insights",
      target: "insights-tab"
    }
  ];

  const PROGRESS_MULTIPLIER = 100;
  const progress = ((currentStep + 1) / steps.length) * PROGRESS_MULTIPLIER;

  const handleNext = (): void => {
    const lastStepIndex = steps.length - 1;
    if (currentStep < lastStepIndex) {
      setCurrentStep(currentStep + 1);
      setCompletedSteps([...completedSteps, currentStep]);
    } else {
      setCompletedSteps([...completedSteps, currentStep]);
      onComplete();
    }
  };

  const handlePrevious = (): void => {
    if (currentStep > INITIAL_STEP) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 relative">
        <Button
          onClick={onSkip}
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="space-y-6">
          {/* Progress Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline">
                Step {currentStep + 1} of {steps.length}
              </Badge>
              <Button variant="outline" size="sm" onClick={onSkip}>
                Skip Tour
              </Button>
            </div>
            <Progress value={progress} className="w-full" />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center space-x-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => handleStepClick(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-blue-500'
                    : completedSteps.includes(index)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Current Step Content */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              {currentStepData.icon}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-3">{currentStepData.title}</h2>
              <p className="text-gray-600 leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            {currentStepData.action && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-800 font-medium">
                  💡 Next: {currentStepData.action}
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
