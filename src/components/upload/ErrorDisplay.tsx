
import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorDisplayProps {
  error?: string;
  onClear: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onClear }) => {
  if (!error) return null;

  return (
    <div className="mt-4 text-center">
      <p className="text-destructive">{error}</p>
      <Button onClick={onClear} variant="outline" className="mt-2">
        Clear Error
      </Button>
    </div>
  );
};

export default ErrorDisplay;
