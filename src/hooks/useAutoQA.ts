
import { useEffect, useRef, useState } from 'react';
import { AutoQASystem, type QAReport } from '../utils/qaSystem';
import { useToast } from '@/hooks/use-toast';

export const useAutoQA = () => {
  const [lastReport, setLastReport] = useState<QAReport | null>(null);
  const [isAutoEnabled, setIsAutoEnabled] = useState(false); // Disabled by default
  const qaSystemRef = useRef(new AutoQASystem());
  const { toast } = useToast();
  const lastRunRef = useRef<number>(0);

  useEffect(() => {
    if (!isAutoEnabled) return;

    let featureObserver: MutationObserver;
    
    const startWatching = () => {
      featureObserver = new MutationObserver(async (mutations) => {
        // Throttle QA runs to prevent excessive triggering
        const now = Date.now();
        if (now - lastRunRef.current < 10000) { // 10 second minimum between runs
          return;
        }

        const hasSignificantChanges = mutations.some(mutation => {
          if (mutation.type === 'childList') {
            const addedNodes = Array.from(mutation.addedNodes);
            return addedNodes.some(node => 
              node.nodeType === Node.ELEMENT_NODE && 
              (node as Element).querySelector('[data-testid], [data-feature]') &&
              !(node as Element).closest('.qa-runner, .toast, [data-sonner-toaster]')
            );
          }
          return false;
        });

        if (hasSignificantChanges) {
          console.log('🔍 Detected significant changes, running auto-QA...');
          lastRunRef.current = now;
          
          setTimeout(async () => {
            try {
              await runQAWithAutoFix();
            } catch (error) {
              console.error('Auto-QA failed:', error);
            }
          }, 3000);
        }
      });

      featureObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false
      });
    };

    startWatching();

    return () => {
      if (featureObserver) {
        featureObserver.disconnect();
      }
    };
  }, [isAutoEnabled, toast]);

  const runQAWithAutoFix = async (): Promise<QAReport> => {
    const maxAttempts = 5;
    let attempt = 0;
    let report: QAReport;

    do {
      attempt++;
      console.log(`🔍 QA Attempt ${attempt}/${maxAttempts}`);
      
      report = await qaSystemRef.current.runFullQA();
      setLastReport(report);
      
      if (report.failed > 0 && attempt < maxAttempts) {
        console.log(`🔧 Auto-fixing ${report.failed} failed tests (attempt ${attempt}/${maxAttempts})...`);
        await qaSystemRef.current.autoFix(report);
        
        // Wait before next attempt to allow fixes to take effect
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } while (report.failed > 0 && attempt < maxAttempts);

    // Only show error if we couldn't fix after max attempts
    if (report.failed > 0) {
      console.warn(`⚠️ ${report.failed} tests still failing after ${maxAttempts} attempts`);
      // Only show toast for data-related issues that can't be auto-fixed
      const dataRelatedFailures = report.results.filter(r => 
        r.status === 'fail' && 
        (r.testName.includes('Data') || r.testName.includes('Parsing') || r.testName.includes('Upload'))
      );
      
      if (dataRelatedFailures.length > 0) {
        toast({
          title: 'Data Processing Issues',
          description: 'Please check your uploaded data format and try again',
          variant: 'destructive',
          duration: 6000,
        });
      }
    } else {
      console.log('✅ All QA tests now passing!');
    }

    return report;
  };

  const runManualQA = async (): Promise<QAReport> => {
    console.log('🔍 Running manual QA analysis...');
    return await runQAWithAutoFix();
  };

  const toggleAutoQA = () => {
    setIsAutoEnabled(!isAutoEnabled);
    toast({
      title: `Auto-QA ${!isAutoEnabled ? 'Enabled' : 'Disabled'}`,
      description: !isAutoEnabled 
        ? 'QA will now run automatically and attempt to fix issues'
        : 'Auto-QA has been disabled',
      duration: 4000,
    });
  };

  return {
    lastReport,
    isAutoEnabled,
    runManualQA,
    toggleAutoQA
  };
};
