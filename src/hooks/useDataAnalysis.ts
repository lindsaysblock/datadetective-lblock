
import { useState, useCallback } from 'react';
import { DataAnalysisContext, AnalysisResults } from '@/types/data';
import { AnalysisEngine } from '@/services/analysisEngine';

interface UseDataAnalysisReturn {
  isProcessingAnalysis: boolean;
  analysisResults: AnalysisResults | null;
  analysisCompleted: boolean;
  showAnalysisView: boolean;
  educationalMode: boolean;
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

  const startAnalysis = useCallback(async (context: DataAnalysisContext) => {
    console.log('🚀 Starting analysis with context:', context);
    
    setIsProcessingAnalysis(true);
    setAnalysisResults(null);
    setAnalysisCompleted(false);
    setShowAnalysisView(false);
    setEducationalMode(context.educationalMode);
    
    try {
      // Simulate processing time for UX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const results = await AnalysisEngine.analyzeData(context);
      
      setAnalysisResults(results);
      setAnalysisCompleted(true);
      
      console.log('✅ Analysis completed:', results);
    } catch (error) {
      console.error('❌ Analysis failed:', error);
      setAnalysisResults({
        insights: 'Analysis failed due to an error. Please try again.',
        confidence: 'low',
        recommendations: ['Check your data format', 'Ensure file is not corrupted', 'Try a different file'],
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
  }, []);

  return {
    isProcessingAnalysis,
    analysisResults,
    analysisCompleted,
    showAnalysisView,
    educationalMode,
    startAnalysis,
    showResults,
    resetAnalysis,
    setShowAnalysisView
  };
};
