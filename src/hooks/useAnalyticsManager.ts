
import { useState, useCallback, useMemo } from 'react';
import { ParsedData } from '@/utils/dataParser';
import { AnalysisResult } from '@/utils/analysis/types';
import { AnalyticsEngineManager } from '@/utils/analytics/analyticsEngineManager';

interface AnalyticsManagerState {
  isAnalyzing: boolean;
  results: AnalysisResult[];
  error: string | null;
  progress: number;
}

export const useAnalyticsManager = () => {
  const [state, setState] = useState<AnalyticsManagerState>({
    isAnalyzing: false,
    results: [],
    error: null,
    progress: 0
  });

  // Memoize analytics engine to prevent recreation
  const analyticsEngine = useMemo(() => new AnalyticsEngineManager(), []);

  const runAnalysis = useCallback(async (data: ParsedData): Promise<AnalysisResult[]> => {
    console.log('🔍 Starting analytics analysis...');
    
    setState(prev => ({ ...prev, isAnalyzing: true, error: null, progress: 0 }));

    try {
      setState(prev => ({ ...prev, progress: 25 }));
      const results = await analyticsEngine.runCompleteAnalysis(data);
      
      setState(prev => ({ 
        ...prev, 
        results, 
        isAnalyzing: false, 
        progress: 100 
      }));

      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      console.error('❌ Analytics analysis error:', error);
      
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        error: errorMessage,
        progress: 0
      }));

      throw error;
    }
  }, [analyticsEngine]);

  const reset = useCallback(() => {
    setState({
      isAnalyzing: false,
      results: [],
      error: null,
      progress: 0
    });
  }, []);

  return {
    ...state,
    runAnalysis,
    reset
  };
};
