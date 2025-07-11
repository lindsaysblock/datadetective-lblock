
import { useState, useCallback } from 'react';
import { AnalysisReport } from '@/types/analysis';
import { DataAnalysisContext } from '@/types/data';
import { AnalysisCoordinator } from '@/services/analysisCoordinator';

interface UseAnalysisEngineReturn {
  isAnalyzing: boolean;
  report: AnalysisReport | null;
  error: string | null;
  startAnalysis: (context: DataAnalysisContext) => Promise<void>;
  resetAnalysis: () => void;
}

export const useAnalysisEngine = (): UseAnalysisEngineReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startAnalysis = useCallback(async (context: DataAnalysisContext) => {
    console.log('🚀 Starting analysis with new engine');
    
    setIsAnalyzing(true);
    setError(null);
    setReport(null);
    
    try {
      const analysisReport = await AnalysisCoordinator.executeAnalysis(context);
      setReport(analysisReport);
      console.log('✅ Analysis completed successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('❌ Analysis failed:', err);
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const resetAnalysis = useCallback(() => {
    setIsAnalyzing(false);
    setReport(null);
    setError(null);
  }, []);

  return {
    isAnalyzing,
    report,
    error,
    startAnalysis,
    resetAnalysis
  };
};
