import { useToast } from '@/hooks/use-toast';

// Safe mock hook to replace useE2ELoadTest
export const useE2ELoadTest = () => {
  const { toast } = useToast();
  
  const runFullLoadTest = async () => {
    toast({
      title: "⚠️ Load Testing Disabled",
      description: "Load testing temporarily disabled during maintenance",
      variant: "destructive",
    });
  };

  const runQuickLoadCheck = async () => {
    toast({
      title: "⚠️ Load Testing Disabled", 
      description: "Load testing temporarily disabled during maintenance",
      variant: "destructive",
    });
  };

  return {
    isRunning: false,
    runFullLoadTest,
    runQuickLoadCheck,
    testResults: []
  };
};