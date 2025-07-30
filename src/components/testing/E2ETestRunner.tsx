import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Play, Activity, BarChart3, Zap, CheckCircle } from 'lucide-react';
import { useE2ETestLogic } from './hooks/useE2ETestLogic';

const E2ETestRunner: React.FC = () => {
  const { toast } = useToast();
  const { runE2ETests, isRunning, progress, currentTest, results } = useE2ETestLogic();

  const handleRunTests = async () => {
    toast({
      title: "🚀 E2E Testing Started",
      description: "Running comprehensive end-to-end tests with safe DOM operations",
    });

    try {
      const testResults = await runE2ETests();
      
      const passed = testResults.filter(r => r.status === 'pass').length;
      const failed = testResults.filter(r => r.status === 'fail').length;
      const warnings = testResults.filter(r => r.status === 'warning').length;
      
      if (failed === 0) {
        toast({
          title: "✅ E2E Tests Complete",
          description: `All tests completed: ${passed} passed, ${warnings} warnings`,
        });
      } else {
        toast({
          title: "⚠️ E2E Tests Complete",
          description: `Tests completed: ${passed} passed, ${failed} failed, ${warnings} warnings`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "❌ E2E Test Error",
        description: "An error occurred during testing",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            E2E Testing Suite
          </CardTitle>
          <CardDescription>
            Comprehensive end-to-end testing for all application flows
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800">Authentication</span>
              </div>
              <p className="text-sm text-green-600 mt-1">Login/logout flows</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-800">Navigation</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">Route transitions</p>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-800">Interactions</span>
              </div>
              <p className="text-sm text-purple-600 mt-1">User workflows</p>
            </div>
          </div>

          <Button
            onClick={handleRunTests}
            disabled={isRunning}
            className="w-full"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running Tests...' : 'Run E2E Tests'}
          </Button>

          {isRunning && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Current Test:</span>
                <span>{currentTest}</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="text-center text-sm text-muted-foreground">
                {Math.round(progress)}% Complete
              </div>
            </div>
          )}

          {results.length > 0 && !isRunning && (
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold">Test Results:</h4>
              {results.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{result.testName}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      result.status === 'pass' ? 'bg-green-100 text-green-800' :
                      result.status === 'fail' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {result.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {result.duration.toFixed(0)}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default E2ETestRunner;