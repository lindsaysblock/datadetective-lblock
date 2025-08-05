/**
 * Plan B: Enhanced Test Report with Fix & Re-run Capabilities
 * Integrates with existing QA components to add fix functionality
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Filter,
  RefreshCw
} from 'lucide-react';
import { QATestResult } from '../../utils/qa/types';
import { QAReport } from '../../utils/qa/types';
import { BulkTestActions } from './BulkTestActions';
import { TestFixButton } from './TestFixButton';
import { AutoFixEngine } from '../../utils/qa/autoFixEngine';

interface TestReportWithFixesProps {
  qaReport: QAReport;
  onReportUpdated?: (updatedReport: QAReport) => void;
}

export const TestReportWithFixes: React.FC<TestReportWithFixesProps> = ({
  qaReport,
  onReportUpdated
}) => {
  const [tests, setTests] = useState<QATestResult[]>(qaReport.results);
  const [filter, setFilter] = useState<'all' | 'failed' | 'warning' | 'passed'>('all');
  const autoFixEngine = new AutoFixEngine();

  const handleTestFixed = (testName: string, newResult: QATestResult) => {
    const updatedTests = tests.map(test => 
      test.testName === testName ? newResult : test
    );
    setTests(updatedTests);

    if (onReportUpdated) {
      const updatedReport: QAReport = {
        ...qaReport,
        results: updatedTests,
        passed: updatedTests.filter(t => t.status === 'pass').length,
        failed: updatedTests.filter(t => t.status === 'fail').length,
        warnings: updatedTests.filter(t => t.status === 'warning').length,
      };
      onReportUpdated(updatedReport);
    }
  };

  const handleRetryTest = async (testName: string): Promise<QATestResult> => {
    const originalTest = tests.find(t => t.testName === testName);
    if (!originalTest) throw new Error('Test not found');

    return await autoFixEngine.rerunTest(`${testName}_${Date.now()}`, originalTest);
  };

  const handleBulkTestsUpdated = (updatedTests: QATestResult[]) => {
    setTests(updatedTests);
    
    if (onReportUpdated) {
      const updatedReport: QAReport = {
        ...qaReport,
        results: updatedTests,
        passed: updatedTests.filter(t => t.status === 'pass').length,
        failed: updatedTests.filter(t => t.status === 'fail').length,
        warnings: updatedTests.filter(t => t.status === 'warning').length,
      };
      onReportUpdated(updatedReport);
    }
  };

  const getFilteredTests = () => {
    switch (filter) {
      case 'failed':
        return tests.filter(test => test.status === 'fail');
      case 'warning':
        return tests.filter(test => test.status === 'warning');
      case 'passed':
        return tests.filter(test => test.status === 'pass');
      default:
        return tests;
    }
  };

  const filteredTests = getFilteredTests();
  const passedCount = tests.filter(t => t.status === 'pass').length;
  const failedCount = tests.filter(t => t.status === 'fail').length;
  const warningCount = tests.filter(t => t.status === 'warning').length;
  const successRate = (passedCount / tests.length) * 100;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>QA Test Results with Fix & Re-run</span>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-green-600">
                {passedCount} passed
              </Badge>
              <Badge variant="outline" className="text-red-600">
                {failedCount} failed
              </Badge>
              <Badge variant="outline" className="text-yellow-600">
                {warningCount} warning
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Success Rate</span>
                <span className="text-sm text-muted-foreground">
                  {successRate.toFixed(1)}%
                </span>
              </div>
              <Progress value={successRate} className="h-2" />
            </div>

            {/* Bulk Actions */}
            <BulkTestActions
              tests={tests}
              onTestsUpdated={handleBulkTestsUpdated}
              onRetryTest={handleRetryTest}
            />
          </div>
        </CardContent>
      </Card>

      {/* Test Results with Filtering */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Test Details</span>
            <div className="flex gap-1">
              {(['all', 'failed', 'warning', 'passed'] as const).map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    filter === filterType
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted-foreground/10'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  {filterType === 'all' && ` (${tests.length})`}
                  {filterType === 'failed' && ` (${failedCount})`}
                  {filterType === 'warning' && ` (${warningCount})`}
                  {filterType === 'passed' && ` (${passedCount})`}
                </button>
              ))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTests.map((test, index) => (
              <Card key={index} className="border-l-4 border-l-gray-200">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {test.status === 'pass' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                      {test.status === 'fail' && <AlertTriangle className="w-5 h-5 text-red-600" />}
                      {test.status === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
                      
                      <div>
                        <h4 className="font-medium">{test.testName}</h4>
                        <p className="text-sm text-muted-foreground">{test.message}</p>
                      </div>
                    </div>
                    
                    <Badge 
                      variant={test.status === 'pass' ? 'default' : 'destructive'}
                      className={
                        test.status === 'pass' ? 'bg-green-100 text-green-800' :
                        test.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {test.status}
                    </Badge>
                  </div>

                  {/* Test Fix Component */}
                  <TestFixButton
                    test={test}
                    onTestFixed={handleTestFixed}
                    onRetry={handleRetryTest}
                  />
                </CardContent>
              </Card>
            ))}

            {filteredTests.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No tests match the current filter
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};