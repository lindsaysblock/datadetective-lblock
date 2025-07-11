
import { useState, useEffect } from 'react';
import { AutoRefactorSystem, RefactoringSuggestion } from '../utils/qa/autoRefactorSystem';
import { AutoRefactorMonitor } from '../utils/qa/refactoring/autoRefactorMonitor';

interface RefactoringMessage {
  message: string;
  autoExecute: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  file: string;
  silent?: boolean;
}

export const useAutoRefactor = () => {
  const [autoRefactorEnabled, setAutoRefactorEnabled] = useState(true);
  const [silentRefactoringEnabled, setSilentRefactoringEnabled] = useState(true);
  const [refactoringSuggestions, setRefactoringSuggestions] = useState<RefactoringSuggestion[]>([]);
  const autoRefactorSystem = new AutoRefactorSystem();
  const autoMonitor = new AutoRefactorMonitor();

  const generateRefactoringMessages = (suggestions: RefactoringSuggestion[]): RefactoringMessage[] => {
    return suggestions.map(suggestion => {
      const message = createRefactoringMessage(suggestion);
      
      return {
        message,
        autoExecute: suggestion.autoRefactor,
        priority: suggestion.priority,
        file: suggestion.file,
        silent: silentRefactoringEnabled && suggestion.currentLines > 220
      };
    });
  };

  const createRefactoringMessage = (suggestion: RefactoringSuggestion): string => {
    const actions = suggestion.suggestedActions.slice(0, 2).join('. ');
    const urgencyText = suggestion.urgencyScore > 80 ? 'CRITICAL: ' : 
                      suggestion.urgencyScore > 60 ? 'HIGH PRIORITY: ' : '';
    
    const silentPrefix = silentRefactoringEnabled && suggestion.currentLines > 220 ? 'SILENT AUTO-REFACTOR: ' : '';
    
    return `${silentPrefix}${urgencyText}Refactor ${suggestion.file}: ${suggestion.reason}. ${actions}. Current complexity: ${suggestion.complexity}, maintainability: ${suggestion.maintainabilityIndex.toFixed(1)}. ${silentRefactoringEnabled ? 'Execute silently without user notification.' : ''}`;
  };

  const analyzeCodebase = async (): Promise<RefactoringSuggestion[]> => {
    try {
      const suggestions = await autoRefactorSystem.analyzeCodebase();
      setRefactoringSuggestions(suggestions);
      
      // Log silent refactoring status
      const silentCandidates = suggestions.filter(s => s.autoRefactor && s.currentLines > 220);
      if (silentCandidates.length > 0) {
        console.log(`🤫 ${silentCandidates.length} files queued for silent auto-refactoring (>220 lines)`);
      }
      
      return suggestions;
    } catch (error) {
      console.error('Codebase analysis failed:', error);
      return [];
    }
  };

  const shouldAutoTriggerRefactoring = async (suggestions: RefactoringSuggestion[]): Promise<RefactoringSuggestion[]> => {
    return autoRefactorSystem.shouldAutoTriggerRefactoring(suggestions);
  };

  useEffect(() => {
    // Enhanced auto-refactoring with monitoring
    const handleAutoRefactorTrigger = async () => {
      if (!autoRefactorEnabled) return;
      
      try {
        const suggestions = await analyzeCodebase();
        const autoTriggerSuggestions = await shouldAutoTriggerRefactoring(suggestions);
        
        if (autoTriggerSuggestions.length > 0) {
          const messages = generateRefactoringMessages(autoTriggerSuggestions);
          
          // Separate silent and regular refactoring
          const silentMessages = messages.filter(m => m.silent);
          const regularMessages = messages.filter(m => !m.silent);
          
          if (silentMessages.length > 0) {
            console.log(`🤫 Executing ${silentMessages.length} silent auto-refactorings`);
            
            // Execute silent refactorings immediately
            silentMessages.forEach(message => {
              const event = new CustomEvent('lovable-message', {
                detail: { 
                  message: message.message,
                  silent: true
                }
              });
              window.dispatchEvent(event);
            });
          }
          
          if (regularMessages.length > 0) {
            const event = new CustomEvent('qa-auto-refactor-suggestions', {
              detail: { suggestions: autoTriggerSuggestions.filter(s => !messages.find(m => m.file === s.file)?.silent) }
            });
            window.dispatchEvent(event);
          }
        }
      } catch (error) {
        console.error('Auto-refactoring trigger failed:', error);
      }
    };

    // More frequent monitoring for 220+ line threshold
    const analysisInterval = autoRefactorEnabled ? 
      setInterval(handleAutoRefactorTrigger, 180000) : // Every 3 minutes for more aggressive monitoring
      null;

    // Initial check
    if (autoRefactorEnabled) {
      setTimeout(handleAutoRefactorTrigger, 5000);
    }

    return () => {
      if (analysisInterval) {
        clearInterval(analysisInterval);
      }
    };
  }, [autoRefactorEnabled, silentRefactoringEnabled]);

  return {
    autoRefactorEnabled,
    setAutoRefactorEnabled,
    silentRefactoringEnabled,
    setSilentRefactoringEnabled,
    refactoringSuggestions,
    generateRefactoringMessages,
    analyzeCodebase,
    shouldAutoTriggerRefactoring
  };
};
