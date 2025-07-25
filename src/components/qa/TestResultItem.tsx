/**
 * Test Result Item Component
 * Individual test result display with status and actions
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertTriangle, Clock, RotateCcw } from 'lucide-react';
import type { QATestResult } from './QATestResultsDashboard';

interface TestResultItemProps {
  test: QATestResult;
  onRetry?: (testId: string) => void;
}

export const TestResultItem: React.FC<TestResultItemProps> = ({
  test,
  onRetry
}) => {
  const getStatusIcon = (status: QATestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-500" />;
      case 'fixing':
        return <RotateCcw className="w-4 h-4 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = (status: QATestResult['status']) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'fixing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className={`p-3 rounded-lg border ${getStatusColor(test.status)}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusIcon(test.status)}
          <span className="font-medium">{test.name}</span>
          <span className="text-sm text-muted-foreground">
            {test.duration.toFixed(2)}ms
          </span>
          {test.fixAttempts && test.fixAttempts > 0 && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              Fix attempts: {test.fixAttempts}
            </span>
          )}
        </div>
        {(test.status === 'failed' || test.status === 'warning') && (
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => onRetry?.(test.id)}
            disabled={test.status === 'fixing'}
          >
            {test.status === 'fixing' ? 'Fixing...' : 'Retry'}
          </Button>
        )}
      </div>
      
      {test.error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          <strong>Error:</strong> {test.error}
        </div>
      )}
      
      {test.details && (
        <div className="mt-2 text-sm text-muted-foreground">
          {test.details}
        </div>
      )}
    </div>
  );
};