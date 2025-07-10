
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useE2ELoadTest } from '../hooks/useE2ELoadTest';
import { Activity, Zap, Play, CheckCircle } from 'lucide-react';

const LoadTestRunner: React.FC = () => {
  const { isRunning, runFullLoadTest, runQuickLoadCheck } = useE2ELoadTest();

  useEffect(() => {
    // Auto-run quick load check on component mount
    const runInitialCheck = async () => {
      console.log('🔍 Running initial load check...');
      await runQuickLoadCheck();
    };

    // Delay to allow page to load
    const timer = setTimeout(runInitialCheck, 1000);
    return () => clearTimeout(timer);
  }, [runQuickLoadCheck]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-600" />
          Load Management Testing
        </CardTitle>
        <CardDescription>
          Test system performance under various load conditions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" />
              Quick Load Check
            </h3>
            <p className="text-sm text-gray-600">
              Fast system health check with light load testing
            </p>
            <Button 
              variant="outline" 
              onClick={runQuickLoadCheck}
              disabled={isRunning}
              className="w-full"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isRunning ? 'Running...' : 'Quick Check'}
            </Button>
          </div>

          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Play className="w-4 h-4 text-green-500" />
              Full Load Test
            </h3>
            <p className="text-sm text-gray-600">
              Comprehensive testing with multiple load scenarios
            </p>
            <Button 
              onClick={runFullLoadTest}
              disabled={isRunning}
              className="w-full"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Testing...' : 'Run Full Test'}
            </Button>
          </div>
        </div>

        {isRunning && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-700">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="font-medium">Load testing in progress...</span>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              Check the console for real-time test progress and detailed results
            </p>
          </div>
        )}

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">Test Coverage</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Component Rendering</Badge>
            <Badge variant="outline">Data Processing</Badge>
            <Badge variant="outline">UI Interactions</Badge>
            <Badge variant="outline">API Calls</Badge>
            <Badge variant="outline">Memory Management</Badge>
            <Badge variant="outline">Performance Metrics</Badge>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Results will appear in the browser console.</strong> Open Developer Tools (F12) 
              to see detailed performance metrics, error rates, and system recommendations.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadTestRunner;
