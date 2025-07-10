
import { useState, useEffect } from 'react';
import { AutoRefactorSystem, RefactoringSuggestion } from '../utils/qa/autoRefactorSystem';

export const useAutoRefactor = () => {
  const [suggestions, setSuggestions] = useState<RefactoringSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const autoRefactorSystem = new AutoRefactorSystem();

  const analyzeForRefactoring = async (): Promise<RefactoringSuggestion[]> => {
    setIsAnalyzing(true);
    try {
      const allSuggestions = await autoRefactorSystem.analyzeCodebase();
      setSuggestions(allSuggestions);
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
  }> => {
    return suggestions.map(suggestion => ({
      message: autoRefactorSystem.generateRefactoringMessage(suggestion),
      label: `Refactor ${suggestion.file.split('/').pop()}`
    }));
  };

  return {
    suggestions,
    isAnalyzing,
    analyzeForRefactoring,
    getAutoTriggerSuggestions,
    generateRefactoringMessages
  };
};
