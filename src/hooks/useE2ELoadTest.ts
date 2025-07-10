
import { useState } from 'react';
import { E2ELoadTest } from '../utils/testing/e2eLoadTest';
import { useToast } from '@/hooks/use-toast';

export const useE2ELoadTest = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const { toast } = useToast();
  const e2eLoadTest = new E2ELoadTest();

  const runFullLoadTest = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setTestResults([]);
    
    try {
      toast({
        title: "Load Test Started",
        description: "Running comprehensive end-to-end load management test...",
      });
      
      await e2eLoadTest.runComprehensiveLoadTest();
      
      toast({
        title: "Load Test Complete",
        description: "All load tests completed successfully. Check console for detailed results.",
      });
      
    } catch (error) {
      console.error('E2E Load test failed:', error);
      toast({
        title: "Load Test Failed",
        description: "An error occurred during load testing. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const runQuickLoadCheck = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    
    try {
      toast({
        title: "Quick Load Check",
        description: "Running quick system load check...",
      });
      
      await e2eLoadTest.runQuickLoadCheck();
      
      toast({
        title: "Load Check Complete",
        description: "Quick load check finished. See console for results.",
      });
      
    } catch (error) {
      console.error('Quick load check failed:', error);
      toast({
        title: "Load Check Failed",
        description: "Quick load check encountered an error.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  return {
    isRunning,
    testResults,
    runFullLoadTest,
    runQuickLoadCheck
  };
};
