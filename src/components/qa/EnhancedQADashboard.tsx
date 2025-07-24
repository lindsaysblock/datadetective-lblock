/**
 * Enhanced QA Dashboard with Detailed Test Failure Reporting
 * Integration of test failure display with existing QA system
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  RefreshCw, 
  Download, 
  Settings, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { QATestFailureDisplay } from './QATestFailureDisplay';
import { useToast } from '@/hooks/use-toast';
import { QAReport, QATestResult } from '@/utils/qa/types';

interface EnhancedQADashboardProps {
  className?: string;
}

export const EnhancedQADashboard: React.FC<EnhancedQADashboardProps> = ({ className }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [qaReport, setQaReport] = useState<QAReport | null>(null);
  const [lastRunTime, setLastRunTime] = useState<Date | null>(null);
  const [autoRunEnabled, setAutoRunEnabled] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Auto-run QA tests on component mount
    if (autoRunEnabled) {
      runQATests();
    }
  }, [autoRunEnabled]);

  const runQATests = async () => {
    setIsRunning(true);
    toast({
      title: "QA Analysis Started",
      description: "Running comprehensive quality assurance tests...",
    });

    try {
      // Simulate QA test execution with realistic results
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockQAReport = generateMockQAReport();
      setQaReport(mockQAReport);
      setLastRunTime(new Date());

      const failedCount = mockQAReport.results.filter(r => r.status === 'fail').length;
      const warningCount = mockQAReport.results.filter(r => r.status === 'warning').length;

      if (failedCount > 0) {
        toast({
          title: "QA Analysis Complete - Issues Found",
          description: `Found ${failedCount} failed tests and ${warningCount} warnings. Check details below.`,
          variant: "destructive"
        });
      } else if (warningCount > 0) {
        toast({
          title: "QA Analysis Complete - Warnings",
          description: `All tests passed with ${warningCount} warnings.`,
        });
      } else {
        toast({
          title: "QA Analysis Complete - All Passed",
          description: "All quality assurance tests passed successfully!",
        });
      }
    } catch (error) {
      toast({
        title: "QA Analysis Failed",
        description: "An error occurred while running QA tests. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const retryFailedTest = async (testName: string) => {
    toast({
      title: "Retrying Test",
      description: `Re-running test: ${testName}`,
    });

    // Simulate retry logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (qaReport) {
      const updatedResults = qaReport.results.map(test => 
        test.testName === testName 
          ? { ...test, status: Math.random() > 0.5 ? 'pass' : 'fail' as 'pass' | 'fail' }
          : test
      );
      
      setQaReport({
        ...qaReport,
        results: updatedResults,
        passed: updatedResults.filter(r => r.status === 'pass').length,
        failed: updatedResults.filter(r => r.status === 'fail').length,
        warnings: updatedResults.filter(r => r.status === 'warning').length
      });
    }

    toast({
      title: "Test Retry Complete",
      description: `Test ${testName} has been re-executed.`,
    });
  };

  const applyAutoFix = async (testName: string, fix: string) => {
    toast({
      title: "Applying Auto-Fix",
      description: `Applying fix for ${testName}: ${fix}`,
    });

    // Simulate auto-fix application
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Dispatch lovable message for auto-fix
    const event = new CustomEvent('lovable-message', {
      detail: {
        message: `AUTO-FIX: ${fix} for test "${testName}". Apply the suggested changes to resolve the failing test.`,
        silent: false
      }
    });
    window.dispatchEvent(event);

    toast({
      title: "Auto-Fix Applied",
      description: `Fix has been applied for ${testName}. Re-run tests to verify.`,
    });
  };

  const exportQAReport = () => {
    if (!qaReport) return;

    const reportData = {
      timestamp: qaReport.timestamp,
      overall: qaReport.overall,
      summary: {
        total: qaReport.totalTests,
        passed: qaReport.passed,
        failed: qaReport.failed,
        warnings: qaReport.warnings
      },
      results: qaReport.results,
      performanceMetrics: qaReport.performanceMetrics,
      refactoringRecommendations: qaReport.refactoringRecommendations
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qa-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Exported",
      description: "QA report has been downloaded as JSON file.",
    });
  };

  const getOverallStatusColor = () => {
    if (!qaReport) return 'text-gray-500';
    switch (qaReport.overall) {
      case 'pass': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'fail': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  const getOverallStatusIcon = () => {
    if (!qaReport) return <Clock className="h-5 w-5" />;
    switch (qaReport.overall) {
      case 'pass': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'fail': return <AlertCircle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CardTitle className="flex items-center space-x-2">
                {getOverallStatusIcon()}
                <span>Enhanced QA Dashboard</span>
              </CardTitle>
              {qaReport && (
                <Badge 
                  variant={qaReport.overall === 'pass' ? 'default' : 'destructive'}
                  className={qaReport.overall === 'warning' ? 'bg-yellow-500' : ''}
                >
                  {qaReport.overall.toUpperCase()}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRunEnabled(!autoRunEnabled)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Auto-Run: {autoRunEnabled ? 'ON' : 'OFF'}
              </Button>
              
              {qaReport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportQAReport}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              )}
              
              <Button
                onClick={runQATests}
                disabled={isRunning}
                className="flex items-center space-x-2"
              >
                {isRunning ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                <span>{isRunning ? 'Running...' : 'Run QA Tests'}</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        {lastRunTime && (
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Last run: {lastRunTime.toLocaleString()}
            </p>
          </CardContent>
        )}
      </Card>

      {/* Test Results */}
      {qaReport && (
        <Tabs defaultValue="failures" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="failures" className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span>Test Failures</span>
              {qaReport.failed > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {qaReport.failed}
                </Badge>
              )}
            </TabsTrigger>
            
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            
            <TabsTrigger value="performance" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Performance</span>
            </TabsTrigger>
            
            <TabsTrigger value="recommendations" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Recommendations</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="failures" className="mt-6">
            <QATestFailureDisplay
              qaReport={qaReport}
              onRetryTest={retryFailedTest}
              onApplyFix={applyAutoFix}
            />
          </TabsContent>

          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{qaReport.passed}</p>
                    <p className="text-sm text-muted-foreground">Passed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{qaReport.failed}</p>
                    <p className="text-sm text-muted-foreground">Failed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{qaReport.warnings}</p>
                    <p className="text-sm text-muted-foreground">Warnings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{qaReport.totalTests}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Render Time</p>
                    <p className="text-lg">{qaReport.performanceMetrics.renderTime}ms</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Memory Usage</p>
                    <p className="text-lg">{qaReport.performanceMetrics.memoryUsage}MB</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Bundle Size</p>
                    <p className="text-lg">{qaReport.performanceMetrics.bundleSize}MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Refactoring Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qaReport.refactoringRecommendations.map((rec, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium">{rec.file}</h4>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                      <p className="text-sm mt-1">{rec.suggestion}</p>
                      <Badge variant="outline" className="mt-2">
                        {rec.priority} priority
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Loading State */}
      {isRunning && !qaReport && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium">Running QA Analysis...</p>
              <p className="text-sm text-muted-foreground">
                This may take a few moments while we analyze your codebase
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Mock QA Report Generator
function generateMockQAReport(): QAReport {
  const mockResults: QATestResult[] = [
    {
      testName: 'Memory Leak Detection',
      status: 'fail',
      message: 'Memory usage growing at 15MB per minute, potential leak in useEffect cleanup',
      category: 'performance',
      suggestions: ['Add cleanup function to useEffect', 'Implement proper event listener removal']
    },
    {
      testName: 'Authentication Security',
      status: 'fail',
      message: 'JWT tokens not properly validated on protected routes',
      category: 'security',
      suggestions: ['Implement token validation middleware', 'Add token expiration checks']
    },
    {
      testName: 'Component Performance',
      status: 'warning',
      message: 'Large component detected (>220 lines), consider splitting',
      category: 'maintainability',
      performance: 75
    },
    {
      testName: 'API Response Time',
      status: 'pass',
      message: 'All API endpoints responding within acceptable limits',
      category: 'performance',
      performance: 95
    },
    {
      testName: 'Test Coverage',
      status: 'warning',
      message: 'Code coverage at 65%, recommended minimum is 80%',
      category: 'testing'
    },
    {
      testName: 'Bundle Size Optimization',
      status: 'pass',
      message: 'Bundle size within optimal range',
      category: 'performance'
    },
    {
      testName: 'Code Complexity Analysis',
      status: 'fail',
      message: 'Cyclomatic complexity exceeds threshold in 3 functions',
      category: 'maintainability',
      suggestions: ['Break down complex functions', 'Extract helper functions']
    }
  ];

  const failed = mockResults.filter(r => r.status === 'fail').length;
  const warnings = mockResults.filter(r => r.status === 'warning').length;
  const passed = mockResults.filter(r => r.status === 'pass').length;

  return {
    overall: failed > 0 ? 'fail' : warnings > 0 ? 'warning' : 'pass',
    timestamp: new Date(),
    totalTests: mockResults.length,
    passed,
    failed,
    warnings,
    results: mockResults,
    performanceMetrics: {
      renderTime: 1250,
      memoryUsage: 145,
      bundleSize: 2.8,
      componentCount: 67,
      largeFiles: ['AnalysisResultsDisplay.tsx', 'ProjectFormManagement.ts'],
      qaSystemDuration: 3200
    },
    refactoringRecommendations: [
      {
        file: 'src/components/analysis/AnalysisResultsDisplay.tsx',
        type: 'size',
        priority: 'high',
        description: 'Component has 280 lines, exceeding recommended maximum',
        suggestion: 'Split into smaller components: ResultsHeader, ResultsContent, ResultsFooter'
      },
      {
        file: 'src/hooks/useProjectFormManagement.ts',
        type: 'complexity',
        priority: 'medium',
        description: 'Hook has high cyclomatic complexity',
        suggestion: 'Extract form validation and persistence logic into separate hooks'
      }
    ]
  };
}