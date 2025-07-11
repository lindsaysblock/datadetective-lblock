
import { useState, useCallback } from 'react';
import { DataAnalysisContext, AnalysisResults } from '@/types/data';
import { AnalysisEngine } from '@/services/analysisEngine';

interface UseDataAnalysisReturn {
  isProcessingAnalysis: boolean;
  analysisResults: AnalysisResults | null;
  analysisCompleted: boolean;
  showAnalysisView: boolean;
  educationalMode: boolean;
  analysisError: string | null;
  startAnalysis: (context: DataAnalysisContext) => Promise<void>;
  showResults: () => void;
  resetAnalysis: () => void;
  setShowAnalysisView: (show: boolean) => void;
}

export const useDataAnalysis = (): UseDataAnalysisReturn => {
  const [isProcessingAnalysis, setIsProcessingAnalysis] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [showAnalysisView, setShowAnalysisView] = useState(false);
  const [educationalMode, setEducationalMode] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const startAnalysis = useCallback(async (context: DataAnalysisContext) => {
    console.log('🚀 Starting analysis with context:', context);
    
    setIsProcessingAnalysis(true);
    setAnalysisResults(null);
    setAnalysisCompleted(false);
    setShowAnalysisView(false);
    setEducationalMode(context.educationalMode);
    setAnalysisError(null);
    
    try {
      // Add UX delay for better user experience
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const results = await AnalysisEngine.analyzeData(context);
      
      setAnalysisResults(results);
      setAnalysisCompleted(true);
      
      console.log('✅ Analysis completed:', results);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      console.error('❌ Analysis failed:', error);
      
      setAnalysisError(errorMessage);
      setAnalysisResults({
        insights: `Analysis failed: ${errorMessage}`,
        confidence: 'low',
        recommendations: [
          'Check your data format and try again',
          'Ensure your file is not corrupted',
          'Try uploading a different file'
        ],
        detailedResults: [],
        sqlQuery: '-- Analysis failed'
      });
      setAnalysisCompleted(true);
    } finally {
      setIsProcessingAnalysis(false);
    }
  }, []);

  const showResults = useCallback(() => {
    console.log('🎯 Showing analysis results');
    setShowAnalysisView(true);
  }, []);

  const resetAnalysis = useCallback(() => {
    setIsProcessingAnalysis(false);
    setAnalysisResults(null);
    setAnalysisCompleted(false);
    setShowAnalysisView(false);
    setEducationalMode(false);
    setAnalysisError(null);
  }, []);

  return {
    isProcessingAnalysis,
    analysisResults,
    analysisCompleted,
    showAnalysisView,
    educationalMode,
    analysisError,
    startAnalysis,
    showResults,
    resetAnalysis,
    setShowAnalysisView
  };
};
