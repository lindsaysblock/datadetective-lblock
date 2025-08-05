/**
 * Plan B: Bulk Test Actions Component
 * Bulk operations for fixing and re-running multiple tests
 */

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  RotateCcw, 
  Play,
  Filter,
  Settings 
} from 'lucide-react';
import { AutoFixEngine } from '../../utils/qa/autoFixEngine';
import { QATestResult } from '../../utils/qa/types';
import { useToast } from '../../hooks/use-toast';

interface BulkTestActionsProps {
  tests: QATestResult[];
  onTestsUpdated?: (updatedTests: QATestResult[]) => void;
  onRetryTest?: (testName: string) => Promise<QATestResult>;
}

interface BulkProgress {
  total: number;
  completed: number;
  currentAction: string;
  errors: string[];
}

export const BulkTestActions: React.FC<BulkTestActionsProps> = ({
  tests,
  onTestsUpdated,
  onRetryTest
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<BulkProgress>({
    total: 0,
    completed: 0,
    currentAction: '',
    errors: []
  });
  const [filter, setFilter] = useState<'all' | 'failed' | 'warning'>('failed');
  const { toast } = useToast();

  const autoFixEngine = new AutoFixEngine();

  const getFilteredTests = () => {
    switch (filter) {
      case 'failed':
        return tests.filter(test => test.status === 'fail');
      case 'warning':
        return tests.filter(test => test.status === 'warning');
      default:
        return tests.filter(test => test.status !== 'pass');
    }
  };

  const filteredTests = getFilteredTests();
  const failedCount = tests.filter(test => test.status === 'fail').length;
  const warningCount = tests.filter(test => test.status === 'warning').length;

  const updateProgress = (update: Partial<BulkProgress>) => {
    setProgress(prev => ({ ...prev, ...update }));
  };

  const handleBulkFix = async () => {
    const testsToFix = filteredTests;
    if (testsToFix.length === 0) return;

    setIsProcessing(true);
    updateProgress({
      total: testsToFix.length,
      completed: 0,
      currentAction: 'Starting bulk fix process...',
      errors: []
    });

    toast({
      title: "Starting Bulk Fix",
      description: `Attempting to fix ${testsToFix.length} tests...`,
    });

    const updatedTests = [...tests];
    const errors: string[] = [];

    for (let i = 0; i < testsToFix.length; i++) {
      const test = testsToFix[i];
      
      updateProgress({
        completed: i,
        currentAction: `Fixing: ${test.testName}`,
      });

      try {
        const fixResult = await autoFixEngine.attemptFix(test.testName, test.message);
        
        if (fixResult.success && onRetryTest) {
          // Apply fix and retry test
          updateProgress({
            currentAction: `Retrying: ${test.testName}`,
          });
          
          const retryResult = await onRetryTest(test.testName);
          
          // Update the test in our local array
          const testIndex = updatedTests.findIndex(t => t.testName === test.testName);
          if (testIndex !== -1) {
            updatedTests[testIndex] = retryResult;
          }
        } else if (!fixResult.success) {
          errors.push(`${test.testName}: Fix failed`);
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`${test.testName}: ${errorMsg}`);
      }

      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    updateProgress({
      completed: testsToFix.length,
      currentAction: 'Bulk fix process completed',
      errors
    });

    if (onTestsUpdated) {
      onTestsUpdated(updatedTests);
    }

    const successCount = testsToFix.length - errors.length;
    toast({
      title: "Bulk Fix Complete",
      description: `${successCount}/${testsToFix.length} tests fixed successfully`,
      variant: errors.length > 0 ? "destructive" : "default",
    });

    setIsProcessing(false);
  };

  const handleBulkRetry = async () => {
    const testsToRetry = filteredTests;
    if (testsToRetry.length === 0 || !onRetryTest) return;

    setIsProcessing(true);
    updateProgress({
      total: testsToRetry.length,
      completed: 0,
      currentAction: 'Starting bulk retry process...',
      errors: []
    });

    toast({
      title: "Starting Bulk Retry",
      description: `Retrying ${testsToRetry.length} tests...`,
    });

    const updatedTests = [...tests];
    const errors: string[] = [];

    for (let i = 0; i < testsToRetry.length; i++) {
      const test = testsToRetry[i];
      
      updateProgress({
        completed: i,
        currentAction: `Retrying: ${test.testName}`,
      });

      try {
        const retryResult = await onRetryTest(test.testName);
        
        // Update the test in our local array
        const testIndex = updatedTests.findIndex(t => t.testName === test.testName);
        if (testIndex !== -1) {
          updatedTests[testIndex] = retryResult;
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`${test.testName}: ${errorMsg}`);
      }

      // Small delay to show progress
      await new Promise(resolve => setTimeout(resolve, 150));
    }

    updateProgress({
      completed: testsToRetry.length,
      currentAction: 'Bulk retry process completed',
      errors
    });

    if (onTestsUpdated) {
      onTestsUpdated(updatedTests);
    }

    const successCount = testsToRetry.length - errors.length;
    toast({
      title: "Bulk Retry Complete",
      description: `${successCount}/${testsToRetry.length} tests retried successfully`,
      variant: errors.length > 0 ? "destructive" : "default",
    });

    setIsProcessing(false);
  };

  if (failedCount === 0 && warningCount === 0) {
    return null;
  }

  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          <div className="flex items-center">
            <Settings className="w-4 h-4 mr-2 text-amber-600" />
            Bulk Test Actions
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">{failedCount} failed</Badge>
            <Badge variant="outline">{warningCount} warning</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Filter Selection */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="text-sm font-medium">Target:</span>
          <div className="flex gap-1">
            {(['failed', 'warning', 'all'] as const).map((filterType) => (
              <Button
                key={filterType}
                variant={filter === filterType ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(filterType)}
                disabled={isProcessing}
              >
                {filterType === 'all' ? 'All Issues' : `${filterType} Tests`}
                {filterType === 'failed' && ` (${failedCount})`}
                {filterType === 'warning' && ` (${warningCount})`}
                {filterType === 'all' && ` (${failedCount + warningCount})`}
              </Button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkFix}
            disabled={isProcessing || filteredTests.length === 0}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            {isProcessing ? (
              <>
                <Clock className="w-4 h-4 mr-1 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Wrench className="w-4 h-4 mr-1" />
                Fix & Re-run All ({filteredTests.length})
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkRetry}
            disabled={isProcessing || filteredTests.length === 0 || !onRetryTest}
            className="text-green-600 border-green-200 hover:bg-green-50"
          >
            {isProcessing ? (
              <>
                <Clock className="w-4 h-4 mr-1 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4 mr-1" />
                Retry All ({filteredTests.length})
              </>
            )}
          </Button>
        </div>

        {/* Progress Display */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{progress.currentAction}</span>
              <span>{progress.completed}/{progress.total}</span>
            </div>
            <Progress 
              value={(progress.completed / progress.total) * 100} 
              className="h-2"
            />
          </div>
        )}

        {/* Error Summary */}
        {progress.errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-4 h-4 mr-2 text-red-600" />
              <span className="text-sm font-medium text-red-800">
                {progress.errors.length} errors occurred
              </span>
            </div>
            <div className="max-h-24 overflow-y-auto">
              {progress.errors.slice(0, 3).map((error, index) => (
                <p key={index} className="text-xs text-red-700 mb-1">
                  {error}
                </p>
              ))}
              {progress.errors.length > 3 && (
                <p className="text-xs text-red-600 font-medium">
                  ... and {progress.errors.length - 3} more errors
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};