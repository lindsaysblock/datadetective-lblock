
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, Trash2, RotateCcw } from 'lucide-react';

interface FormRecoveryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestore: () => void;
  onStartFresh: () => void;
  lastSaved?: string;
}

const FormRecoveryDialog: React.FC<FormRecoveryDialogProps> = ({
  open,
  onOpenChange,
  onRestore,
  onStartFresh,
  lastSaved
}) => {
  const formatLastSaved = (timestamp: string) => {
    if (!timestamp) return 'Recently';
    
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      
      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  const handleRestore = () => {
    console.log('FormRecoveryDialog: handleRestore called');
    onRestore();
  };

  const handleStartFresh = () => {
    console.log('FormRecoveryDialog: handleStartFresh called');
    onStartFresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Continue Previous Work?
          </DialogTitle>
          <DialogDescription className="text-left">
            We found saved progress from your previous session. Would you like to continue where you left off or start fresh?
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="text-sm font-medium text-blue-900">Last saved:</div>
            <div className="text-sm text-blue-700">{formatLastSaved(lastSaved || '')}</div>
          </div>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant="outline" onClick={handleStartFresh} className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Start Fresh
          </Button>
          <Button onClick={handleRestore} className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Continue Previous Work
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormRecoveryDialog;
