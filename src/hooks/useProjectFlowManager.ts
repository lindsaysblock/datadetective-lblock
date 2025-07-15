
import { useState, useCallback } from 'react';
import { useDataPipeline } from './useDataPipeline';
import { useAnalysisOrchestrator } from './useAnalysisOrchestrator';
import { DataAnalysisContext } from '@/types/data';

interface ProjectFlowState {
  showAnalysisView: boolean;
  currentProjectName: string;
  analysisProgress: number;
}

export const useProjectFlowManager = () => {
  const [flowState, setFlowState] = useState<ProjectFlowState>({
    showAnalysisView: false,
    currentProjectName: '',
    analysisProgress: 0
  });

  const dataPipeline = useDataPipeline();
  const analysisOrchestrator = useAnalysisOrchestrator();

  const executeFullAnalysis = useCallback(async (
    researchQuestion: string,
    additionalContext: string,
    educationalMode: boolean,
    files: File[],
    projectName: string
  ) => {
    console.log('🎯 Executing full analysis pipeline');
    
    try {
      // Step 1: Set project name early
      setFlowState(prev => ({
        ...prev,
        currentProjectName: projectName,
        analysisProgress: 0,
        showAnalysisView: false
      }));

      // Step 2: Process files through data pipeline
      console.log('📁 Processing files through data pipeline...');
      const parsedData = await dataPipeline.processFiles(files);
      console.log('✅ File processing completed:', parsedData?.length || 0, 'files');
      
      // Step 3: Create analysis context
      const context: DataAnalysisContext = {
        researchQuestion,
        additionalContext,
        educationalMode,
        parsedData,
        columnMapping: {
          valueColumns: [],
          categoryColumns: []
        }
      };

      console.log('🔍 Starting analysis orchestration...');
      
      // Step 4: Execute analysis with progress tracking
      const results = await analysisOrchestrator.startAnalysis(context, (progress) => {
        setFlowState(prev => ({ ...prev, analysisProgress: progress }));
      });

      // Step 5: Navigate to results view if successful
      if (results && analysisOrchestrator.completed) {
        console.log('✅ Analysis completed successfully, showing results view');
        setFlowState(prev => ({
          ...prev,
          showAnalysisView: true,
          analysisProgress: 100
        }));
        
        return results;
      }

      throw new Error('Analysis did not complete successfully');

    } catch (error) {
      console.error('❌ Full analysis pipeline failed:', error);
      throw error;
    }
  }, [dataPipeline, analysisOrchestrator]);

  const backToProject = useCallback(() => {
    console.log('🔄 Returning to project form');
    setFlowState({
      showAnalysisView: false,
      currentProjectName: '',
      analysisProgress: 0
    });
    dataPipeline.clearPipeline();
    analysisOrchestrator.resetAnalysis();
  }, [dataPipeline, analysisOrchestrator]);

  return {
    // Flow state
    ...flowState,
    
    // Pipeline states
    isProcessingData: dataPipeline.isProcessing,
    isAnalyzing: analysisOrchestrator.isAnalyzing,
    analysisResults: analysisOrchestrator.results,
    analysisError: analysisOrchestrator.error,
    analysisCompleted: analysisOrchestrator.completed,
    
    // Actions
    executeFullAnalysis,
    backToProject
  };
};
