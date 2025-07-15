
import { useState, useCallback, useRef } from 'react';
import { useDataPipeline } from './useDataPipeline';
import { useAnalysisOrchestrator } from './useAnalysisOrchestrator';
import { DataAnalysisContext } from '@/types/data';

interface ProjectFlowState {
  showAnalysisView: boolean;
  currentProjectName: string;
  analysisProgress: number;
  isInitialized: boolean;
}

export const useProjectFlowManager = () => {
  const [flowState, setFlowState] = useState<ProjectFlowState>({
    showAnalysisView: false,
    currentProjectName: '',
    analysisProgress: 0,
    isInitialized: true
  });

  const dataPipeline = useDataPipeline();
  const analysisOrchestrator = useAnalysisOrchestrator();
  const analysisInProgressRef = useRef(false);

  const executeFullAnalysis = useCallback(async (
    researchQuestion: string,
    additionalContext: string,
    educationalMode: boolean,
    files: File[],
    projectName: string
  ) => {
    console.log('🎯 Executing full analysis pipeline');
    
    // Prevent multiple simultaneous analyses
    if (analysisInProgressRef.current) {
      console.log('⚠️ Analysis already in progress, skipping');
      return null;
    }
    
    analysisInProgressRef.current = true;
    
    try {
      // Step 1: Set project name and reset progress
      setFlowState(prev => ({
        ...prev,
        currentProjectName: projectName,
        analysisProgress: 0,
        showAnalysisView: false,
        isInitialized: true
      }));

      // Step 2: Process files through data pipeline
      console.log('📁 Processing files through data pipeline...');
      setFlowState(prev => ({ ...prev, analysisProgress: 5 }));
      
      const parsedData = await dataPipeline.processFiles(files);
      console.log('✅ File processing completed:', parsedData?.length || 0, 'files');
      
      setFlowState(prev => ({ ...prev, analysisProgress: 10 }));
      
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
      
      // Step 4: Execute analysis with direct progress tracking
      const results = await analysisOrchestrator.startAnalysis(context, (progress) => {
        console.log('📊 Analysis progress update:', progress);
        // Map orchestrator progress (0-100) to flow progress (10-100)
        const mappedProgress = Math.max(10, Math.min(100, 10 + (progress * 0.9)));
        setFlowState(prev => ({ ...prev, analysisProgress: mappedProgress }));
      });

      console.log('✅ Analysis results received:', results);

      // Step 5: Show results if we have them, regardless of completion status
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
        // Don't throw error, just return null to let caller handle
        return null;
      }

    } catch (error) {
      console.error('❌ Full analysis pipeline failed:', error);
      setFlowState(prev => ({
        ...prev,
        analysisProgress: 0,
        showAnalysisView: false
      }));
      throw error;
    } finally {
      analysisInProgressRef.current = false;
    }
  }, [dataPipeline, analysisOrchestrator, setFlowState]);

  const backToProject = useCallback(() => {
    console.log('🔄 Returning to project form');
    analysisInProgressRef.current = false;
    setFlowState({
      showAnalysisView: false,
      currentProjectName: '',
      analysisProgress: 0,
      isInitialized: true
    });
    dataPipeline.clearPipeline();
    analysisOrchestrator.resetAnalysis();
  }, [dataPipeline, analysisOrchestrator]);

  return {
    // Flow state
    ...flowState,
    
    // Pipeline states - use orchestrator results directly
    isProcessingData: dataPipeline.isProcessing,
    isAnalyzing: analysisOrchestrator.isAnalyzing || analysisInProgressRef.current,
    analysisResults: analysisOrchestrator.results, // Direct from orchestrator
    analysisError: analysisOrchestrator.error,
    analysisCompleted: analysisOrchestrator.completed,
    
    // Actions
    executeFullAnalysis,
    backToProject
  };
};
