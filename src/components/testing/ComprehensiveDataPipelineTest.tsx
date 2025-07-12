
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ComprehensiveTestSuite } from '../../utils/testing/suites/comprehensiveTestSuite';
import { TestSuite, UnitTestResult } from '../../utils/testing/types';
import { Play, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

const ComprehensiveDataPipelineTest: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSuite, setCurrentSuite] = useState('');
  const [testResults, setTestResults] = useState<TestSuite[]>([]);
  const [summary, setSummary] = useState<{
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  }>({ total: 0, passed: 0, failed: 0, warnings: 0 });
  const { toast } = useToast();

  const runComprehensiveTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setTestResults([]);
    setCurrentSuite('Initializing...');

    try {
      toast({
        title: "Comprehensive Testing Started",
        description: "Running all data pipeline and analytics tests...",
        duration: 3000,
      });

      const testSuite = new ComprehensiveTestSuite();
      const suites = await testSuite.runAll();
      
      setTestResults(suites);
      
      // Calculate summary
      const totalTests = suites.reduce((sum, suite) => sum + suite.tests.length, 0);
      const passedTests = suites.reduce((sum, suite) => 
        sum + suite.tests.filter(test => test.status === 'pass').length, 0
      );
      const failedTests = suites.reduce((sum, suite) => 
        sum + suite.tests.filter(test => test.status === 'fail').length, 0
      );
      const warningTests = suites.reduce((sum, suite) => 
        sum + suite.tests.filter(test => test.status === 'warning').length, 0
      );

      setSummary({
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        warnings: warningTests
      });

      setProgress(100);
      setCurrentSuite('Complete');

      toast({
        title: "Testing Complete!",
        description: `${passedTests}/${totalTests} tests passed successfully`,
        duration: 5000,
      });

    } catch (error) {
      console.error('Comprehensive testing failed:', error);
      toast({
        title: "Testing Failed",
        description: "Some tests encountered errors during execution",
        variant: "destructive",
        duration: 6000,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'fail':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800';
      case 'fail':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5 text-blue-600" />
          Comprehensive Data Pipeline Testing
        </CardTitle>
        <CardDescription>
          Complete validation of data upload, processing, and analytics pipeline
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            onClick={runComprehensiveTests}
            disabled={isRunning}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running Comprehensive Tests...' : 'Run All Pipeline Tests'}
          </Button>
          
          {summary.total > 0 && (
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {summary.passed}/{summary.total}
              </div>
              <div className="text-xs text-gray-500">Tests Passed</div>
            </div>
          )}
        </div>

        {isRunning && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{currentSuite}</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {summary.total > 0 && (
          <div className="grid grid-cols-4 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-700">{summary.passed}</div>
                <div className="text-sm text-green-600">Passed</div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-700">{summary.failed}</div>
                <div className="text-sm text-red-600">Failed</div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-700">{summary.warnings}</div>
                <div className="text-sm text-yellow-600">Warnings</div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-700">{summary.total}</div>
                <div className="text-sm text-blue-600">Total</div>
              </CardContent>
            </Card>
          </div>
        )}

        {testResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Test Results</h3>
            {testResults.map((suite, suiteIndex) => (
              <Card key={suiteIndex} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{suite.suiteName}</CardTitle>
                  <div className="text-sm text-gray-500">
                    Duration: {suite.totalDuration.toFixed(2)}ms | 
                    Tests: {suite.tests.length}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {suite.tests.map((test, testIndex) => (
                    <div key={testIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(test.status)}
                        <span className="text-sm font-medium">{test.testName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {test.duration && (
                          <span className="text-xs text-gray-500">
                            {test.duration.toFixed(1)}ms
                          </span>
                        )}
                        <Badge className={getStatusColor(test.status)}>
                          {test.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
          <strong>Pipeline Coverage:</strong> Tests validate file uploads, pasted data, database connections, 
          data validation, edge cases, performance, and TypeScript type safety across the entire data pipeline.
        </div>
      </CardContent>
    </Card>
  );
};

export default ComprehensiveDataPipelineTest;
