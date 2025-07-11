
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react';

interface TestResult {
  step: string;
  status: 'success' | 'warning' | 'error';
  details: string;
  timestamp: Date;
}

interface TestResultCardProps {
  result: TestResult;
}

const TestResultCard: React.FC<TestResultCardProps> = ({ result }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'success': return 'default';
      case 'warning': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        {getStatusIcon(result.status)}
        <div>
          <div className="font-medium">{result.step}</div>
          <div className="text-sm text-gray-600">{result.details}</div>
        </div>
      </div>
      <div className="text-right">
        <Badge variant={getStatusBadgeVariant(result.status)}>
          {result.status.toUpperCase()}
        </Badge>
        <div className="text-xs text-gray-500 mt-1">
          {result.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default TestResultCard;
