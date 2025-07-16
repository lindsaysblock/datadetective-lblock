
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Play, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { NewProjectE2ETest } from '../../utils/testing/newProjectE2ETest';
import TestResultCard from './TestResultCard';

const NewProjectE2ETestRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const { toast } = useToast();

  const runE2ETest = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      toast({
        title: "E2E Testing Started",
        description: "Running comprehensive new project flow tests...",
      });

      const e2eTest = new NewProjectE2ETest();
      const results = await e2eTest.runFullE2EFlow();
      
      setTestResults(results);
      
      const passed = results.filter(r => r.status === 'pass').length;
      const failed = results.filter(r => r.status === 'fail').length;
      
      toast({
        title: "E2E Testing Complete",
        description: `${passed} tests passed, ${failed} tests failed`,
        variant: failed > 0 ? "destructive" : "default",
      });
      
    } catch (error) {
      console.error('E2E testing failed:', error);
      toast({
        title: "E2E Testing Failed",
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
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const passed = testResults.filter(r => r.status === 'pass').length;
  const failed = testResults.filter(r => r.status === 'fail').length;
  const total = testResults.length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5 text-blue-600" />
          New Project E2E Test Suite
        </CardTitle>
        <CardDescription>
          Comprehensive testing of the new project creation flow including text input, file upload, and analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            onClick={runE2ETest}
            disabled={isRunning}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running E2E Tests...' : 'Run New Project E2E Tests'}
          </Button>
          
          {total > 0 && (
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {((passed / total) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-500">Success Rate</div>
            </div>
          )}
        </div>

        {isRunning && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-blue-700 font-medium">Running comprehensive E2E tests...</p>
            </CardContent>
          </Card>
        )}

        {testResults.length > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">{passed}</div>
                <div className="text-sm text-green-700">Passed</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-600">{failed}</div>
                <div className="text-sm text-red-700">Failed</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{total}</div>
                <div className="text-sm text-blue-700">Total</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-800">Test Results:</h4>
              {testResults.map((result, index) => (
                <TestResultCard
                  key={index}
                  result={{
                    step: result.testName,
                    status: result.status === 'pass' ? 'success' : result.status === 'fail' ? 'error' : 'warning',
                    details: result.error || 'Test completed successfully',
                    timestamp: new Date()
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
          <strong>New Project E2E Testing:</strong> This suite validates the complete new project flow including:
          research question input (fixing text input issues), file upload and processing, form state management, 
          navigation between steps, and the analysis route functionality.
        </div>
      </CardContent>
    </Card>
  );
};

export default NewProjectE2ETestRunner;
