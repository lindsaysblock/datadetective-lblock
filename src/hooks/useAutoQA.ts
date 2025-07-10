
import { useEffect, useRef, useState } from 'react';
import { AutoQASystem, type QAReport } from '../utils/qaSystem';
import { useToast } from '@/hooks/use-toast';

export const useAutoQA = () => {
  const [lastReport, setLastReport] = useState<QAReport | null>(null);
  const [isAutoEnabled, setIsAutoEnabled] = useState(false); // Changed to false by default
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
              
              // Only show toast for failures
              if (report.overall === 'fail') {
                toast({
                  title: 'Auto-QA Alert',
                  description: `${report.failed} test(s) failed`,
                  variant: 'destructive'
                });
              }
              
            } catch (error) {
              console.error('Auto-QA failed:', error);
            }
          }, 3000); // 3 second debounce
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
    const report = await qaSystemRef.current.runFullQA();
    setLastReport(report);
    return report;
  };

  const toggleAutoQA = () => {
    setIsAutoEnabled(!isAutoEnabled);
    toast({
      title: `Auto-QA ${!isAutoEnabled ? 'Enabled' : 'Disabled'}`,
      description: !isAutoEnabled 
        ? 'QA will now run automatically when significant changes are detected'
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
