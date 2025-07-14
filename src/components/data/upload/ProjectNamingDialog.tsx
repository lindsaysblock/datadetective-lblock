
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Loader2, FolderPlus, Brain, CheckCircle, Clock } from 'lucide-react';

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
  const [projectName, setProjectName] = useState('');
  const [projectSaved, setProjectSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (analysisCompleted && projectSaved && onViewResults) {
      // Analysis is complete, close dialog and view results
      onViewResults();
      onOpenChange(false);
      return;
    }
    
    if (projectName.trim() && !projectSaved) {
      // Save project name and start showing progress
      onConfirm(projectName.trim());
      setProjectSaved(true);
    }
  };

  const handleClose = () => {
    // Only allow closing if analysis is complete or not started
    if (!isProcessing || analysisCompleted) {
      onOpenChange(false);
      setProjectName('');
      setProjectSaved(false);
    }
  };

  // Reset saved state when dialog opens
  useEffect(() => {
    if (open && !projectSaved) {
      setProjectSaved(false);
    }
  }, [open, projectSaved]);

  // Auto-navigate to results when analysis completes
  useEffect(() => {
    if (analysisCompleted && projectSaved && onViewResults) {
      setTimeout(() => {
        onViewResults();
        onOpenChange(false);
      }, 1500); // Give user a moment to see completion message
    }
  }, [analysisCompleted, projectSaved, onViewResults, onOpenChange]);

  const getButtonText = () => {
    if (analysisCompleted) {
      return 'View Results';
    }
    if (projectSaved && isProcessing) {
      return 'Analyzing...';
    }
    if (projectSaved) {
      return 'Analysis Starting...';
    }
    return 'Save & Start Analysis';
  };

  const getButtonIcon = () => {
    if (analysisCompleted) {
      return <CheckCircle className="w-4 h-4 mr-2" />;
    }
    if (isProcessing) {
      return <Loader2 className="w-4 h-4 mr-2 animate-spin" />;
    }
    return null;
  };

  const getEstimatedTime = () => {
    if (analysisProgress < 25) return '45-60 seconds remaining';
    if (analysisProgress < 50) return '30-45 seconds remaining';
    if (analysisProgress < 75) return '15-30 seconds remaining';
    if (analysisProgress < 90) return '5-15 seconds remaining';
    return 'Almost done...';
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => isProcessing && !analysisCompleted && e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-purple-600" />
            {analysisCompleted ? 'Analysis Complete!' : projectSaved ? 'Analysis in Progress' : 'Name Your Project'}
          </DialogTitle>
          <DialogDescription>
            {analysisCompleted ? 
              "Your analysis is ready! Redirecting to results..." :
              projectSaved ? 
                "Your project has been saved. Analyzing your data now..." :
                "Give your analysis project a memorable name."
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              placeholder="e.g., Sales Data Analysis, Customer Survey Insights..."
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              disabled={projectSaved}
              autoFocus={!projectSaved}
            />
          </div>
          
          {(isProcessing || analysisCompleted) && projectSaved && (
            <div className="space-y-4">
              <div className={`flex items-center gap-3 p-4 rounded-lg ${
                analysisCompleted ? 'text-green-600 bg-green-50 border border-green-200' : 'text-blue-600 bg-blue-50 border border-blue-200'
              }`}>
                {analysisCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Brain className="w-5 h-5 animate-pulse" />
                )}
                <div className="flex-1">
                  <span className="text-sm font-medium">
                    {analysisCompleted ? 'Analysis complete!' : 'Analyzing your data...'}
                  </span>
                  {!analysisCompleted && (
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">{getEstimatedTime()}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {!analysisCompleted && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Analysis Progress</span>
                      <span className="text-sm text-gray-500">{Math.round(analysisProgress)}%</span>
                    </div>
                    <Progress value={analysisProgress} className="h-3" />
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-xs font-medium text-gray-600">Processing your data</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Finding patterns, generating insights, and preparing visualizations...
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            {!isProcessing && !projectSaved && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={(!projectName.trim() && !analysisCompleted) || (isProcessing && !analysisCompleted)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {getButtonIcon()}
              {getButtonText()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectNamingDialog;
