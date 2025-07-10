
import React, { useEffect, useState } from 'react';
import { useAutoQA } from '../hooks/useAutoQA';
import { useToast } from '@/hooks/use-toast';

const QARunner: React.FC = () => {
  const { runManualQA, isAutoEnabled } = useAutoQA();
  const { toast } = useToast();
  const [hasRunInitialQA, setHasRunInitialQA] = useState(false);

  useEffect(() => {
    // Only run QA once on initial load and only if auto QA is enabled
    if (!hasRunInitialQA && isAutoEnabled) {
      const runInitialQA = async () => {
        console.log('🔍 Running initial QA analysis...');
        
        try {
          const report = await runManualQA();
          
          console.log('📊 Initial QA Analysis Complete:', {
            overall: report.overall,
            passed: report.passed,
            failed: report.failed,
            warnings: report.warnings,
            totalTests: report.totalTests,
            renderTime: `${report.performanceMetrics.renderTime.toFixed(2)}ms`
          });

          // Only show toast for significant issues
          if (report.overall === 'fail' || report.failed > 0) {
            toast({
              title: "QA Analysis Complete",
              description: `${report.passed}/${report.totalTests} tests passed. Check console for details.`,
              variant: report.overall === 'fail' ? 'destructive' : 'default'
            });
          }

        } catch (error) {
          console.error('Initial QA Analysis failed:', error);
        } finally {
          setHasRunInitialQA(true);
        }
      };

      // Delay initial run to prevent interference with page load
      const timer = setTimeout(runInitialQA, 2000);
      return () => clearTimeout(timer);
    }
  }, [runManualQA, toast, hasRunInitialQA, isAutoEnabled]);

  return null;
};

export default QARunner;
