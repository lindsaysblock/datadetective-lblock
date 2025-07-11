
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingStateProps {
  uploading: boolean;
  parsing: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({ uploading, parsing }) => {
  if (!uploading && !parsing) return null;

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <div>
            <h4 className="font-medium text-blue-900">
              {uploading ? 'Uploading files...' : 'Processing data...'}
            </h4>
            <p className="text-sm text-blue-700">
              Please wait while we process your data.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
