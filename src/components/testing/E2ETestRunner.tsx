import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { useToast } from '../ui/use-toast';
import { Activity, Play, Clock } from 'lucide-react';
import { TestResultCard } from '../../types/testing';
import { TestRunners } from '../../utils/testing/testRunners';
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
      // 1. System Health Check (15%)
      setCurrentTest('System Health Check');
      setProgress(15);
      const healthResult = await TestRunners.runSystemHealthCheck();
      results.push(healthResult);
      setTestResults([...results]);
      
      // 2. Performance Analysis (30%)
      setCurrentTest('Performance Analysis');
      setProgress(30);
      const performanceResult = await TestRunners.runPerformanceAnalysis();
      results.push(performanceResult);
      setTestResults([...results]);
      
      // 3. QA Analysis (50%)
      setCurrentTest('QA Analysis');
      setProgress(50);
      const qaResult = await TestRunners.runQAAnalysis();
      results.push(qaResult);
      setTestResults([...results]);
      
      // 4. Load Testing (70%)
      setCurrentTest('Load Testing');
      setProgress(70);
      const loadResult = await TestRunners.runLoadTesting();
      results.push(loadResult);
      setTestResults([...results]);
      
      // 5. Data Pipeline Testing (85%)
      setCurrentTest('Data Pipeline Testing');
      setProgress(85);
      const pipelineResult = await TestRunners.runDataPipelineTesting();
      results.push(pipelineResult);
      setTestResults([...results]);
      
      // 6. Final Verification (100%)
      setCurrentTest('Final Verification');
      setProgress(100);
      const finalResult = await TestRunners.runFinalVerification();
      results.push(finalResult);
      setTestResults([...results]);
      
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