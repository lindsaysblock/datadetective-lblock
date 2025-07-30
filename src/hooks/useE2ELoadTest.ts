import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { E2ELoadTest } from '@/utils/testing/e2eLoadTest';

export const useE2ELoadTest = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  
  const runFullLoadTest = useCallback(async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    try {
      toast({
        title: "🚀 Starting Full Load Test",
        description: "Comprehensive load testing in progress...",
      });

      const loadTest = new E2ELoadTest();
      await loadTest.runComprehensiveLoadTest();
      
      toast({
        title: "✅ Load Test Completed",
        description: "Full load testing completed successfully. Check console for details.",
      });
      
      setTestResults(prev => [...prev, {
        type: 'full',
        timestamp: new Date(),
        status: 'completed'
      }]);
    } catch (error) {
      console.error('Load test error:', error);
      toast({
        title: "❌ Load Test Failed",
        description: "Load testing encountered an error",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, toast]);

  const runQuickLoadCheck = useCallback(async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    try {
      toast({
        title: "⚡ Starting Quick Load Check",
        description: "Quick load testing in progress...",
      });

      const loadTest = new E2ELoadTest();
      await loadTest.runQuickLoadCheck();
      
      toast({
        title: "✅ Quick Load Check Completed",
        description: "Quick load testing completed successfully. Check console for details.",
      });
      
      setTestResults(prev => [...prev, {
        type: 'quick',
        timestamp: new Date(),
        status: 'completed'
      }]);
    } catch (error) {
      console.error('Load test error:', error);
      toast({
        title: "❌ Load Test Failed",
        description: "Load testing encountered an error",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, toast]);

  return {
    isRunning,
    runFullLoadTest,
    runQuickLoadCheck,
    testResults
  };
};