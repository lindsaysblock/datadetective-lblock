
import { useState, useCallback } from 'react';
import { DataAnalysisContext, AnalysisResults } from '@/types/data';
import { AnalysisEngine } from '@/services/analysisEngine';
import { useToast } from '@/hooks/use-toast';

interface AnalysisState {
  isAnalyzing: boolean;
  progress: number;
  results: AnalysisResults | null;
  error: string | null;
  completed: boolean;
}

export const useAnalysisOrchestrator = () => {
  const [state, setState] = useState<AnalysisState>({
    isAnalyzing: false,
    progress: 0,
    results: null,
    error: null,
    completed: false
  });
  const { toast } = useToast();

  const startAnalysis = useCallback(async (
    context: DataAnalysisContext,
    onProgress?: (progress: number) => void
  ): Promise<AnalysisResults | null> => {
    console.log('🚀 Starting analysis orchestration');
    
    setState({
      isAnalyzing: true,
      progress: 0,
      results: null,
      error: null,
      completed: false
    });

    try {
      // Progress simulation based on complexity
      const updateProgress = (progress: number) => {
        setState(prev => ({ ...prev, progress }));
        onProgress?.(progress);
      };

      // Initial validation
      updateProgress(10);
      
      if (!context.researchQuestion?.trim()) {
        throw new Error('Research question is required');
      }
      
      if (!context.parsedData || context.parsedData.length === 0) {
        throw new Error('Data is required for analysis');
      }

      // Analysis phases with progress updates
      updateProgress(25);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      updateProgress(50);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      updateProgress(75);
      
      // Execute actual analysis
      const results = await AnalysisEngine.analyzeData(context);
      
      updateProgress(95);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      updateProgress(100);

      setState({
        isAnalyzing: false,
        progress: 100,
        results,
        error: null,
        completed: true
      });

      toast({
        title: "Analysis Complete ✅",
        description: "Your data analysis has been completed successfully.",
      });

      console.log('✅ Analysis orchestration completed');
      return results;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      console.error('❌ Analysis orchestration failed:', error);
      
      setState({
        isAnalyzing: false,
        progress: 0,
        results: null,
        error: errorMessage,
        completed: false
      });

      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    }
  }, [toast]);

  const resetAnalysis = useCallback(() => {
    setState({
      isAnalyzing: false,
      progress: 0,
      results: null,
      error: null,
      completed: false
    });
  }, []);

  return {
    ...state,
    startAnalysis,
    resetAnalysis
  };
};
