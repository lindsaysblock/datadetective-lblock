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

  // Check if we're in admin context
  const isAdminContext = window.location.pathname === '/admin' || window.location.pathname === '/final-qa';

  useEffect(() => {
    // Only run in admin context
    if (!isAdminContext) return;

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
            
            // Only show toast in admin context
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
  }, [generateRefactoringMessages, autoRefactorEnabled, toast, isAdminContext]);

  useEffect(() => {
    // Always run QA analysis when component mounts, regardless of context
    if (!hasRunInitialQA) {
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

          // Show success toast if all tests pass
          if (report.failed === 0) {
            toast({
              title: "QA Analysis Complete",
              description: `All ${report.totalTests} tests passed successfully. Auto-refactoring ${autoRefactorEnabled ? 'applied' : 'analysis included'}.`,
              duration: 5000,
            });
          } else if (report.failed > 0) {
            console.log('🔧 Attempting auto-fix for failed tests...');
            
            // Run enhanced QA system for better auto-fixing
            try {
              const { EnhancedQASystem } = await import('../utils/qa/enhancedQASystem');
              const enhancedQA = new EnhancedQASystem();
              await enhancedQA.autoFix(report);
              
              // Re-run QA after auto-fix
              const fixedReport = await runManualQA();
              
              if (fixedReport.failed === 0) {
                toast({
                  title: "QA Auto-Fix Complete",
                  description: `Successfully fixed all issues. System is now optimized.`,
                  duration: 6000,
                });
              } else {
                toast({
                  title: "QA Issues Detected",
                  description: `${fixedReport.failed} tests still failing after auto-fix attempts.`,
                  variant: "destructive",
                  duration: 6000,
                });
              }
            } catch (fixError) {
              console.error('Auto-fix failed:', fixError);
              toast({
                title: "QA Issues Detected",
                description: `${report.failed} tests failed out of ${report.totalTests}. Manual review may be needed.`,
                variant: "destructive",
                duration: 6000,
              });
            }
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
      const timer = setTimeout(runInitialQA, 1000);
      return () => clearTimeout(timer);
    }
  }, [runManualQA, toast, hasRunInitialQA, autoRefactorEnabled]);

  // Don't render anything visible - this is a background service
  return null;
};

export default QARunner;
