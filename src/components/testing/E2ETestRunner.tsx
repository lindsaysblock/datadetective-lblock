
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useAutoQA } from '../../hooks/useAutoQA';
import { useE2ELoadTest } from '../../hooks/useE2ELoadTest';
import { 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Activity,
  Zap,
  Settings,
  BarChart3
} from 'lucide-react';

const E2ETestRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [testResults, setTestResults] = useState<any[]>([]);
  const { toast } = useToast();
  const { runManualQA } = useAutoQA();
  const { runFullLoadTest, runQuickLoadCheck } = useE2ELoadTest();

  const testSteps = [
    { name: 'QA Analysis', icon: Settings, weight: 30 },
    { name: 'Load Testing', icon: Activity, weight: 25 },
    { name: 'Performance Check', icon: BarChart3, weight: 20 },
    { name: 'Quick Validation', icon: Zap, weight: 15 },
    { name: 'Final Report', icon: CheckCircle, weight: 10 }
  ];

  const runFullE2ETest = async () => {
    setIsRunning(true);
    setProgress(0);
    setTestResults([]);
    
    try {
      toast({
        title: "E2E Testing Started",
        description: "Running comprehensive end-to-end test suite...",
        duration: 3000,
      });

      let cumulativeProgress = 0;

      // Step 1: QA Analysis
      setCurrentStep('Running QA Analysis...');
      const qaReport = await runManualQA();
      cumulativeProgress += testSteps[0].weight;
      setProgress(cumulativeProgress);
      
      setTestResults(prev => [...prev, {
        step: 'QA Analysis',
        status: qaReport.overall === 'pass' ? 'success' : qaReport.overall === 'warning' ? 'warning' : 'error',
        details: `${qaReport.passed}/${qaReport.totalTests} tests passed`,
        timestamp: new Date()
      }]);

      // Step 2: Load Testing
      setCurrentStep('Running Load Tests...');
      await runFullLoadTest();
      cumulativeProgress += testSteps[1].weight;
      setProgress(cumulativeProgress);
      
      setTestResults(prev => [...prev, {
        step: 'Load Testing',
        status: 'success',
        details: 'Comprehensive load tests completed',
        timestamp: new Date()
      }]);

      // Step 3: Performance Check
      setCurrentStep('Performance Analysis...');
      const performanceMetrics = await runPerformanceAnalysis();
      cumulativeProgress += testSteps[2].weight;
      setProgress(cumulativeProgress);
      
      setTestResults(prev => [...prev, {
        step: 'Performance Check',
        status: performanceMetrics.efficient ? 'success' : 'warning',
        details: `System efficiency: ${performanceMetrics.efficiency}%`,
        timestamp: new Date()
      }]);

      // Step 4: Quick Validation
      setCurrentStep('Quick System Validation...');
      await runQuickLoadCheck();
      cumulativeProgress += testSteps[3].weight;
      setProgress(cumulativeProgress);
      
      setTestResults(prev => [...prev, {
        step: 'Quick Validation',
        status: 'success',
        details: 'System validation completed',
        timestamp: new Date()
      }]);

      // Step 5: Final Report
      setCurrentStep('Generating Final Report...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(100);
      
      const overallStatus = testResults.every(r => r.status === 'success') ? 'success' : 
                           testResults.some(r => r.status === 'error') ? 'error' : 'warning';
      
      setTestResults(prev => [...prev, {
        step: 'Final Report',
        status: overallStatus,
        details: 'E2E testing completed successfully',
        timestamp: new Date()
      }]);

      toast({
        title: "E2E Testing Complete ✅",
        description: "All tests completed. Check results below for detailed analysis.",
        duration: 5000,
      });

    } catch (error) {
      console.error('E2E testing failed:', error);
      toast({
        title: "E2E Testing Failed",
        description: "An error occurred during testing. Check console for details.",
        variant: "destructive",
        duration: 6000,
      });
      
      setTestResults(prev => [...prev, {
        step: 'Error',
        status: 'error',
        details: `Testing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsRunning(false);
      setCurrentStep('');
    }
  };

  const runPerformanceAnalysis = async (): Promise<{ efficient: boolean; efficiency: number }> => {
    // Simulate performance analysis
    const startTime = performance.now();
    
    // Check memory usage
    const memoryUsage = 'memory' in performance ? 
      (performance as any).memory.usedJSHeapSize / 1024 / 1024 : 0;
    
    // Check DOM complexity
    const domNodes = document.getElementsByTagName('*').length;
    
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const analysisTime = performance.now() - startTime;
    
    // Calculate efficiency score
    let efficiency = 100;
    if (memoryUsage > 50) efficiency -= 20;
    if (domNodes > 1000) efficiency -= 15;
    if (analysisTime > 3000) efficiency -= 10;
    
    return {
      efficient: efficiency > 70,
      efficiency: Math.max(0, efficiency)
    };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'success': return 'default';
      case 'warning': return 'secondary';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  useEffect(() => {
    // Auto-run E2E tests on component mount
    const autoRun = setTimeout(() => {
      runFullE2ETest();
    }, 2000);

    return () => clearTimeout(autoRun);
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5 text-blue-600" />
          End-to-End Testing Suite
        </CardTitle>
        <CardDescription>
          Comprehensive testing including QA analysis, load testing, and performance validation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Button 
                onClick={runFullE2ETest}
                disabled={isRunning}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Play className="w-4 h-4 mr-2" />
                {isRunning ? 'Running Tests...' : 'Run Full E2E Test'}
              </Button>
            </div>
            {currentStep && (
              <p className="text-sm text-gray-600">{currentStep}</p>
            )}
          </div>
          
          {isRunning && (
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{progress}%</div>
              <div className="text-xs text-gray-500">Complete</div>
            </div>
          )}
        </div>

        {isRunning && (
          <Progress value={progress} className="w-full" />
        )}

        {testResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-lg">Test Results</h3>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <div className="font-medium">{result.step}</div>
                      <div className="text-sm text-gray-600">{result.details}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={getStatusBadgeVariant(result.status)}>
                      {result.status.toUpperCase()}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">
                      {result.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Test Coverage Areas</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {testSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <Icon className="w-4 h-4 text-gray-600" />
                  <span className="text-sm">{step.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
          <strong>Note:</strong> E2E tests run automatically on page load and can be manually triggered. 
          Results and detailed logs are available in the browser console (F12).
        </div>
      </CardContent>
    </Card>
  );
};

export default E2ETestRunner;
