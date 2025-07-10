
import { useState, useEffect } from 'react';
import { AutoRefactorSystem, RefactoringSuggestion } from '../utils/qa/autoRefactorSystem';

export const useAutoRefactor = () => {
  const [suggestions, setSuggestions] = useState<RefactoringSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoRefactorEnabled, setAutoRefactorEnabled] = useState(true); // Enabled by default
  const autoRefactorSystem = new AutoRefactorSystem();

  const analyzeForRefactoring = async (): Promise<RefactoringSuggestion[]> => {
    setIsAnalyzing(true);
    try {
      const allSuggestions = await autoRefactorSystem.analyzeCodebase();
      setSuggestions(allSuggestions);
      
      // Auto-execute refactoring if enabled
      if (autoRefactorEnabled) {
        await autoRefactorSystem.executeAutoRefactoring(allSuggestions);
      }
      
      return allSuggestions;
    } catch (error) {
      console.error('Auto-refactor analysis failed:', error);
      return [];
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAutoTriggerSuggestions = async (): Promise<RefactoringSuggestion[]> => {
    const allSuggestions = await analyzeForRefactoring();
    return await autoRefactorSystem.shouldAutoTriggerRefactoring(allSuggestions);
  };

  const generateRefactoringMessages = (suggestions: RefactoringSuggestion[]): Array<{
    message: string;
    label: string;
    autoExecute: boolean;
  }> => {
    return suggestions.map(suggestion => ({
      message: autoRefactorSystem.generateRefactoringMessage(suggestion),
      label: `${suggestion.autoRefactor ? 'Auto-refactor' : 'Refactor'} ${suggestion.file.split('/').pop()}`,
      autoExecute: suggestion.autoRefactor
    }));
  };

  return {
    suggestions,
    isAnalyzing,
    autoRefactorEnabled,
    setAutoRefactorEnabled,
    analyzeForRefactoring,
    getAutoTriggerSuggestions,
    generateRefactoringMessages
  };
};
