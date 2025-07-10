
import React, { useEffect, useState } from 'react';
import { useAutoQA } from '../hooks/useAutoQA';
import { useToast } from '@/hooks/use-toast';

const QARunner: React.FC = () => {
  const { runManualQA, isAutoEnabled } = useAutoQA();
  const { toast } = useToast();
  const [hasRunInitialQA, setHasRunInitialQA] = useState(false);

  useEffect(() => {
    // Run comprehensive QA analysis on component mount
    if (!hasRunInitialQA) {
      const runInitialQA = async () => {
        console.log('🔍 Running comprehensive QA analysis with auto-fix...');
        
        try {
          const report = await runManualQA();
          
          console.log('📊 QA Analysis Complete:', {
            overall: report.overall,
            passed: report.passed,
            failed: report.failed,
            warnings: report.warnings,
            totalTests: report.totalTests,
            renderTime: `${report.performanceMetrics.renderTime.toFixed(2)}ms`,
            autoFixAttempted: report.failed > 0 ? 'Yes' : 'No'
          });

          // Show comprehensive results
          toast({
            title: "QA Analysis Complete",
            description: `${report.passed}/${report.totalTests} tests passed${report.failed > 0 ? ' (auto-fix attempted)' : ''}`,
            variant: report.overall === 'fail' ? 'destructive' : 'default'
          });

        } catch (error) {
          console.error('QA Analysis failed:', error);
          toast({
            title: "QA Analysis Failed",
            description: "An error occurred during testing",
            variant: "destructive"
          });
        } finally {
          setHasRunInitialQA(true);
        }
      };

      // Delay initial run to allow page to fully load
      const timer = setTimeout(runInitialQA, 2000);
      return () => clearTimeout(timer);
    }
  }, [runManualQA, toast, hasRunInitialQA]);

  return null;
};

export default QARunner;
