
import { useState, useCallback } from 'react';
import { useDataAnalysis } from '@/hooks/useDataAnalysis';
import { DataAnalysisContext, AnalysisResults } from '@/types/data';
import { ParsedData } from '@/utils/dataParser';
import { useToast } from '@/hooks/use-toast';

interface AnalysisState {
  isProcessingAnalysis: boolean;
  analysisCompleted: boolean;
  analysisResults: AnalysisResults | null;
  educationalMode: boolean;
}

export const useAnalysisCoordination = () => {
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isProcessingAnalysis: false,
    analysisCompleted: false,
    analysisResults: null,
    educationalMode: false
  });

  const { analyzeData, isAnalyzing, analysisError, clearAnalysis } = useDataAnalysis();
  const { toast } = useToast();

  const startAnalysis = useCallback(async (
    researchQuestion: string,
    additionalContext: string,
    educationalMode: boolean = false,
    parsedData: ParsedData[] | null,
    columnMapping?: Record<string, string>
  ) => {
    console.log('🚀 Starting analysis coordination:', {
      researchQuestion: researchQuestion?.slice(0, 100) + '...',
      hasAdditionalContext: !!additionalContext,
      educationalMode,
      hasData: !!parsedData,
      dataCount: parsedData?.length || 0
    });

    if (!researchQuestion?.trim()) {
      toast({
        title: "Research Question Required",
        description: "Please provide a research question before starting analysis.",
        variant: "destructive",
      });
      return;
    }

    if (!parsedData || parsedData.length === 0) {
      toast({
        title: "Data Required",  
        description: "Please upload data before starting analysis.",
        variant: "destructive",
      });
      return;
    }

    setAnalysisState(prev => ({
      ...prev,
      isProcessingAnalysis: true,
      analysisCompleted: false,
      educationalMode
    }));

    try {
      const context: DataAnalysisContext = {
        researchQuestion,
        additionalContext: additionalContext || '',
        parsedData,
        columnMapping: columnMapping || {}
      };

      console.log('📊 Executing analysis with context:', context);
      
      const results = await analyzeData(context);
      
      if (results) {
        setAnalysisState(prev => ({
          ...prev,
          analysisResults: results,
          analysisCompleted: true
        }));

        console.log('✅ Analysis coordination completed successfully');
        
        toast({
          title: "Analysis Complete!",
          description: "Your data analysis has been completed successfully.",
        });
      } else {
        throw new Error('Analysis returned no results');
      }
    } catch (error) {
      console.error('❌ Analysis coordination failed:', error);
      
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setAnalysisState(prev => ({
        ...prev,
        isProcessingAnalysis: false
      }));
    }
  }, [analyzeData, toast]);

  const resetAnalysis = useCallback(() => {
    console.log('🔄 Resetting analysis state');
    
    setAnalysisState({
      isProcessingAnalysis: false,
      analysisCompleted: false,
      analysisResults: null,
      educationalMode: false
    });
    
    clearAnalysis();
  }, [clearAnalysis]);

  const retryAnalysis = useCallback(async (
    researchQuestion: string,
    additionalContext: string,
    parsedData: ParsedData[] | null,
    columnMapping?: Record<string, string>
  ) => {
    console.log('🔄 Retrying analysis');
    
    resetAnalysis();
    
    // Small delay to ensure state is reset
    setTimeout(() => {
      startAnalysis(researchQuestion, additionalContext, analysisState.educationalMode, parsedData, columnMapping);
    }, 100);
  }, [startAnalysis, resetAnalysis, analysisState.educationalMode]);

  return {
    analysisState,
    isAnalyzing,
    analysisError,
    startAnalysis,
    resetAnalysis,
    retryAnalysis
  };
};
