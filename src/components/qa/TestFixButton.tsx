/**
 * Plan B: Fix & Re-run Button Component
 * Individual test fix and retry functionality
 */

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { AlertTriangle, CheckCircle2, Clock, Wrench, RotateCcw, Play } from 'lucide-react';
import { AutoFixEngine } from '../../utils/qa/autoFixEngine';
import { QATestResult } from '../../utils/qa/types';
import { TestFailureDetails, FixResult } from '../../types/testFailure';
import { useToast } from '../../hooks/use-toast';

interface TestFixButtonProps {
  test: QATestResult;
  onTestFixed?: (testName: string, newResult: QATestResult) => void;
  onRetry?: (testName: string) => Promise<QATestResult>;
}

export const TestFixButton: React.FC<TestFixButtonProps> = ({
  test,
  onTestFixed,
  onRetry
}) => {
  const [isFixing, setIsFixing] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [fixResult, setFixResult] = useState<FixResult | null>(null);
  const [failureDetails, setFailureDetails] = useState<TestFailureDetails | null>(null);
  const { toast } = useToast();

  const autoFixEngine = new AutoFixEngine();

  const handleAnalyzeFailure = async () => {
    if (test.status === 'pass') return;

    const details = autoFixEngine.analyzeFailure(test);
    setFailureDetails(details);
  };

  const handleApplyFix = async () => {
    if (!failureDetails || test.status === 'pass') return;

    setIsFixing(true);
    toast({
      title: "Applying Fix",
      description: `Attempting to fix "${test.testName}"...`,
    });

    try {
      const result = await autoFixEngine.attemptFix(test.testName, test.message);
      setFixResult(result);

      if (result.success) {
        toast({
          title: "Fix Applied Successfully",
          description: result.message,
        });
        
        // If fix was successful and requires retest, trigger retry
        if (result.requiresRetest && onRetry) {
          await handleRetryTest();
        }
      } else {
        toast({
          title: "Fix Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Fix Error",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsFixing(false);
    }
  };

  const handleRetryTest = async () => {
    if (!onRetry) return;

    setIsRetrying(true);
    toast({
      title: "Retrying Test",
      description: `Re-running "${test.testName}"...`,
    });

    try {
      const newResult = await onRetry(test.testName);
      
      if (onTestFixed) {
        onTestFixed(test.testName, newResult);
      }

      toast({
        title: "Test Retry Complete",
        description: newResult.status === 'pass' 
          ? "Test now passes!" 
          : "Test still failing - may need manual intervention",
        variant: newResult.status === 'pass' ? "default" : "destructive",
      });
    } catch (error) {
      toast({
        title: "Retry Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsRetrying(false);
    }
  };

  // Only show for failed or warning tests
  if (test.status === 'pass') {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Quick Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAnalyzeFailure}
          disabled={isFixing || isRetrying}
        >
          <AlertTriangle className="w-4 h-4 mr-1" />
          Analyze
        </Button>

        {failureDetails && failureDetails.canAutoFix && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleApplyFix}
            disabled={isFixing || isRetrying}
            className="text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            {isFixing ? (
              <>
                <Clock className="w-4 h-4 mr-1 animate-spin" />
                Fixing...
              </>
            ) : (
              <>
                <Wrench className="w-4 h-4 mr-1" />
                Fix & Re-run
              </>
            )}
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={handleRetryTest}
          disabled={isFixing || isRetrying || !onRetry}
          className="text-green-600 border-green-200 hover:bg-green-50"
        >
          {isRetrying ? (
            <>
              <Clock className="w-4 h-4 mr-1 animate-spin" />
              Retrying...
            </>
          ) : (
            <>
              <RotateCcw className="w-4 h-4 mr-1" />
              Retry
            </>
          )}
        </Button>
      </div>

      {/* Failure Analysis Details */}
      {failureDetails && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-amber-600" />
              Failure Analysis
              <Badge variant="outline" className="ml-2">
                {failureDetails.severity}
              </Badge>
              <Badge variant="outline" className="ml-2">
                {failureDetails.errorType}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Root Cause:</p>
              <p className="text-sm text-gray-700">{failureDetails.rootCause}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-900">Fix Suggestions:</p>
              <ul className="text-sm text-gray-700 space-y-1">
                {failureDetails.fixSuggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            {failureDetails.canAutoFix && (
              <div className="flex items-center text-sm text-green-700 bg-green-50 p-2 rounded">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Auto-fix available (Est. {failureDetails.estimatedFixTime} min)
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Fix Result Display */}
      {fixResult && (
        <Card className={`border-2 ${fixResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <CardContent className="pt-3">
            <div className="flex items-center space-x-2 mb-2">
              {fixResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-medium ${fixResult.success ? 'text-green-800' : 'text-red-800'}`}>
                {fixResult.success ? 'Fix Applied Successfully' : 'Fix Failed'}
              </span>
            </div>
            
            <p className={`text-sm ${fixResult.success ? 'text-green-700' : 'text-red-700'}`}>
              {fixResult.message}
            </p>

            {fixResult.appliedFixes.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-900">Applied Fixes:</p>
                <ul className="text-sm text-gray-700 space-y-1">
                  {fixResult.appliedFixes.map((fix, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="w-3 h-3 mr-2 mt-0.5 text-green-600" />
                      {fix}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {fixResult.timeElapsed && (
              <p className="text-xs text-gray-500 mt-2">
                Completed in {fixResult.timeElapsed}ms
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};