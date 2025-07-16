/**
 * Analysis Engine Hook
 * Refactored core analysis logic with proper error handling and state management
 */

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AnalysisReport } from '@/types/analysis';
import { DataAnalysisContext } from '@/types/data';
import { AnalysisCoordinator } from '@/services/analysis/analysisCoordinator';
import { TIMEOUTS } from '@/constants/ui';

interface UseAnalysisEngineReturn {
  isAnalyzing: boolean;
  report: AnalysisReport | null;
  error: string | null;
  progress: number;
  startAnalysis: (context: DataAnalysisContext) => Promise<void>;
  resetAnalysis: () => void;
  clearError: () => void;
}

export const useAnalysisEngine = (): UseAnalysisEngineReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const simulateProgress = useCallback(async (): Promise<void> => {
    const progressSteps = [10, 25, 40, 60, 80, 95, 100];
    
    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, TIMEOUTS.SHORT));
      setProgress(step);
    }
  }, []);

  const startAnalysis = useCallback(async (context: DataAnalysisContext): Promise<void> => {
    console.log('🚀 Starting analysis with new engine', context);
    
    setIsAnalyzing(true);
    setError(null);
    setReport(null);
    setProgress(0);
    
    try {
      // Start progress simulation
      await simulateProgress();
      
      const analysisReport = await AnalysisCoordinator.executeAnalysis(context);
      setReport(analysisReport);
      setProgress(100);
      
      toast({
        title: "Analysis Complete! 🎉",
        description: "Your data investigation has been completed successfully.",
      });
      
      console.log('✅ Analysis completed successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error('❌ Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [simulateProgress, toast]);

  const resetAnalysis = useCallback((): void => {
    setIsAnalyzing(false);
    setReport(null);
    setError(null);
    setProgress(0);
  }, []);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  return {
    isAnalyzing,
    report,
    error,
    progress,
    startAnalysis,
    resetAnalysis,
    clearError,
  };
};