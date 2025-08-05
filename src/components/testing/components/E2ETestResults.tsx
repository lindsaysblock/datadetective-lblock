
import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';
import TestResultCard from '../TestResultCard';

interface TestResult {
  step: string;
  status: 'success' | 'warning' | 'error';
  details: string;
  timestamp: Date;
  optimizations?: string[];
}

interface E2ETestResultsProps {
  optimizationsApplied: string[];
  testResults: TestResult[];
}

const E2ETestResults: React.FC<E2ETestResultsProps> = ({
  optimizationsApplied,
  testResults
}) => {
  const getOverallStatus = () => {
    if (testResults.length === 0) return 'info';
    const hasErrors = testResults.some(r => r.status === 'error');
    const hasWarnings = testResults.some(r => r.status === 'warning');
    
    if (hasErrors) return 'error';
    if (hasWarnings) return 'warning';
    return 'success';
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="space-y-4">
      {/* Optimizations Applied Section */}
      {optimizationsApplied.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Optimizations Applied ({optimizationsApplied.length})
          </h3>
          <div className="space-y-1">
            {optimizationsApplied.map((opt, index) => (
              <p key={index} className="text-sm text-green-700">{opt}</p>
            ))}
          </div>
        </div>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-lg">Test Results</h3>
            {overallStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
            {overallStatus === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
            {overallStatus === 'error' && <AlertTriangle className="w-5 h-5 text-red-600" />}
          </div>
          <div className="grid gap-3">
            {testResults.map((result, index) => {
              // Convert TestResult to TestResultCard format
              const testResultCard = {
                name: result.step,
                status: result.status,
                details: result.details,
                timestamp: result.timestamp.toLocaleTimeString(),
                optimizations: result.optimizations
              };
              return (
                <div key={index}>
                  <TestResultCard result={testResultCard} />
                  {result.optimizations && result.optimizations.length > 0 && (
                    <div className="mt-2 ml-4 p-2 bg-blue-50 border-l-2 border-blue-200 rounded-r">
                      <p className="text-xs font-medium text-blue-800 mb-1">Optimizations Identified:</p>
                      {result.optimizations.map((opt, optIndex) => (
                        <p key={optIndex} className="text-xs text-blue-700">• {opt}</p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default E2ETestResults;
