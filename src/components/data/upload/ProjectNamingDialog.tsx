
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
import { Loader2, FolderPlus } from 'lucide-react';

interface ProjectNamingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (projectName: string) => void;
  isProcessing?: boolean;
}

const ProjectNamingDialog: React.FC<ProjectNamingDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isProcessing = false
}) => {
  const [projectName, setProjectName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      onConfirm(projectName.trim());
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      onOpenChange(false);
      setProjectName('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-purple-600" />
            Name Your Project
          </DialogTitle>
          <DialogDescription>
            Give your analysis project a memorable name to help you find it later.
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
              disabled={isProcessing}
              autoFocus
            />
          </div>
          
          {isProcessing && (
            <div className="flex items-center gap-2 text-blue-600 bg-blue-50 p-3 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Starting analysis...</span>
            </div>
          )}
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!projectName.trim() || isProcessing}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Start Analysis'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectNamingDialog;
