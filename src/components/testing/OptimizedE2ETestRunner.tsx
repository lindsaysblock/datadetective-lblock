import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Play, CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { OptimizedE2ETestRunner, E2ETestResult } from '../../utils/testing/optimizedE2ETestRunner';
import TestResultCard from './TestResultCard';

const OptimizedE2ETestRunnerComponent: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<E2ETestResult[]>([]);
  const [lastRunTime, setLastRunTime] = useState<Date | null>(null);
  const { toast } = useToast();

  const runOptimizedE2ETest = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      toast({
        title: "🧪 E2E Testing Started",
        description: "Running optimized comprehensive test suite...",
      });

      const testRunner = new OptimizedE2ETestRunner(toast);
      const results = await testRunner.runFullE2ETest();
      
      setTestResults(results);
      setLastRunTime(new Date());
      
      const passed = results.filter(r => r.status === 'pass').length;
      const failed = results.filter(r => r.status === 'fail').length;
      const warnings = results.filter(r => r.status === 'warning').length;
      
      toast({
        title: "🎯 E2E Testing Complete",
        description: `${passed} passed, ${failed} failed, ${warnings} warnings`,
        variant: failed > 0 ? "destructive" : "default",
      });
      
    } catch (error) {
      console.error('E2E testing failed:', error);
      toast({
        title: "❌ E2E Testing Failed",
        description: "An error occurred during testing. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <RefreshCw className="w-5 h-5 text-blue-600" />;
    }
  };

  const passed = testResults.filter(r => r.status === 'pass').length;
  const failed = testResults.filter(r => r.status === 'fail').length;
  const warnings = testResults.filter(r => r.status === 'warning').length;
  const total = testResults.length;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(0) : '0';

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5 text-brand-blue" />
          🕵️ Data Detective E2E Test Suite
        </CardTitle>
        <CardDescription>
          Comprehensive optimized testing of the complete data analysis pipeline including text input, file upload, form persistence, and analysis flow
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            onClick={runOptimizedE2ETest}
            disabled={isRunning}
            size="lg"
            className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink hover:from-brand-blue/90 hover:via-brand-purple/90 hover:to-brand-pink/90 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? '🔍 Running Investigation Tests...' : '🚀 Run Data Detective E2E Tests'}
          </Button>
          
          {total > 0 && (
            <div className="text-right">
              <div className="text-3xl font-bold text-brand-blue">
                {passRate}%
              </div>
              <div className="text-xs text-muted-foreground">Success Rate</div>
              {lastRunTime && (
                <div className="text-xs text-muted-foreground mt-1">
                  Last run: {lastRunTime.toLocaleTimeString()}
                </div>
              )}
            </div>
          )}
        </div>

        {isRunning && (
          <Card className="bg-gradient-to-r from-brand-blue/10 to-brand-purple/10 border-brand-blue/20">
            <CardContent className="p-6 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-brand-blue border-t-transparent mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-brand-blue mb-2">🔍 Investigating System Health</h3>
              <p className="text-brand-purple">Running comprehensive tests on the Data Detective platform...</p>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="p-2 bg-white/50 rounded">📝 Form Tests</div>
                <div className="p-2 bg-white/50 rounded">📁 File Tests</div>
                <div className="p-2 bg-white/50 rounded">🔄 Flow Tests</div>
                <div className="p-2 bg-white/50 rounded">📊 Data Tests</div>
              </div>
            </CardContent>
          </Card>
        )}

        {testResults.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-gradient-to-br from-green-500/10 to-green-500/20 p-4 rounded-lg border border-green-500/20">
                <div className="text-3xl font-bold text-green-600">{passed}</div>
                <div className="text-sm text-green-700">✅ Passed</div>
              </div>
              <div className="bg-gradient-to-br from-red-500/10 to-red-500/20 p-4 rounded-lg border border-red-500/20">
                <div className="text-3xl font-bold text-red-600">{failed}</div>
                <div className="text-sm text-red-700">❌ Failed</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/20 p-4 rounded-lg border border-yellow-500/20">
                <div className="text-3xl font-bold text-yellow-600">{warnings}</div>
                <div className="text-sm text-yellow-700">⚠️ Warnings</div>
              </div>
              <div className="bg-gradient-to-br from-brand-blue/10 to-brand-purple/20 p-4 rounded-lg border border-brand-blue/20">
                <div className="text-3xl font-bold text-brand-blue">{total}</div>
                <div className="text-sm text-brand-blue">🧪 Total Tests</div>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  🔍 Investigation Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {testResults.map((result, index) => (
                  <TestResultCard
                    key={index}
                    result={{
                      step: result.testName,
                      status: result.status === 'pass' ? 'success' : result.status === 'fail' ? 'error' : 'warning',
                      details: result.error || result.message,
                      timestamp: new Date()
                    }}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-brand-purple" />
                  📊 Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">
                      {testResults.reduce((sum, r) => sum + r.duration, 0)}ms
                    </div>
                    <div className="text-sm text-blue-700">Total Duration</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">
                      {Math.round(testResults.reduce((sum, r) => sum + r.duration, 0) / testResults.length)}ms
                    </div>
                    <div className="text-sm text-purple-700">Avg Test Time</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg">
                    <div className="text-xl font-bold text-pink-600">
                      {failed === 0 ? '🎯' : failed <= 2 ? '👍' : '⚠️'}
                    </div>
                    <div className="text-sm text-pink-700">Health Status</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="bg-gradient-to-r from-brand-blue/5 to-brand-purple/5 rounded-lg p-6 border border-brand-blue/20">
          <h4 className="font-semibold text-foreground mb-2">🕵️ Data Detective E2E Testing</h4>
          <p className="text-sm text-muted-foreground mb-3">
            This optimized test suite validates the complete data investigation workflow including:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div>✅ Research question text input functionality</div>
            <div>✅ Form validation and error handling</div>
            <div>✅ File upload and processing pipeline</div>
            <div>✅ Data persistence and state management</div>
            <div>✅ Navigation between investigation steps</div>
            <div>✅ Analysis flow and route functionality</div>
            <div>✅ UI responsiveness and accessibility</div>
            <div>✅ Performance monitoring and optimization</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizedE2ETestRunnerComponent;