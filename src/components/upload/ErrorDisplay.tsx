
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorDisplayProps {
  error?: string;
  onClear: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onClear }) => {
  if (!error) return null;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Alert variant="destructive" className="bg-red-50 border-red-200">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClear}
            className="ml-2 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ErrorDisplay;
