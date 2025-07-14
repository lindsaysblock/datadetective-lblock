
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { FileUploadScenarioTests } from '@/utils/testing/suites/fileUploadScenarioTests';
import { UnitTestResult } from '@/utils/testing/testRunner';

const FileUploadTestRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<UnitTestResult[]>([]);
  const [hasRun, setHasRun] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      const testSuite = new FileUploadScenarioTests();
      const results = await testSuite.runAllTests();
      setTestResults(results);
      setHasRun(true);
    } catch (error) {
      console.error('Error running file upload tests:', error);
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
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === 'pass' ? 'default' : status === 'fail' ? 'destructive' : 'secondary';
    return (
      <Badge variant={variant} className="ml-2">
        {status.toUpperCase()}
      </Badge>
    );
  };

  const passedTests = testResults.filter(test => test.status === 'pass').length;
  const failedTests = testResults.filter(test => test.status === 'fail').length;
  const totalTests = testResults.length;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="w-5 h-5" />
          File Upload Scenario Tests
        </CardTitle>
        <p className="text-sm text-gray-600">
          Comprehensive tests for single file, multiple files, and sequential file upload scenarios
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={runTests} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isRunning ? 'Running Tests...' : 'Run File Upload Tests'}
          </Button>
          
          {hasRun && (
            <div className="flex items-center gap-4 text-sm">
              <span className="text-green-600">✓ {passedTests} passed</span>
              <span className="text-red-600">✗ {failedTests} failed</span>
              <span className="text-gray-600">Total: {totalTests}</span>
            </div>
          )}
        </div>

        {isRunning && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-blue-700">Running file upload tests...</span>
            </div>
          </div>
        )}

        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Test Results</h3>
            {testResults.map((test, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <h4 className="font-medium">{test.testName}</h4>
                    <p className="text-sm text-gray-600">
                      Duration: {test.duration.toFixed(2)}ms | 
                      Assertions: {test.passedAssertions}/{test.assertions}
                    </p>
                    {test.error && (
                      <p className="text-sm text-red-600 mt-1">{test.error}</p>
                    )}
                  </div>
                </div>
                {getStatusBadge(test.status)}
              </div>
            ))}
          </div>
        )}

        {hasRun && totalTests > 0 && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-medium mb-2">Test Coverage Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Single File Upload:</strong> Tests file upload with one file</p>
                <p><strong>Multiple Files Upload:</strong> Tests simultaneous multiple file upload</p>
                <p><strong>Sequential Upload:</strong> Tests adding files one after another</p>
              </div>
              <div>
                <p><strong>Event Handling:</strong> Tests proper React event structure</p>
                <p><strong>FileList Creation:</strong> Tests FileList interface implementation</p>
                <p><strong>Processing Flow:</strong> Tests complete upload flow</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploadTestRunner;
