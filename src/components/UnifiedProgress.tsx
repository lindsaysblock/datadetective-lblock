
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface UnifiedProgressProps {
  isActive: boolean;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  title?: string;
  filename?: string;
  error?: string | null;
  estimatedTime?: number;
}

const UnifiedProgress: React.FC<UnifiedProgressProps> = ({
  isActive,
  progress,
  status,
  title = "Processing",
  filename,
  error,
  estimatedTime = 0
}) => {
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.ceil(seconds / 1000)}s`;
    const minutes = Math.floor(seconds / 60000);
    const remainingSeconds = Math.ceil((seconds % 60000) / 1000);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'error':
        return <XCircle className="w-8 h-8 text-red-500" />;
      default:
        return <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing...';
      case 'complete':
        return 'Complete!';
      case 'error':
        return 'Error occurred';
      default:
        return title;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'complete':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  if (!isActive && status !== 'complete' && status !== 'error') {
    return null;
  }

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="text-center space-y-4">
        {getStatusIcon()}
        
        <div>
          <h3 className={`text-lg font-semibold ${getStatusColor()}`}>
            {getStatusText()}
          </h3>
          {filename && (
            <p className="text-sm text-gray-600 mt-1">
              {filename}
            </p>
          )}
        </div>

        {status !== 'complete' && status !== 'error' && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{Math.round(progress)}%</span>
              {estimatedTime > 0 && (
                <span>~{formatTime(estimatedTime)} remaining</span>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}
      </div>
    </Card>
  );
};

export default UnifiedProgress;
