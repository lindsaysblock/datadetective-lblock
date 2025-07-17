import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Database, TrendingUp, FileSearch, Brain } from 'lucide-react';

interface AnalysisProgressModalProps {
  isOpen: boolean;
  progress: number;
  onComplete: () => void;
  projectName: string;
}

const AnalysisProgressModal: React.FC<AnalysisProgressModalProps> = ({
  isOpen,
  progress,
  onComplete,
  projectName
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [eta, setEta] = useState(45);
  const [startTime] = useState(Date.now());

  const analysisSteps = [
    { 
      name: 'Loading Data', 
      icon: Database, 
      description: 'Reading and parsing your data files',
      threshold: 10 
    },
    { 
      name: 'Data Quality Check', 
      icon: FileSearch, 
      description: 'Validating data integrity and structure',
      threshold: 25 
    },
    { 
      name: 'Pattern Analysis', 
      icon: TrendingUp, 
      description: 'Identifying trends and patterns in your data',
      threshold: 50 
    },
    { 
      name: 'Statistical Analysis', 
      icon: Brain, 
      description: 'Running advanced statistical computations',
      threshold: 75 
    },
    { 
      name: 'Generating Insights', 
      icon: CheckCircle, 
      description: 'Creating actionable insights and recommendations',
      threshold: 95 
    }
  ];

  // Update current step based on progress
  useEffect(() => {
    const step = analysisSteps.findIndex((step, index) => {
      const nextStep = analysisSteps[index + 1];
      return progress >= step.threshold && (!nextStep || progress < nextStep.threshold);
    });
    setCurrentStep(Math.max(0, step));
  }, [progress]);

  // Update ETA calculation
  useEffect(() => {
    if (progress > 0 && progress < 100) {
      const elapsed = (Date.now() - startTime) / 1000;
      const estimatedTotal = (elapsed / progress) * 100;
      const remaining = Math.max(0, Math.round(estimatedTotal - elapsed));
      setEta(remaining);
    }
  }, [progress, startTime]);

  // Auto-close and redirect when complete
  useEffect(() => {
    console.log('🔍 [MODAL] Progress check:', { progress, isComplete: progress >= 100 });
    if (progress >= 100) {
      console.log('✅ [MODAL] Analysis complete! Setting 1-second timer before calling onComplete');
      const timer = setTimeout(() => {
        console.log('🚀 [MODAL] Timer fired, calling onComplete callback now');
        onComplete();
      }, 1000); // Reduced to 1 second for faster navigation

      return () => {
        console.log('🧹 [MODAL] Cleaning up completion timer');
        clearTimeout(timer);
      };
    }
  }, [progress, onComplete]);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">{/* No close button needed, auto-redirects */}
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gray-900">
            🕵️ Analyzing Your Data
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Project Info */}
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 truncate">{projectName}</h3>
            <p className="text-sm text-gray-600">Investigation in progress...</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                {progress < 100 ? 'Processing...' : 'Complete!'}
              </span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500">
                  {progress < 100 ? `${eta}s remaining` : 'Completing...'}
                </span>
              </div>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="text-center">
              <span className="text-lg font-bold text-blue-600">{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Analysis Steps */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Analysis Steps:</h4>
            {analysisSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = progress >= step.threshold;
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-50 border border-blue-200' 
                      : isCompleted 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isActive 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        isActive ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-gray-700'
                      }`}>
                        {step.name}
                      </span>
                      {isActive && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          In Progress
                        </Badge>
                      )}
                      {isCompleted && index !== currentStep && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                    <p className={`text-xs ${
                      isActive ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Completion Message */}
          {progress >= 100 && (
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold text-green-900">Analysis Complete!</h4>
              <p className="text-sm text-green-700">
                Redirecting you to the analysis results...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisProgressModal;