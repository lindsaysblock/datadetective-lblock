
import React, { useState } from 'react';
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
import { Loader2, FolderPlus, Brain, CheckCircle } from 'lucide-react';

interface ProjectNamingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (projectName: string) => void;
  isProcessing?: boolean;
  analysisProgress?: number;
  analysisCompleted?: boolean;
}

const ProjectNamingDialog: React.FC<ProjectNamingDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isProcessing = false,
  analysisProgress = 0,
  analysisCompleted = false
}) => {
  const [projectName, setProjectName] = useState('');
  const [projectSaved, setProjectSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim() && !projectSaved) {
      // Save project name but don't close dialog if analysis is still running
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
  React.useEffect(() => {
    if (open && !projectSaved) {
      setProjectSaved(false);
    }
  }, [open, projectSaved]);

  const getButtonText = () => {
    if (analysisCompleted) {
      return 'View Results';
    }
    if (projectSaved && isProcessing) {
      return 'Analysis in Progress...';
    }
    if (projectSaved) {
      return 'Project Saved';
    }
    return 'Save Project Name';
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => isProcessing && !analysisCompleted && e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-purple-600" />
            {projectSaved ? 'Analysis in Progress' : 'Name Your Project'}
          </DialogTitle>
          <DialogDescription>
            {analysisCompleted ? 
              "Analysis complete! Your project is ready to view." :
              projectSaved ? 
                "Your project has been saved. Please wait while we analyze your data." :
                "Give your analysis project a memorable name to help you find it later."
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
          
          {isProcessing && projectSaved && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
                <Brain className="w-4 h-4 animate-pulse" />
                <span className="text-sm">Analyzing your data...</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm text-gray-500">{Math.round(analysisProgress)}%</span>
                </div>
                <Progress value={analysisProgress} className="h-2" />
              </div>
            </div>
          )}
          
          {analysisCompleted && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Analysis complete! Ready to view results.</span>
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
              disabled={!projectName.trim() || (projectSaved && !analysisCompleted)}
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
