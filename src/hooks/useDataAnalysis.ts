
import { useState, useCallback } from 'react';
import { DataAnalysisContext, AnalysisResults } from '@/types/data';
import { AnalysisEngine } from '@/services/analysisEngine';
import { useToast } from '@/hooks/use-toast';

export const useDataAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeData = useCallback(async (context: DataAnalysisContext): Promise<AnalysisResults | null> => {
    if (isAnalyzing) {
      console.warn('Analysis already in progress');
      return null;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      console.log('🔍 Starting data analysis with context:', {
        hasResearchQuestion: !!context.researchQuestion,
        hasData: !!context.parsedData?.length,
        dataCount: context.parsedData?.length || 0
      });

      const results = await AnalysisEngine.analyzeData(context);
      
      console.log('✅ Analysis completed successfully:', {
        confidence: results.confidence,
        insightsLength: results.insights?.length || 0,
        recommendationsCount: results.recommendations?.length || 0
      });

      setAnalysisResults(results);
      
      toast({
        title: "Analysis Complete",
        description: "Your data has been analyzed successfully.",
      });

      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      console.error('❌ Analysis failed:', error);
      
      setAnalysisError(errorMessage);
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing, toast]);

  const clearAnalysis = useCallback(() => {
    setAnalysisResults(null);
    setAnalysisError(null);
  }, []);

  return {
    isAnalyzing,
    analysisResults,
    analysisError,
    analyzeData,
    clearAnalysis
  };
};
