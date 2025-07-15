
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
    console.log('🕵️ Starting detective investigation with enhanced progress tracking');
    
    setState({
      isAnalyzing: true,
      progress: 0,
      results: null,
      error: null,
      completed: false
    });

    try {
      // Progress simulation with detective-themed phases
      const updateProgress = (progress: number) => {
        console.log('🔍 Investigation progress:', progress);
        setState(prev => ({ ...prev, progress }));
        onProgress?.(progress);
      };

      // Phase 1: Initial case setup and validation
      updateProgress(5);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!context.researchQuestion?.trim()) {
        throw new Error('Investigation requires a research question');
      }
      
      if (!context.parsedData || context.parsedData.length === 0) {
        throw new Error('Investigation requires evidence data');
      }

      console.log('🔍 Beginning detective investigation phases...');

      // Phase 2: Evidence examination
      updateProgress(15);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // Phase 3: Pattern recognition and clue gathering
      updateProgress(30);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Phase 4: Statistical analysis and hypothesis testing
      updateProgress(50);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Phase 5: Cross-referencing data points
      updateProgress(70);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Phase 6: Execute main analysis engine
      updateProgress(85);
      console.log('🔍 Running core analysis engine...');
      
      const results = await AnalysisEngine.analyzeData(context);
      
      console.log('✅ Detective analysis completed successfully:', results);
      
      // Phase 7: Preparing final report
      updateProgress(95);
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Phase 8: Case closed
      updateProgress(100);
      await new Promise(resolve => setTimeout(resolve, 200));

      setState({
        isAnalyzing: false,
        progress: 100,
        results,
        error: null,
        completed: true
      });

      toast({
        title: "🕵️ Case Solved!",
        description: "Your investigation has been completed successfully. All clues have been analyzed.",
      });

      console.log('✅ Detective investigation orchestration completed successfully');
      return results;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Investigation failed due to unexpected circumstances';
      console.error('🚨 Detective investigation failed:', error);
      
      setState({
        isAnalyzing: false,
        progress: 0,
        results: null,
        error: errorMessage,
        completed: false
      });

      toast({
        title: "🚨 Investigation Interrupted",
        description: errorMessage,
        variant: "destructive",
      });

      return null;
    }
  }, [toast]);

  const resetAnalysis = useCallback(() => {
    console.log('🔄 Resetting detective investigation');
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
