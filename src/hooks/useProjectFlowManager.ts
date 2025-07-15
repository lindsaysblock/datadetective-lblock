
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
    console.log('🎯 Executing full detective analysis pipeline');
    
    // Prevent multiple simultaneous analyses
    if (analysisInProgressRef.current) {
      console.log('⚠️ Investigation already in progress, skipping');
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
      console.log('📁 Processing evidence files through data pipeline...');
      setFlowState(prev => ({ ...prev, analysisProgress: 5 }));
      
      // Check if files are already reconstructed (continue case)
      const hasReconstructedFiles = files.some(file => (file as any).isReconstructed);
      
      let parsedData;
      if (hasReconstructedFiles) {
        console.log('🔄 Using reconstructed files from continue case');
        // For continue cases, extract the parsedData from file metadata
        parsedData = files.map(file => (file as any).parsedData).filter(Boolean);
        
        if (parsedData.length === 0) {
          // Fallback to processing the files normally
          console.log('📋 Fallback: Processing reconstructed files normally');
          parsedData = await dataPipeline.processFiles(files);
        }
      } else {
        console.log('📊 Processing new files through pipeline');
        parsedData = await dataPipeline.processFiles(files);
      }
      
      console.log('✅ File processing completed:', {
        fileCount: parsedData?.length || 0,
        hasReconstructedFiles
      });
      
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

      console.log('🔍 Starting detective analysis orchestration...');
      
      // Step 4: Execute analysis with direct progress tracking
      const results = await analysisOrchestrator.startAnalysis(context, (progress) => {
        console.log('📊 Investigation progress update:', progress);
        // Map orchestrator progress (0-100) to flow progress (10-100)
        const mappedProgress = Math.max(10, Math.min(100, 10 + (progress * 0.9)));
        setFlowState(prev => ({ ...prev, analysisProgress: mappedProgress }));
      });

      console.log('✅ Detective analysis results received:', !!results);

      // Step 5: Show results if we have them
      if (results) {
        console.log('✅ Investigation completed successfully, showing case results');
        setFlowState(prev => ({
          ...prev,
          showAnalysisView: true,
          analysisProgress: 100
        }));
        
        return results;
      } else {
        console.log('⚠️ No results returned from investigation');
        return null;
      }

    } catch (error) {
      console.error('❌ Full detective analysis pipeline failed:', error);
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
    console.log('🔄 Returning to case setup');
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
    analysisResults: analysisOrchestrator.results,
    analysisError: analysisOrchestrator.error,
    analysisCompleted: analysisOrchestrator.completed,
    
    // Actions
    executeFullAnalysis,
    backToProject
  };
};
