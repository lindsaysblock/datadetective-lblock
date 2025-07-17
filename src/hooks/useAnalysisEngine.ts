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
    const PROGRESS_STEPS = [10, 25, 40, 60, 80, 95, 100];
    
    for (const step of PROGRESS_STEPS) {
      await new Promise(resolve => setTimeout(resolve, TIMEOUTS.SHORT));
      setProgress(step);
    }
  }, []);

  const startAnalysis = useCallback(async (context: DataAnalysisContext): Promise<void> => {
    console.log('🚀 [ENGINE] Starting analysis with new engine', context);
    console.log('🔍 [ENGINE] Context validation:', {
      hasResearchQuestion: !!context.researchQuestion,
      researchQuestionLength: context.researchQuestion?.length || 0,
      hasAdditionalContext: !!context.additionalContext,
      parsedDataCount: context.parsedData?.length || 0,
      firstFileStructure: context.parsedData?.[0] ? {
        rowCount: context.parsedData[0].rows || 0,
        columnCount: context.parsedData[0].columns || 0,
        hasData: !!context.parsedData[0].data,
        dataLength: context.parsedData[0].data?.length || 0,
        hasPreview: !!context.parsedData[0].preview,
        previewLength: context.parsedData[0].preview?.length || 0
      } : 'No data file',
      educationalMode: context.educationalMode
    });
    
    setIsAnalyzing(true);
    setError(null);
    setReport(null);
    setProgress(0);
    
    try {
      console.log('🔍 [ENGINE] PHASE 1 - Starting progress simulation');
      // Start progress simulation
      await simulateProgress();
      console.log('✅ [ENGINE] PHASE 1 - Progress simulation completed');
      
      console.log('🔍 [ENGINE] PHASE 2 - Executing analysis with coordinator');
      const analysisReport = await AnalysisCoordinator.executeAnalysis(context);
      console.log('✅ [ENGINE] PHASE 2 - Analysis coordinator completed:', {
        reportId: analysisReport.id,
        resultsCount: analysisReport.results?.length || 0,
        insightsCount: analysisReport.insights?.length || 0,
        confidence: analysisReport.confidence,
        hasSQL: !!analysisReport.sqlQuery
      });
      
      setReport(analysisReport);
      const COMPLETE_PROGRESS = 100;
      setProgress(COMPLETE_PROGRESS);
      
      toast({
        title: "Analysis Complete! 🎉",
        description: "Your data investigation has been completed successfully.",
      });
      
      console.log('✅ [ENGINE] Analysis completed successfully - report set in state');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ [ENGINE] Analysis failed:', {
        error: err,
        errorMessage,
        stack: err instanceof Error ? err.stack : 'No stack trace'
      });
      
      setError(errorMessage);
      
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      console.log('🔍 [ENGINE] PHASE 3 - Finalizing analysis state');
      setIsAnalyzing(false);
      console.log('✅ [ENGINE] PHASE 3 - Analysis state finalized');
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