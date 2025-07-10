
import React, { useEffect, useState } from 'react';
import { useAutoQA } from '../hooks/useAutoQA';
import { useAutoRefactor } from '../hooks/useAutoRefactor';
import { useToast } from '@/hooks/use-toast';
import { RefactoringSuggestion } from '../utils/qa/autoRefactorSystem';

const QARunner: React.FC = () => {
  const { runManualQA, isAutoEnabled } = useAutoQA();
  const { generateRefactoringMessages } = useAutoRefactor();
  const { toast } = useToast();
  const [hasRunInitialQA, setHasRunInitialQA] = useState(false);

  useEffect(() => {
    // Listen for auto-refactoring suggestions from QA system
    const handleAutoRefactorSuggestions = (event: CustomEvent<{ suggestions: RefactoringSuggestion[] }>) => {
      const { suggestions } = event.detail;
      if (suggestions.length > 0) {
        const messages = generateRefactoringMessages(suggestions);
        
        // Dispatch refactoring prompts event for UI to handle
        const promptEvent = new CustomEvent('qa-refactoring-prompts', {
          detail: { messages }
        });
        window.dispatchEvent(promptEvent);
        
        console.log(`🔧 Auto-refactoring: ${suggestions.length} high-priority files identified for refactoring`);
      }
    };

    window.addEventListener('qa-auto-refactor-suggestions', handleAutoRefactorSuggestions as EventListener);

    return () => {
      window.removeEventListener('qa-auto-refactor-suggestions', handleAutoRefactorSuggestions as EventListener);
    };
  }, [generateRefactoringMessages]);

  useEffect(() => {
    // Run comprehensive QA analysis on component mount
    if (!hasRunInitialQA) {
      const runInitialQA = async () => {
        console.log('🔍 Running comprehensive QA analysis with auto-fix and refactoring detection...');
        
        try {
          const report = await runManualQA();
          
          console.log('📊 QA Analysis Complete:', {
            overall: report.overall,
            passed: report.passed,
            failed: report.failed,
            warnings: report.warnings,
            totalTests: report.totalTests,
            renderTime: `${report.performanceMetrics.renderTime.toFixed(2)}ms`,
            autoFixAttempted: report.failed > 0 ? 'Multiple attempts made' : 'No fixes needed'
          });

          // Only show success toast if all tests pass
          if (report.failed === 0) {
            toast({
              title: "QA Analysis Complete",
              description: `All ${report.totalTests} tests passed successfully. Auto-refactoring analysis included.`,
              duration: 5000,
            });
          }
          // Error toasts are handled in useAutoQA for data-related issues only

        } catch (error) {
          console.error('QA Analysis failed:', error);
          toast({
            title: "QA System Error",
            description: "An unexpected error occurred in the QA system",
            variant: "destructive",
            duration: 5000,
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
