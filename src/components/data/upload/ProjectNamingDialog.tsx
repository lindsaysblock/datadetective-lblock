
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Loader2, Brain, CheckCircle, Clock, BarChart3 } from 'lucide-react';

interface ProjectNamingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (projectName: string) => void;
  onViewResults?: () => void;
  isProcessing?: boolean;
  analysisProgress?: number;
  analysisCompleted?: boolean;
}

const ProjectNamingDialog: React.FC<ProjectNamingDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  onViewResults,
  isProcessing = false,
  analysisProgress = 0,
  analysisCompleted = false
}) => {
  const [autoCloseTimer, setAutoCloseTimer] = useState(3);

  // Auto-close when analysis completes
  useEffect(() => {
    if (analysisCompleted && onViewResults) {
      const timer = setInterval(() => {
        setAutoCloseTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onViewResults();
            onOpenChange(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [analysisCompleted, onViewResults, onOpenChange]);

  const getEstimatedTime = () => {
    if (analysisProgress < 25) return '45-60 seconds remaining';
    if (analysisProgress < 50) return '30-45 seconds remaining';
    if (analysisProgress < 75) return '15-30 seconds remaining';
    if (analysisProgress < 90) return '5-15 seconds remaining';
    return 'Almost done...';
  };

  const getProgressPhase = () => {
    if (analysisProgress < 20) return 'Parsing your data...';
    if (analysisProgress < 40) return 'Identifying patterns...';
    if (analysisProgress < 60) return 'Running statistical analysis...';
    if (analysisProgress < 80) return 'Generating insights...';
    if (analysisProgress < 95) return 'Preparing visualizations...';
    return 'Finalizing results...';
  };

  // Only show if processing or completed
  if (!isProcessing && !analysisCompleted) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      // Only allow closing if analysis is complete
      if (!isProcessing || analysisCompleted) {
        onOpenChange(newOpen);
      }
    }}>
      <DialogContent 
        className="sm:max-w-lg" 
        onPointerDownOutside={(e) => {
          // Prevent closing during processing
          if (isProcessing && !analysisCompleted) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {analysisCompleted ? (
              <>
                <CheckCircle className="w-6 h-6 text-green-600" />
                Analysis Complete!
              </>
            ) : (
              <>
                <BarChart3 className="w-6 h-6 text-blue-600 animate-pulse" />
                Analyzing Your Data
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-base">
            {analysisCompleted ? 
              `Redirecting to results in ${autoCloseTimer} seconds...` :
              "Please wait while we process your analysis"
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {analysisCompleted ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-700">Analysis Successful!</h3>
                <p className="text-gray-600">Your data has been analyzed and insights are ready.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Enhanced Progress Section with ETA */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <Brain className="w-6 h-6 text-blue-600 animate-pulse" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-blue-800">{getProgressPhase()}</span>
                      <span className="text-sm text-blue-600 font-semibold">{Math.round(analysisProgress)}%</span>
                    </div>
                    <Progress 
                      value={analysisProgress} 
                      className="h-3 bg-blue-100"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                  <Clock className="w-4 h-4" />
                  <span>{getEstimatedTime()}</span>
                </div>
              </div>

              {/* Status Cards */}
              <div className="grid grid-cols-1 gap-3">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-800">Processing Your Data</h4>
                      <p className="text-xs text-gray-600 mt-1">
                        Finding patterns, generating insights, and preparing visualizations...
                      </p>
                    </div>
                  </div>
                </div>

                {analysisProgress > 50 && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <div>
                        <h4 className="text-sm font-medium text-green-800">Data Analysis Complete</h4>
                        <p className="text-xs text-green-600 mt-1">
                          Statistical analysis and pattern recognition finished
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {analysisProgress > 80 && (
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                      <div>
                        <h4 className="text-sm font-medium text-purple-800">Generating Visualizations</h4>
                        <p className="text-xs text-purple-600 mt-1">
                          Creating charts and visual insights from your data
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectNamingDialog;
