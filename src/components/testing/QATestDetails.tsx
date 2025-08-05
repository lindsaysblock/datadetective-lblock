import React from 'react';
import { Button } from '../ui/button';
import { ChevronDown, ChevronRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { TestResultCard } from '../../types/testing';

interface QATestDetailsProps {
  result: TestResultCard;
  expanded: boolean;
  onToggleExpanded: () => void;
}

export const QATestDetails: React.FC<QATestDetailsProps> = ({
  result,
  expanded,
  onToggleExpanded
}) => {
  if (result.name !== 'QA Analysis' || !result.expandedData) {
    return null;
  }

  return (
    <div className="mt-4 border-t pt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium">
          Detailed QA Test Results ({result.expandedData.testResults?.length || 0} tests across {result.expandedData.testSuites?.length || 0} suites):
        </h4>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onToggleExpanded}
          className="h-6 px-2"
        >
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          {expanded ? 'Collapse' : 'Expand All'}
        </Button>
      </div>
      
      {/* Show Test Suites Overview */}
      <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
        <h5 className="text-xs font-medium text-blue-800 mb-2">Test Suites Executed:</h5>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {result.expandedData.testSuites?.map((suite, i) => (
            <div key={i} className="text-xs text-blue-700 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {suite}
            </div>
          ))}
        </div>
      </div>

      {expanded && result.expandedData?.testResults && (
        <div className="space-y-4">
          {/* Failed Tests */}
          {result.expandedData.testResults.filter(r => r.status === 'fail').length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-red-600 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-3 h-3" />
                Failed Tests ({result.expandedData.testResults.filter(r => r.status === 'fail').length})
              </h5>
              <div className="space-y-2">
                {result.expandedData.testResults.filter(r => r.status === 'fail').map((qaResult, qaIndex) => (
                  <div key={qaIndex} className="p-3 bg-red-50 border border-red-200 rounded text-xs">
                    <div className="font-medium text-red-800">{qaResult.testName}</div>
                    <div className="text-red-600 mt-1">{qaResult.message}</div>
                    {qaResult.suggestions && (
                      <div className="mt-2">
                        <div className="text-red-700 font-medium mb-1">Suggestions:</div>
                        <ul className="text-red-600 space-y-1">
                          {qaResult.suggestions.map((suggestion: string, suggestionIndex: number) => (
                            <li key={suggestionIndex} className="ml-4">• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning Tests */}
          {result.expandedData.testResults.filter(r => r.status === 'warning').length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-yellow-600 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-3 h-3" />
                Warning Tests ({result.expandedData.testResults.filter(r => r.status === 'warning').length})
              </h5>
              <div className="space-y-2">
                {result.expandedData.testResults.filter(r => r.status === 'warning').map((qaResult, qaIndex) => (
                  <div key={qaIndex} className="p-3 bg-yellow-50 border border-yellow-200 rounded text-xs">
                    <div className="font-medium text-yellow-800">{qaResult.testName}</div>
                    <div className="text-yellow-600 mt-1">{qaResult.message}</div>
                    {qaResult.suggestions && (
                      <div className="mt-2">
                        <div className="text-yellow-700 font-medium mb-1">Suggestions:</div>
                        <ul className="text-yellow-600 space-y-1">
                          {qaResult.suggestions.map((suggestion: string, suggestionIndex: number) => (
                            <li key={suggestionIndex} className="ml-4">• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Passed Tests */}
          {result.expandedData.testResults.filter(r => r.status === 'pass').length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-green-600 mb-2 flex items-center gap-2">
                <CheckCircle className="w-3 h-3" />
                Passed Tests ({result.expandedData.testResults.filter(r => r.status === 'pass').length})
              </h5>
              <div className="space-y-1">
                {result.expandedData.testResults.filter(r => r.status === 'pass').map((qaResult, qaIndex) => (
                  <div key={qaIndex} className="px-3 py-1 bg-green-50 border border-green-200 rounded text-xs">
                    <span className="text-green-800 font-medium">{qaResult.testName}</span>
                    <span className="text-green-600 ml-2">✓ {qaResult.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};