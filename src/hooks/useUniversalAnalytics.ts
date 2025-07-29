/**
 * Universal Analytics Hook
 * Simplified hook for using the enhanced analytics anywhere in the app
 */

import { useState, useCallback } from 'react';
import { EnhancedAnalysisEngine, type EnhancedAnalysisContext, type EnhancedAnalysisResult } from '@/services/enhancedAnalysisEngine';
import { useToast } from '@/hooks/use-toast';
import { ParsedData } from '@/utils/dataParser';

export interface UseUniversalAnalyticsOptions {
  autoConnect?: boolean;
  defaultDatabaseTables?: string[];
}

export function useUniversalAnalytics(options: UseUniversalAnalyticsOptions = {}) {
  const [engine] = useState(() => new EnhancedAnalysisEngine());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastResult, setLastResult] = useState<EnhancedAnalysisResult | null>(null);
  const [requiresApiKey, setRequiresApiKey] = useState(false);
  const { toast } = useToast();

  const analyzeQuestion = useCallback(async (
    question: string,
    data?: ParsedData | ParsedData[],
    files?: File[],
    userId?: string
  ): Promise<EnhancedAnalysisResult> => {
    if (!question.trim()) {
      throw new Error('Question is required');
    }

    setIsAnalyzing(true);
    setRequiresApiKey(false);

    try {
      const context: EnhancedAnalysisContext = {
        question: question.trim(),
        files,
        parsedData: data ? (Array.isArray(data) ? data : [data]) : undefined,
        databaseTables: options.defaultDatabaseTables || ['datasets', 'projects', 'analysis_results'],
        userId
      };

      const result = await engine.analyzeWithQuestion(context);
      setLastResult(result);

      if (result.requiresApiKey) {
        setRequiresApiKey(true);
        return result;
      }

      if (result.success) {
        toast({
          title: "Analysis Complete! 🎉",
          description: "Your question has been analyzed successfully.",
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive"
        });
      }

      return result;
    } catch (error) {
      const errorResult: EnhancedAnalysisResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Analysis failed'
      };
      
      setLastResult(errorResult);
      
      toast({
        title: "Analysis Error",
        description: errorResult.error,
        variant: "destructive"
      });
      
      return errorResult;
    } finally {
      setIsAnalyzing(false);
    }
  }, [engine, options.defaultDatabaseTables, toast]);

  const setPerplexityApiKey = useCallback((apiKey: string) => {
    engine.setPerplexityApiKey(apiKey);
    setRequiresApiKey(false);
    
    toast({
      title: "API Key Configured",
      description: "Perplexity AI integration is now active!",
    });
  }, [engine, toast]);

  const hasPerplexityApiKey = useCallback(() => {
    return engine.hasPerplexityApiKey();
  }, [engine]);

  const testAnalysis = useCallback(async (): Promise<boolean> => {
    try {
      return await engine.testAnalysis();
    } catch (error) {
      console.error('Test analysis failed:', error);
      return false;
    }
  }, [engine]);

  return {
    analyzeQuestion,
    setPerplexityApiKey,
    hasPerplexityApiKey,
    testAnalysis,
    isAnalyzing,
    lastResult,
    requiresApiKey,
    // Static helpers
    getSupportedFileTypes: () => EnhancedAnalysisEngine.getSupportedFileTypes(),
    isFileTypeSupported: (fileName: string) => EnhancedAnalysisEngine.isFileTypeSupported(fileName)
  };
}