/**
 * Code Quality Monitor - Real-time enforcement of coding standards
 * Integrates with auto-refactoring system and ESLint rules
 */

import React, { useEffect } from 'react';
import { useAutoRefactor } from '@/hooks/useAutoRefactor';
import { toast } from 'sonner';

interface CodeQualityMonitorProps {
  enabled?: boolean;
  silentMode?: boolean;
}

export const CodeQualityMonitor: React.FC<CodeQualityMonitorProps> = ({
  enabled = true,
  silentMode = false
}) => {
  const {
    autoRefactorEnabled,
    setAutoRefactorEnabled,
    silentRefactoringEnabled,
    setSilentRefactoringEnabled,
    analyzeCodebase,
    shouldAutoTriggerRefactoring
  } = useAutoRefactor();

  useEffect(() => {
    if (!enabled) return;

    // Enable auto-refactoring on mount
    setAutoRefactorEnabled(true);
    setSilentRefactoringEnabled(silentMode);

    // Run initial analysis
    const runInitialAnalysis = async () => {
      try {
        const suggestions = await analyzeCodebase();
        const autoTriggerSuggestions = await shouldAutoTriggerRefactoring(suggestions);
        
        if (autoTriggerSuggestions.length > 0 && !silentMode) {
          toast.info(`Code quality monitor: ${autoTriggerSuggestions.length} files need refactoring`, {
            description: 'Auto-refactoring will be applied automatically'
          });
        }
      } catch (error) {
        console.error('Code quality analysis failed:', error);
      }
    };

    runInitialAnalysis();

    return () => {
      setAutoRefactorEnabled(false);
      setSilentRefactoringEnabled(false);
    };
  }, [enabled, silentMode, setAutoRefactorEnabled, setSilentRefactoringEnabled, analyzeCodebase, shouldAutoTriggerRefactoring]);

  // This component doesn't render anything - it's a service component
  return null;
};

export default CodeQualityMonitor;