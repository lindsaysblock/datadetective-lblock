import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { useToast } from '../ui/use-toast';
import { Activity, Play, Clock } from 'lucide-react';
import { TestResultCard } from '../../types/testing';
import { QATestSuites } from '../../utils/qa/qaTestSuites';
import { TestRunner } from '../../utils/qa/testRunner';
import TestResultCardComponent from './TestResultCard';

export const E2ETestRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState('');
  const [testResults, setTestResults] = useState<TestResultCard[]>([]);
  const [expandedQA, setExpandedQA] = useState(false);
  const { toast } = useToast();

  const runAllTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setTestResults([]);
    
    toast({
      title: "🚀 Comprehensive E2E Testing Started",
      description: "Running all test suites including QA, performance, and data pipeline tests",
    });

    const results: TestResultCard[] = [];
    
    try {
      // Initialize QA test systems with static imports
      const qaTestSuites = new QATestSuites();
      const testRunner = new TestRunner(qaTestSuites);
      qaTestSuites.clearResults();

      const individualTestSuites = [
        { name: 'Component Tests', method: 'testComponents', progress: 8 },
        { name: 'Data Flow Tests', method: 'testDataFlow', progress: 16 },
        { name: 'Data Validation Tests', method: 'testDataValidation', progress: 24 },
        { name: 'Column Identification Tests', method: 'testColumnIdentification', progress: 32 },
        { name: 'Analytics Tests', method: 'testAnalytics', progress: 40 },
        { name: 'Analytics Load Tests', method: 'testAnalyticsLoad', progress: 48 },
        { name: 'Analytics Performance Tests', method: 'testAnalyticsPerformance', progress: 56 },
        { name: 'User Experience Tests', method: 'testUserExperience', progress: 64 },
        { name: 'Data Integrity Tests', method: 'testDataIntegrity', progress: 72 },
        { name: 'Authentication Tests', method: 'testAuthentication', progress: 80 },
        { name: 'Routing Tests', method: 'testRouting', progress: 88 },
        { name: 'System Health Tests', method: 'testSystemHealth', progress: 96 },
        { name: 'API Integration Tests', method: 'testAPIIntegration', progress: 100 }
      ];

      // Run each test suite individually
      for (const suite of individualTestSuites) {
        setCurrentTest(suite.name);
        setProgress(suite.progress);
        
        const startCount = qaTestSuites.getResults().length;
        
        try {
          // Call specific test methods explicitly
          switch (suite.method) {
            case 'testComponents':
              await qaTestSuites.testComponents();
              break;
            case 'testDataFlow':
              await qaTestSuites.testDataFlow();
              break;
            case 'testDataValidation':
              await qaTestSuites.testDataValidation();
              break;
            case 'testColumnIdentification':
              await qaTestSuites.testColumnIdentification();
              break;
            case 'testAnalytics':
              await qaTestSuites.testAnalytics();
              break;
            case 'testAnalyticsLoad':
              await qaTestSuites.testAnalyticsLoad();
              break;
            case 'testAnalyticsPerformance':
              await qaTestSuites.testAnalyticsPerformance();
              break;
            case 'testUserExperience':
              await qaTestSuites.testUserExperience();
              break;
            case 'testDataIntegrity':
              await qaTestSuites.testDataIntegrity();
              break;
            case 'testAuthentication':
              await qaTestSuites.testAuthentication();
              break;
            case 'testRouting':
              await qaTestSuites.testRouting();
              break;
            case 'testSystemHealth':
              await qaTestSuites.testSystemHealth();
              break;
            case 'testAPIIntegration':
              await qaTestSuites.testAPIIntegration();
              break;
            default:
              throw new Error(`Unknown test method: ${suite.method}`);
          }
          
          const endCount = qaTestSuites.getResults().length;
          const suiteTests = qaTestSuites.getResults().slice(startCount);
          
          console.log(`${suite.name}: ${suiteTests.length} tests, ${suiteTests.filter(t => t.status === 'pass').length} passed`);
          
          const passed = suiteTests.filter(t => t.status === 'pass').length;
          const failed = suiteTests.filter(t => t.status === 'fail').length;
          const warnings = suiteTests.filter(t => t.status === 'warning').length;
          
          const status = failed > 0 ? 'error' : warnings > 0 ? 'warning' : 'success';
          
          const result: TestResultCard = {
            name: suite.name,
            status,
            details: `${passed}/${suiteTests.length} tests passed${failed > 0 ? `, ${failed} failed` : ''}${warnings > 0 ? `, ${warnings} warnings` : ''}`,
            timestamp: new Date().toLocaleTimeString(),
            failedTests: failed,
            warningTests: warnings,
            metrics: {
              testsRun: suiteTests.length,
              passed,
              failed,
              warnings,
              coverage: Math.round((passed / suiteTests.length) * 100)
            }
          };
          
          results.push(result);
          setTestResults([...results]);
          
        } catch (error) {
          const result: TestResultCard = {
            name: suite.name,
            status: 'error',
            details: `Test suite failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            timestamp: new Date().toLocaleTimeString()
          };
          results.push(result);
          setTestResults([...results]);
        }
      }
      
      const failed = results.filter(r => r.status === 'error').length;
      const warnings = results.filter(r => r.status === 'warning').length;
      const passed = results.filter(r => r.status === 'success').length;
      
      if (failed === 0) {
        toast({
          title: "✅ Comprehensive E2E Tests Complete",
          description: `All test suites completed: ${passed} passed, ${warnings} warnings`,
        });
      } else {
        toast({
          title: "⚠️ E2E Tests Complete with Issues",
          description: `Tests completed: ${passed} passed, ${failed} failed, ${warnings} warnings`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ E2E Test Error",
        description: "An error occurred during comprehensive testing",
        variant: "destructive",
      });
      console.error('E2E Test Error:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Comprehensive E2E Testing Suite
            <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
          </CardTitle>
          <CardDescription>
            Complete system testing including QA, performance, data pipeline, and load testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Indicator */}
          {isRunning && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                <span className="font-medium text-blue-800">Running Tests & Optimizations...</span>
                <span className="ml-auto text-lg font-bold text-blue-600">{Math.round(progress)}%</span>
              </div>
              <div className="text-sm text-blue-600 mb-1">Complete</div>
              <Progress value={progress} className="h-2 mb-2" />
              {currentTest && (
                <div className="text-sm text-blue-700 font-medium">
                  {currentTest}...
                </div>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-3">
            <Button 
              onClick={runAllTests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Running Tests...' : 'Run All Tests'}
            </Button>
          </div>

          {/* Summary Stats */}
          {testResults.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{testResults.length}</div>
                <div className="text-sm text-muted-foreground">Test Suites</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{testResults.filter(r => r.status === 'success').length}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{testResults.filter(r => r.status === 'error').length}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{testResults.filter(r => r.status === 'warning').length}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Test Results</h3>
          {testResults.map((result) => (
            <TestResultCardComponent
              key={result.name}
              result={result}
              expandedQA={expandedQA}
              onToggleQAExpanded={() => setExpandedQA(!expandedQA)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default E2ETestRunner;