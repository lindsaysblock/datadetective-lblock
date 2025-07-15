
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
      // Step 1: Set project name and reset progress
      setFlowState(prev => ({
        ...prev,
        currentProjectName: projectName,
        analysisProgress: 0,
        showAnalysisView: false
      }));

      // Step 2: Process files through data pipeline
      console.log('📁 Processing files through data pipeline...');
      setFlowState(prev => ({ ...prev, analysisProgress: 10 }));
      
      const parsedData = await dataPipeline.processFiles(files);
      console.log('✅ File processing completed:', parsedData?.length || 0, 'files');
      
      setFlowState(prev => ({ ...prev, analysisProgress: 30 }));
      
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
      setFlowState(prev => ({ ...prev, analysisProgress: 40 }));
      
      // Step 4: Execute analysis with progress tracking
      const results = await analysisOrchestrator.startAnalysis(context, (progress) => {
        console.log('📊 Analysis progress:', progress);
        setFlowState(prev => ({ ...prev, analysisProgress: Math.max(40, progress) }));
      });

      console.log('✅ Analysis results received:', results);

      // Step 5: Always show results view regardless of completion status
      if (results) {
        console.log('✅ Analysis completed successfully, showing results view');
        setFlowState(prev => ({
          ...prev,
          showAnalysisView: true,
          analysisProgress: 100
        }));
        
        return results;
      } else {
        console.log('⚠️ No results returned from analysis');
        throw new Error('Analysis did not return results');
      }

    } catch (error) {
      console.error('❌ Full analysis pipeline failed:', error);
      setFlowState(prev => ({
        ...prev,
        analysisProgress: 0,
        showAnalysisView: false
      }));
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
