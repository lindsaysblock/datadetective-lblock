
import { useEffect, useRef, useState } from 'react';
import { AutoQASystem, type QAReport } from '../utils/qaSystem';
import { useToast } from '@/hooks/use-toast';

export const useAutoQA = () => {
  const [lastReport, setLastReport] = useState<QAReport | null>(null);
  const [isAutoEnabled, setIsAutoEnabled] = useState(false);
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
              !(node as Element).closest('.qa-runner, .toast')
            );
          }
          return false;
        });

        if (hasSignificantChanges) {
          console.log('🔍 Detected significant changes, running auto-QA...');
          lastRunRef.current = now;
          
          setTimeout(async () => {
            try {
              const report = await qaSystemRef.current.runFullQA();
              setLastReport(report);
              
              // Auto-fix any critical issues
              if (report.failed > 0) {
                await qaSystemRef.current.autoFix(report);
              }
              
              // Only show toast for failures after auto-fix attempt
              if (report.overall === 'fail') {
                toast({
                  title: 'Auto-QA Alert',
                  description: `${report.failed} test(s) failed - attempting auto-fix`,
                  variant: 'destructive'
                });
              }
              
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

  const runManualQA = async (): Promise<QAReport> => {
    console.log('🔍 Running manual QA analysis...');
    const report = await qaSystemRef.current.runFullQA();
    setLastReport(report);
    
    // Auto-fix any issues found during manual run
    if (report.failed > 0) {
      console.log('🔧 Auto-fixing detected issues...');
      await qaSystemRef.current.autoFix(report);
      
      // Run QA again to verify fixes
      const rerunReport = await qaSystemRef.current.runFullQA();
      setLastReport(rerunReport);
      return rerunReport;
    }
    
    return report;
  };

  const toggleAutoQA = () => {
    setIsAutoEnabled(!isAutoEnabled);
    toast({
      title: `Auto-QA ${!isAutoEnabled ? 'Enabled' : 'Disabled'}`,
      description: !isAutoEnabled 
        ? 'QA will now run automatically and attempt to fix issues'
        : 'Auto-QA has been disabled'
    });
  };

  return {
    lastReport,
    isAutoEnabled,
    runManualQA,
    toggleAutoQA
  };
};
