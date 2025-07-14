
import { useState, useCallback } from 'react';
import { DataAnalysisContext } from '@/types/data';
import { AnalysisEngine } from '@/services/analysisEngine';
import { SimpleAnalysisEngine } from '@/utils/analysis/simpleAnalysisEngine';

interface AnalysisState {
  isProcessingAnalysis: boolean;
  analysisResults: any;
  analysisError: string | null;
  analysisCompleted: boolean;
}

export const useAnalysisCoordination = () => {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isProcessingAnalysis: false,
    analysisResults: null,
    analysisError: null,
    analysisCompleted: false
  });

  const startAnalysis = useCallback(async (
    researchQuestion: string,
    additionalContext: string,
    educationalMode: boolean,
    parsedData: any[],
    columnMapping: any,
    onProgress?: (progress: number) => void
  ) => {
    console.log('🚀 Starting analysis coordination');
    
    setAnalysisState({
      isProcessingAnalysis: true,
      analysisResults: null,
      analysisError: null,
      analysisCompleted: false
    });

    try {
      // Immediate progress update
      onProgress?.(10);

      const context: DataAnalysisContext = {
        researchQuestion,
        additionalContext,
        educationalMode,
        parsedData,
        columnMapping
      };

      // Check if it's a simple question for faster processing
      const isSimple = SimpleAnalysisEngine.isSimpleQuestion(researchQuestion);
      
      if (isSimple) {
        console.log('⚡ Processing simple question - faster analysis');
        
        // Quick progress updates for simple questions
        onProgress?.(30);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        onProgress?.(60);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        onProgress?.(85);
        await new Promise(resolve => setTimeout(resolve, 300));
      } else {
        console.log('🔬 Processing complex question - comprehensive analysis');
        
        // Slower progress for complex analysis
        onProgress?.(25);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        onProgress?.(50);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        onProgress?.(75);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Execute the analysis
      const analysisResults = await AnalysisEngine.analyzeData(context);
      
      onProgress?.(95);
      await new Promise(resolve => setTimeout(resolve, 200));
      
      onProgress?.(100);

      // Set successful completion state
      setAnalysisState({
        isProcessingAnalysis: false,
        analysisResults,
        analysisError: null, // Explicitly clear any previous errors
        analysisCompleted: true
      });

      console.log('✅ Analysis coordination completed');
      
    } catch (error) {
      console.error('❌ Analysis coordination failed:', error);
      
      // Only set error state if analysis truly failed
      setAnalysisState({
        isProcessingAnalysis: false,
        analysisResults: null,
        analysisError: error instanceof Error ? error.message : 'Analysis failed',
        analysisCompleted: false
      });
    }
  }, []);

  const resetAnalysis = useCallback(() => {
    setAnalysisState({
      isProcessingAnalysis: false,
      analysisResults: null,
      analysisError: null,
      analysisCompleted: false
    });
  }, []);

  return {
    analysisState,
    startAnalysis,
    resetAnalysis
  };
};
