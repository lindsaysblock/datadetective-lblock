
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react';

interface TestResult {
  step?: string;
  testName?: string;
  status: 'success' | 'warning' | 'error' | 'pass' | 'fail' | 'skip';
  details?: string;
  message?: string;
  error?: string;
  timestamp?: Date;
  duration?: number;
}

interface TestResultCardProps {
  result: TestResult;
}

const TestResultCard: React.FC<TestResultCardProps> = ({ result }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
      case 'fail': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'success':
      case 'pass': return 'default';
      case 'warning': return 'secondary';
      case 'error':
      case 'fail': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        {getStatusIcon(result?.status || 'unknown')}
        <div>
          <div className="font-medium">{result?.step || result?.testName || 'Unknown Test'}</div>
          <div className="text-sm text-gray-600">
            {result?.details || result?.message || 'No details available'}
          </div>
          {result?.error && (
            <div className="text-xs text-red-600 mt-1">Error: {result.error}</div>
          )}
        </div>
      </div>
      <div className="text-right">
        <Badge variant={getStatusBadgeVariant(result?.status || 'unknown')}>
          {result?.status?.toUpperCase() || 'UNKNOWN'}
        </Badge>
        <div className="text-xs text-gray-500 mt-1">
          {result?.timestamp ? result.timestamp.toLocaleTimeString() : 
           result?.duration ? `${result.duration}ms` : 'No time'}
        </div>
      </div>
    </div>
  );
};

export default TestResultCard;
