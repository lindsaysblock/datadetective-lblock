/**
 * Phase 4: Advanced Custom Hook System - Unified Management Hook
 * Integrates hook pattern detection, library management, and documentation
 */

import { useState, useEffect } from 'react';
import { HookPatternDetector, HookPattern, HookExtractionSuggestion } from '../utils/hooks/advanced/hookPatternDetector';
import { HookDocumentationGenerator, HookDocumentation } from '../utils/hooks/advanced/hookDocumentationGenerator';

export const useAdvancedHookSystem = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detectedPatterns, setDetectedPatterns] = useState<HookPattern[]>([]);
  const [extractionSuggestions, setExtractionSuggestions] = useState<HookExtractionSuggestion[]>([]);
  const [hookLibrary, setHookLibrary] = useState<HookDocumentation[]>([]);

  const detector = new HookPatternDetector();
  const docGenerator = new HookDocumentationGenerator();

  const analyzeCodebaseForHooks = async () => {
    setIsAnalyzing(true);
    try {
      const patterns = await detector.analyzeCodebase();
      setDetectedPatterns(patterns);
      
      const suggestions = await detector.generateExtractionSuggestions();
      setExtractionSuggestions(suggestions);
      
      const library = docGenerator.getAllDocumentation();
      setHookLibrary(library);
      
      return { patterns, suggestions, library };
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateHookDocumentation = (hookName: string) => {
    return docGenerator.generateMarkdownDocumentation(hookName);
  };

  const getHooksByCategory = (category: string) => {
    return docGenerator.getHooksByCategory(category);
  };

  useEffect(() => {
    // Auto-analyze on mount
    analyzeCodebaseForHooks();
  }, []);

  return {
    isAnalyzing,
    detectedPatterns,
    extractionSuggestions,
    hookLibrary,
    analyzeCodebaseForHooks,
    generateHookDocumentation,
    getHooksByCategory,
    availableHooks: docGenerator.getAvailableHooks()
  };
};