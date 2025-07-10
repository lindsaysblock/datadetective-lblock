
import { useEffect, useRef, useState } from 'react';
import { AutoQASystem, type QAReport } from '../utils/qaSystem';
import { useToast } from '@/hooks/use-toast';

export const useAutoQA = () => {
  const [lastReport, setLastReport] = useState<QAReport | null>(null);
  const [isAutoEnabled, setIsAutoEnabled] = useState(true);
  const qaSystemRef = useRef(new AutoQASystem());
  const { toast } = useToast();

  useEffect(() => {
    if (!isAutoEnabled) return;

    let featureObserver: MutationObserver;
    
    // Watch for DOM changes that might indicate new features
    const startWatching = () => {
      featureObserver = new MutationObserver(async (mutations) => {
        const hasNewComponents = mutations.some(mutation => {
          if (mutation.type === 'childList') {
            const addedNodes = Array.from(mutation.addedNodes);
            return addedNodes.some(node => 
              node.nodeType === Node.ELEMENT_NODE && 
              (node as Element).querySelector('[data-testid], [data-feature], .lovable-component')
            );
          }
          return false;
        });

        if (hasNewComponents) {
          console.log('🔍 Detected new components, running auto-QA...');
          
          // Debounce the QA run
          setTimeout(async () => {
            try {
              const report = await qaSystemRef.current.runFullQA();
              setLastReport(report);
              
              // Only show toast for failures or first run
              if (report.overall === 'fail' || !lastReport) {
                toast({
                  title: 'Auto-QA Complete',
                  description: `${report.passed}/${report.totalTests} tests passed`,
                  variant: report.overall === 'fail' ? 'destructive' : 'default'
                });
              }
              
              // Log performance warnings
              if (report.performanceMetrics.renderTime > 200) {
                console.warn('⚠️ Performance warning: Slow render time detected');
              }
              
              if (report.refactoringRecommendations.length > 0) {
                console.info('📝 Refactoring recommendations available');
              }
              
            } catch (error) {
              console.error('Auto-QA failed:', error);
            }
          }, 2000); // 2 second debounce
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
  }, [isAutoEnabled, lastReport, toast]);

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
        ? 'QA will now run automatically when new features are detected'
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
