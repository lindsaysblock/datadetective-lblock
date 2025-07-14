
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
      // Step 1: Process files through data pipeline
      const parsedData = await dataPipeline.processFiles(files);
      
      // Step 2: Create analysis context
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

      // Step 3: Set project name and start analysis
      setFlowState(prev => ({
        ...prev,
        currentProjectName: projectName,
        analysisProgress: 0
      }));

      // Step 4: Execute analysis with progress tracking
      const results = await analysisOrchestrator.startAnalysis(context, (progress) => {
        setFlowState(prev => ({ ...prev, analysisProgress: progress }));
      });

      // Step 5: Navigate to results view if successful
      if (results && analysisOrchestrator.completed) {
        setFlowState(prev => ({
          ...prev,
          showAnalysisView: true,
          analysisProgress: 100
        }));
        
        console.log('✅ Full analysis pipeline completed successfully');
        return results;
      }

      throw new Error('Analysis did not complete successfully');

    } catch (error) {
      console.error('❌ Full analysis pipeline failed:', error);
      throw error;
    }
  }, [dataPipeline, analysisOrchestrator]);

  const backToProject = useCallback(() => {
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
