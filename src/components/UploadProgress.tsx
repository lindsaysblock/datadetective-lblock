
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Upload, Database, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface UploadProgressProps {
  isUploading: boolean;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  filename?: string;
  error?: string;
  estimatedTime?: number;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ 
  isUploading, 
  progress, 
  status, 
  filename,
  error,
  estimatedTime = 0
}) => {
  if (!isUploading && status !== 'complete' && status !== 'error') return null;

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${Math.ceil(seconds)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.ceil(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return <Upload className="w-5 h-5 text-blue-600 animate-bounce" />;
      case 'processing':
        return <Database className="w-5 h-5 text-purple-600 animate-spin" />;
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Upload className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return 'Uploading and parsing file...';
      case 'processing':
        return 'Processing and analyzing data...';
      case 'complete':
        return 'Upload complete!';
      case 'error':
        return 'Upload failed';
      default:
        return 'Preparing upload...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'uploading':
        return 'from-blue-50 to-indigo-50 border-blue-200';
      case 'processing':
        return 'from-purple-50 to-blue-50 border-purple-200';
      case 'complete':
        return 'from-green-50 to-emerald-50 border-green-200';
      case 'error':
        return 'from-red-50 to-pink-50 border-red-200';
      default:
        return 'from-gray-50 to-slate-50 border-gray-200';
    }
  };

  return (
    <div className={`bg-gradient-to-br ${getStatusColor()} border rounded-xl p-6 shadow-sm`}>
      <div className="flex items-center gap-4 mb-4">
        {getStatusIcon()}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-800">{getStatusText()}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{progress}%</span>
              {estimatedTime > 0 && status !== 'complete' && status !== 'error' && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(estimatedTime / 1000)}</span>
                </div>
              )}
            </div>
          </div>
          {filename && (
            <p className="text-sm text-gray-600 truncate">{filename}</p>
          )}
          {error && (
            <p className="text-sm text-red-600 mt-1">{error}</p>
          )}
        </div>
      </div>
      
      <Progress 
        value={progress} 
        className="h-2"
      />
      
      {status === 'processing' && (
        <div className="mt-3 flex items-center gap-2 text-sm text-purple-600">
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
          </div>
          <span>Structuring data for analysis</span>
          {estimatedTime > 0 && (
            <span className="ml-2 text-purple-500">• {formatTime(estimatedTime / 1000)} remaining</span>
          )}
        </div>
      )}
      
      {(status === 'uploading' || status === 'processing') && estimatedTime > 0 && (
        <div className="mt-2 text-xs text-gray-500">
          Please don't navigate away - analysis in progress
        </div>
      )}
    </div>
  );
};

export default UploadProgress;
