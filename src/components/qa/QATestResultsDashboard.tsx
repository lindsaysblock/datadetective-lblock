/**
 * QA Test Results Dashboard Component
 * Displays comprehensive test results with expandable cards and detailed reporting
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';

export interface QATestResult {
  id: string;
  name: string;
  category: 'authentication' | 'analysis' | 'workflow' | 'integration' | 'performance';
  status: 'passed' | 'failed' | 'warning' | 'pending';
  duration: number;
  error?: string;
  details?: string;
  timestamp: Date;
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
}

export const QATestResultsDashboard: React.FC<QADashboardProps> = ({
  testSuites,
  onRetryTest,
  onRetryCategory,
  onRunAllTests
}) => {
  const [expandedSuites, setExpandedSuites] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

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
          <Button onClick={onRunAllTests} variant="outline">
            Run All Tests
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{overallStats.total}</div>
              <div className="text-sm text-muted-foreground">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{overallStats.passed}</div>
              <div className="text-sm text-muted-foreground">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{overallStats.failed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{overallStats.warning}</div>
              <div className="text-sm text-muted-foreground">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{overallStats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Test Coverage</span>
              <span>{overallCoverage.toFixed(1)}%</span>
            </div>
            <Progress value={overallCoverage} className="h-2" />
          </div>

          <div className="space-y-2 mt-4">
            <div className="flex justify-between text-sm">
              <span>Success Rate</span>
              <span>{overallStats.total > 0 ? ((overallStats.passed / overallStats.total) * 100).toFixed(1) : 0}%</span>
            </div>
            <Progress 
              value={overallStats.total > 0 ? (overallStats.passed / overallStats.total) * 100 : 0} 
              className="h-2" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Test Suites */}
      {testSuites.map((suite) => (
        <Card key={suite.name}>
          <Collapsible 
            open={expandedSuites.has(suite.name)}
            onOpenChange={() => toggleSuite(suite.name)}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {expandedSuites.has(suite.name) ? 
                      <ChevronDown className="w-4 h-4" /> : 
                      <ChevronRight className="w-4 h-4" />
                    }
                    <CardTitle>{suite.name}</CardTitle>
                    <Badge variant="outline">
                      {suite.passedTests}/{suite.totalTests} passed
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {suite.duration.toFixed(1)}s
                    </span>
                    <div className="w-32">
                      <Progress 
                        value={(suite.passedTests / suite.totalTests) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <CardContent className="pt-0">
                {/* Category Groups */}
                {Object.entries(groupTestsByCategory(suite.results)).map(([category, tests]) => (
                  <div key={category} className="mb-4">
                    <Collapsible 
                      open={expandedCategories.has(category)}
                      onOpenChange={() => toggleCategory(category)}
                    >
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                          <div className="flex items-center space-x-2">
                            {expandedCategories.has(category) ? 
                              <ChevronDown className="w-3 h-3" /> : 
                              <ChevronRight className="w-3 h-3" />
                            }
                            <span className="font-medium capitalize">{category} Tests</span>
                            <Badge variant="secondary">
                              {tests.filter(t => t.status === 'passed').length}/{tests.length}
                            </Badge>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={(e) => {
                              e.stopPropagation();
                              onRetryCategory?.(category);
                            }}
                          >
                            Retry Category
                          </Button>
                        </div>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="ml-4 mt-2 space-y-2">
                          {tests.map((test) => (
                            <div 
                              key={test.id}
                              className={`p-3 rounded-lg border ${getStatusColor(test.status)}`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  {getStatusIcon(test.status)}
                                  <span className="font-medium">{test.name}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {test.duration.toFixed(2)}ms
                                  </span>
                                </div>
                                {test.status === 'failed' && (
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => onRetryTest?.(test.id)}
                                  >
                                    Retry
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
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
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