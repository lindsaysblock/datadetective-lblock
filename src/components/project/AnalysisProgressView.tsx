
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Database, Brain, BarChart3, CheckCircle } from 'lucide-react';

interface AnalysisProgressViewProps {
  isAnalyzing: boolean;
  onComplete: () => void;
  onProgressUpdate?: (progress: number) => void;
}

const AnalysisProgressView: React.FC<AnalysisProgressViewProps> = ({
  isAnalyzing,
  onComplete,
  onProgressUpdate
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(45);

  const analysisSteps = [
    { icon: Database, title: 'Parsing Data Structure', description: 'Understanding your data format and columns' },
    { icon: Brain, title: 'Analyzing Patterns', description: 'Identifying trends and relationships in your data' },
    { icon: BarChart3, title: 'Generating Insights', description: 'Creating meaningful insights from the analysis' },
    { icon: CheckCircle, title: 'Finalizing Results', description: 'Preparing your comprehensive analysis report' }
  ];

  useEffect(() => {
    if (!isAnalyzing) {
      setProgress(0);
      setCurrentStep(0);
      setTimeRemaining(45);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = Math.min(prev + 2, 100);
        
        // Update current step based on progress
        const stepIndex = Math.floor((newProgress / 100) * analysisSteps.length);
        setCurrentStep(Math.min(stepIndex, analysisSteps.length - 1));
        
        // Update time remaining
        setTimeRemaining(Math.max(0, Math.floor(45 * (1 - newProgress / 100))));
        
        // Notify parent of progress update
        if (onProgressUpdate) {
          onProgressUpdate(newProgress);
        }
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 1000);
          return 100;
        }
        
        return newProgress;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isAnalyzing, onComplete, onProgressUpdate]);

  if (!isAnalyzing) return null;

  const CurrentIcon = analysisSteps[currentStep]?.icon || Database;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4 shadow-2xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CurrentIcon className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Detective Analysis in Progress</h2>
            <p className="text-gray-600">Analyzing your data to uncover insights</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-700">Current Step</span>
              <span className="text-sm text-blue-600">
                {timeRemaining}s remaining
              </span>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-1">
                {analysisSteps[currentStep]?.title}
              </h3>
              <p className="text-blue-700 text-sm">
                {analysisSteps[currentStep]?.description}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {analysisSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-800'
                      : isCompleted
                      ? 'bg-green-50 text-green-700'
                      : 'text-gray-400'
                  }`}
                >
                  <StepIcon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                  <span className="text-sm font-medium">{step.title}</span>
                  {isCompleted && (
                    <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalysisProgressView;
