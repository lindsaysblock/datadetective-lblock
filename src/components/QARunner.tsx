
import React, { useEffect, useState } from 'react';
import { useAutoQA } from '../hooks/useAutoQA';
import { useAutoRefactor } from '../hooks/useAutoRefactor';
import { useToast } from '@/hooks/use-toast';
import { RefactoringSuggestion } from '../utils/qa/autoRefactorSystem';

const QARunner: React.FC = () => {
  const { runManualQA, isAutoEnabled } = useAutoQA();
  const { generateRefactoringMessages, autoRefactorEnabled } = useAutoRefactor();
  const { toast } = useToast();
  const [hasRunInitialQA, setHasRunInitialQA] = useState(false);

  useEffect(() => {
    // Listen for auto-refactoring suggestions from QA system
    const handleAutoRefactorSuggestions = (event: CustomEvent<{ suggestions: RefactoringSuggestion[] }>) => {
      const { suggestions } = event.detail;
      if (suggestions.length > 0) {
        const messages = generateRefactoringMessages(suggestions);
        
        if (autoRefactorEnabled) {
          // Auto-execute refactoring for suggestions marked as autoRefactor
          const autoExecuteMessages = messages.filter(m => m.autoExecute);
          
          if (autoExecuteMessages.length > 0) {
            console.log(`🔧 Auto-executing refactoring for ${autoExecuteMessages.length} files...`);
            
            // Automatically trigger refactoring without user prompt
            autoExecuteMessages.forEach(message => {
              const messageEvent = new CustomEvent('lovable-message', {
                detail: { message: message.message }
              });
              window.dispatchEvent(messageEvent);
            });
            
            toast({
              title: "Auto-Refactoring Applied",
              description: `Automatically refactored ${autoExecuteMessages.length} files to improve code quality`,
              duration: 4000,
            });
          }
        }
        
        // Still dispatch manual refactoring prompts for non-auto suggestions
        const manualMessages = messages.filter(m => !m.autoExecute);
        if (manualMessages.length > 0) {
          const promptEvent = new CustomEvent('qa-refactoring-prompts', {
            detail: { messages: manualMessages }
          });
          window.dispatchEvent(promptEvent);
        }
        
        console.log(`🔧 Auto-refactoring: ${suggestions.length} files processed (${messages.filter(m => m.autoExecute).length} auto-executed, ${messages.filter(m => !m.autoExecute).length} manual prompts)`);
      }
    };

    window.addEventListener('qa-auto-refactor-suggestions', handleAutoRefactorSuggestions as EventListener);

    return () => {
      window.removeEventListener('qa-auto-refactor-suggestions', handleAutoRefactorSuggestions as EventListener);
    };
  }, [generateRefactoringMessages, autoRefactorEnabled, toast]);

  useEffect(() => {
    // Only run QA in admin context, not for regular users
    const isAdminPath = window.location.pathname === '/admin';
    
    if (!hasRunInitialQA && isAdminPath) {
      const runInitialQA = async () => {
        console.log('🔍 Running comprehensive QA analysis with auto-fix and auto-refactoring...');
        
        try {
          const report = await runManualQA();
          
          console.log('📊 QA Analysis Complete:', {
            overall: report.overall,
            passed: report.passed,
            failed: report.failed,
            warnings: report.warnings,
            totalTests: report.totalTests,
            renderTime: `${report.performanceMetrics.renderTime.toFixed(2)}ms`,
            autoFixAttempted: report.failed > 0 ? 'Multiple attempts made' : 'No fixes needed',
            autoRefactorEnabled: autoRefactorEnabled ? 'Enabled' : 'Disabled'
          });

          // Only show success toast if all tests pass
          if (report.failed === 0) {
            toast({
              title: "QA Analysis Complete",
              description: `All ${report.totalTests} tests passed successfully. Auto-refactoring ${autoRefactorEnabled ? 'applied' : 'analysis included'}.`,
              duration: 5000,
            });
          }

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
  }, [runManualQA, toast, hasRunInitialQA, autoRefactorEnabled]);

  // Don't render anything - this is now just a background service
  return null;
};

export default QARunner;
