import { useState } from 'react';
import { TestResultCard } from '../../../types/testing';
import { TestFixService } from '../../../utils/testing/testFixService';
import { useToast } from '@/hooks/use-toast';

export const useAutoFixAll = () => {
  const [isFixing, setIsFixing] = useState(false);
  const { toast } = useToast();

  const autoFixAll = async (testResults: TestResultCard[]): Promise<void> => {
    const failedResults = testResults.filter(r => r.status === 'error' && r.fixes?.length);
    
    if (failedResults.length === 0) {
      toast({
        title: "No Fixes Available",
        description: "All tests are passing or no auto-fixes are available",
      });
      return;
    }

    setIsFixing(true);
    
    toast({
      title: "🔧 Auto-Fixing All Issues",
      description: `Applying fixes for ${failedResults.length} test suites`,
    });

    try {
      const fixService = TestFixService.getInstance();
      let totalFixed = 0;

      for (const result of failedResults) {
        if (result.fixes?.length) {
          for (const fix of result.fixes) {
            await fixService.applyFix(fix.id, result.name);
            totalFixed++;
          }
        }
      }

      toast({
        title: "✅ Auto-Fix Complete",
        description: `Applied ${totalFixed} fixes across ${failedResults.length} test suites`,
      });
    } catch (error) {
      toast({
        title: "❌ Auto-Fix Failed",
        description: "Some fixes could not be applied",
        variant: "destructive",
      });
    } finally {
      setIsFixing(false);
    }
  };

  return { autoFixAll, isFixing };
};