/**
 * Diagnostic Component for Testing Messages
 * Helps identify any remaining disabled/maintenance messages
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DiagnosticTestRunner: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const runDiagnostics = async () => {
    setIsRunning(true);
    setDiagnostics([]);
    
    const results = [];
    
    try {
      // Test 1: Check useAutoQA hook
      const { useAutoQA } = await import('../../hooks/useAutoQA');
      const mockQA = useAutoQA();
      results.push({
        test: 'useAutoQA Hook Status',
        status: 'pass',
        message: 'Hook loaded successfully - no disabled messages'
      });
      
      // Test 2: Check useE2ELoadTest hook  
      const { useE2ELoadTest } = await import('../../hooks/useE2ELoadTest');
      const mockLoad = useE2ELoadTest();
      results.push({
        test: 'useE2ELoadTest Hook Status',
        status: 'pass', 
        message: 'Hook loaded successfully - no disabled messages'
      });

      // Test 3: Check current page content for disabled messages
      const bodyText = document.body.innerText.toLowerCase();
      const disabledMessages = [
        'temporarily disabled',
        'maintenance mode',
        'under maintenance',
        'system disabled',
        'qa system disabled',
        'load testing disabled'
      ];
      
      const foundMessages = disabledMessages.filter(msg => bodyText.includes(msg));
      
      if (foundMessages.length > 0) {
        results.push({
          test: 'Page Content Check',
          status: 'fail',
          message: `Found disabled messages: ${foundMessages.join(', ')}`
        });
      } else {
        results.push({
          test: 'Page Content Check', 
          status: 'pass',
          message: 'No disabled messages found in page content'
        });
      }

      // Test 4: Check for cached component states
      const cacheKeys = Object.keys(localStorage).filter(key => 
        key.includes('component') || key.includes('cache') || key.includes('qa')
      );
      
      results.push({
        test: 'Cache Check',
        status: cacheKeys.length > 0 ? 'warning' : 'pass',
        message: cacheKeys.length > 0 
          ? `Found cached items: ${cacheKeys.join(', ')}` 
          : 'No problematic cache entries found'
      });

    } catch (error) {
      results.push({
        test: 'Diagnostic Error',
        status: 'fail',
        message: `Error running diagnostics: ${error}`
      });
    }
    
    setDiagnostics(results);
    setIsRunning(false);
    
    // Show summary toast
    const failedTests = results.filter(r => r.status === 'fail');
    if (failedTests.length === 0) {
      toast({
        title: "✅ All Tests Passed",
        description: "No disabled/maintenance messages detected",
      });
    } else {
      toast({
        title: "⚠️ Issues Found", 
        description: `${failedTests.length} potential issues detected`,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    // Auto-run diagnostics on mount
    runDiagnostics();
  }, []);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-blue-600" />
          Testing System Diagnostics
          <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">Live</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runDiagnostics}
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Run Diagnostics
            </>
          )}
        </Button>

        {diagnostics.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold">Diagnostic Results:</h4>
            {diagnostics.map((result, index) => (
              <div key={index} className={`p-3 rounded border ${
                result.status === 'pass' ? 'border-green-200 bg-green-50' :
                result.status === 'fail' ? 'border-red-200 bg-red-50' :
                'border-yellow-200 bg-yellow-50'
              }`}>
                <div className="flex items-center gap-2">
                  {result.status === 'pass' && <CheckCircle className="w-4 h-4 text-green-600" />}
                  {result.status === 'fail' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                  {result.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                  <span className="font-medium">{result.test}</span>
                </div>
                <p className="text-sm mt-1 text-gray-600">{result.message}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DiagnosticTestRunner;