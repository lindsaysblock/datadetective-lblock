
import { useState, useEffect } from 'react';
import { AutoRefactorSystem, RefactoringSuggestion } from '../utils/qa/autoRefactorSystem';

interface RefactoringMessage {
  message: string;
  autoExecute: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  file: string;
}

export const useAutoRefactor = () => {
  const [autoRefactorEnabled, setAutoRefactorEnabled] = useState(true);
  const [refactoringSuggestions, setRefactoringSuggestions] = useState<RefactoringSuggestion[]>([]);
  const autoRefactorSystem = new AutoRefactorSystem();

  const generateRefactoringMessages = (suggestions: RefactoringSuggestion[]): RefactoringMessage[] => {
    return suggestions.map(suggestion => {
      const message = createRefactoringMessage(suggestion);
      
      return {
        message,
        autoExecute: suggestion.autoRefactor,
        priority: suggestion.priority,
        file: suggestion.file
      };
    });
  };

  const createRefactoringMessage = (suggestion: RefactoringSuggestion): string => {
    const actions = suggestion.suggestedActions.slice(0, 2).join('. ');
    const urgencyText = suggestion.urgencyScore > 80 ? 'URGENT: ' : 
                      suggestion.urgencyScore > 60 ? 'HIGH PRIORITY: ' : '';
    
    return `${urgencyText}Refactor ${suggestion.file}: ${suggestion.reason}. ${actions}. Current complexity: ${suggestion.complexity}, maintainability: ${suggestion.maintainabilityIndex.toFixed(1)}`;
  };

  const analyzeCodebase = async (): Promise<RefactoringSuggestion[]> => {
    try {
      const suggestions = await autoRefactorSystem.analyzeCodebase();
      setRefactoringSuggestions(suggestions);
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
    // Listen for auto-refactoring triggers
    const handleAutoRefactorTrigger = async () => {
      if (!autoRefactorEnabled) return;
      
      try {
        const suggestions = await analyzeCodebase();
        const autoTriggerSuggestions = await shouldAutoTriggerRefactoring(suggestions);
        
        if (autoTriggerSuggestions.length > 0) {
          const event = new CustomEvent('qa-auto-refactor-suggestions', {
            detail: { suggestions: autoTriggerSuggestions }
          });
          window.dispatchEvent(event);
        }
      } catch (error) {
        console.error('Auto-refactoring trigger failed:', error);
      }
    };

    // Trigger analysis periodically when enabled
    const analysisInterval = autoRefactorEnabled ? 
      setInterval(handleAutoRefactorTrigger, 300000) : // Every 5 minutes
      null;

    return () => {
      if (analysisInterval) {
        clearInterval(analysisInterval);
      }
    };
  }, [autoRefactorEnabled]);

  return {
    autoRefactorEnabled,
    setAutoRefactorEnabled,
    refactoringSuggestions,
    generateRefactoringMessages,
    analyzeCodebase,
    shouldAutoTriggerRefactoring
  };
};
