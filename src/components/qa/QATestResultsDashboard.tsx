/**
 * QA Test Results Dashboard Component - Main Entry Point
 * Displays comprehensive test results with expandable cards
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TestSuiteCard } from './TestSuiteCard';
import { QAOverviewStats } from './QAOverviewStats';

export interface QATestResult {
  id: string;
  name: string;
  category: 'authentication' | 'analysis' | 'workflow' | 'integration' | 'performance';
  status: 'passed' | 'failed' | 'warning' | 'pending' | 'fixing';
  duration: number;
  error?: string;
  details?: string;
  timestamp: Date;
  fixAttempts?: number;
}

export interface QATestSuite {
  name: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  warningTests: number;
  pendingTests: number;
  results: QATestResult[];
  coverage: number;
  duration: number;
}

export interface QADashboardProps {
  testSuites: QATestSuite[];
  onRetryTest?: (testId: string) => void;
  onRetryCategory?: (category: string) => void;
  onRunAllTests?: () => void;
  onAutoFixTests?: () => void;
}

export const QATestResultsDashboard: React.FC<QADashboardProps> = ({
  testSuites,
  onRetryTest,
  onRetryCategory,
  onRunAllTests,
  onAutoFixTests
}) => {
  const [expandedSuites, setExpandedSuites] = useState<Set<string>>(new Set(['Authentication Tests']));
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['authentication']));

  // Calculate overall statistics
  const overallStats = testSuites.reduce(
    (acc, suite) => ({
      total: acc.total + suite.totalTests,
      passed: acc.passed + suite.passedTests,
      failed: acc.failed + suite.failedTests,
      warning: acc.warning + suite.warningTests,
      pending: acc.pending + suite.pendingTests
    }),
    { total: 0, passed: 0, failed: 0, warning: 0, pending: 0 }
  );

  const overallCoverage = testSuites.length > 0 
    ? testSuites.reduce((sum, suite) => sum + suite.coverage, 0) / testSuites.length 
    : 0;

  const toggleSuite = (suiteName: string) => {
    const newExpanded = new Set(expandedSuites);
    if (newExpanded.has(suiteName)) {
      newExpanded.delete(suiteName);
    } else {
      newExpanded.add(suiteName);
    }
    setExpandedSuites(newExpanded);
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

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

  const groupTestsByCategory = (results: QATestResult[]) => {
    return results.reduce((groups, test) => {
      if (!groups[test.category]) {
        groups[test.category] = [];
      }
      groups[test.category].push(test);
      return groups;
    }, {} as Record<string, QATestResult[]>);
  };

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>QA Test Results Overview</CardTitle>
            <CardDescription>
              Comprehensive testing results across all test suites
            </CardDescription>
          </div>
          <Button onClick={onRunAllTests} variant="outline" className="mr-2">
            Run All Tests
          </Button>
          <Button onClick={onAutoFixTests} variant="default">
            Auto-Fix Failed Tests
          </Button>
        </CardHeader>
        <QAOverviewStats 
          overallStats={overallStats}
          overallCoverage={overallCoverage}
        />
      </Card>

      {/* Test Suites */}
      {testSuites.map((suite) => (
        <TestSuiteCard
          key={suite.name}
          suite={suite}
          isExpanded={expandedSuites.has(suite.name)}
          onToggle={() => toggleSuite(suite.name)}
          onRetryTest={onRetryTest}
          onRetryCategory={onRetryCategory}
          expandedCategories={expandedCategories}
          onToggleCategory={toggleCategory}
        />
      ))}

      {/* Action Items */}
      {overallStats.failed > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Action Items</CardTitle>
            <CardDescription>
              Issues that need attention based on test failures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span>{overallStats.failed} tests are failing and need investigation</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span>Review error messages and stack traces for failed tests</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Run individual test retries to isolate issues</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};