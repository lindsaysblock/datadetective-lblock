
import { useState, useCallback } from 'react';
import { useDataAnalysis } from './useDataAnalysis';
import { useDataUpload } from './useDataUpload';
import { DataAnalysisContext, AnalysisResults } from '@/types/data';
import { ParsedData } from '@/utils/dataParser';

interface ProjectFormState {
  step: number;
  researchQuestion: string;
  additionalContext: string;
  files: File[];
  parsedData: ParsedData | null;
  columnMapping: Record<string, string>;
  showAnalysisView: boolean;
  isProcessingAnalysis: boolean;
  analysisCompleted: boolean;
  analysisResults: AnalysisResults | null;
  currentProjectName: string;
  showProjectDialog: boolean;
  uploading: boolean;
  parsing: boolean;
  educationalMode: boolean;
}

export const useNewProjectForm = () => {
  console.log('useNewProjectForm hook called');
  
  const [formState, setFormState] = useState<ProjectFormState>(() => {
    console.log('useProjectFormState initializing');
    const initialState = {
      step: 1,
      researchQuestion: '',
      additionalContext: '',
      files: [],
      parsedData: null,
      columnMapping: {},
      showAnalysisView: false,
      isProcessingAnalysis: false,
      analysisCompleted: false,
      analysisResults: null,
      currentProjectName: '',
      showProjectDialog: false,
      uploading: false,
      parsing: false,
      educationalMode: false
    };
    
    console.log('useProjectFormState initialized with step:', initialState.step);
    console.log('Form state initialized:', {
      step: initialState.step,
      researchQuestion: initialState.researchQuestion,
      files: initialState.files.length,
      parsedData: initialState.parsedData ? 'has data' : 'no data'
    });
    
    return initialState;
  });

  const { analyzeData, isAnalyzing, analysisResults, analysisError } = useDataAnalysis();
  const uploadHook = useDataUpload();

  const updateFormState = useCallback((updates: Partial<ProjectFormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  }, []);

  const nextStep = useCallback(() => {
    setFormState(prev => ({ ...prev, step: prev.step + 1 }));
  }, []);

  const prevStep = useCallback(() => {
    setFormState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  }, []);

  const setResearchQuestion = useCallback((question: string) => {
    updateFormState({ researchQuestion: question });
  }, [updateFormState]);

  const setAdditionalContext = useCallback((context: string) => {
    updateFormState({ additionalContext: context });
  }, [updateFormState]);

  const addFile = useCallback((file: File) => {
    setFormState(prev => ({ ...prev, files: [...prev.files, file] }));
  }, []);

  const removeFile = useCallback((index: number) => {
    setFormState(prev => ({ 
      ...prev, 
      files: prev.files.filter((_, i) => i !== index) 
    }));
  }, []);

  const setColumnMapping = useCallback((mapping: Record<string, string>) => {
    updateFormState({ columnMapping: mapping });
  }, [updateFormState]);

  const handleFileUpload = useCallback(async (file: File) => {
    updateFormState({ uploading: true, parsing: true });
    
    try {
      const parsed = await uploadHook.handleFileUpload(file);
      updateFormState({ 
        parsedData: parsed, 
        uploading: false, 
        parsing: false 
      });
      return parsed;
    } catch (error) {
      console.error('File upload failed:', error);
      updateFormState({ uploading: false, parsing: false });
      throw error;
    }
  }, [uploadHook, updateFormState]);

  const startAnalysis = useCallback(async (context: DataAnalysisContext) => {
    console.log('🚀 Starting analysis in form hook');
    
    updateFormState({ 
      isProcessingAnalysis: true,
      analysisCompleted: false 
    });

    try {
      const results = await analyzeData(context);
      
      if (results) {
        updateFormState({
          analysisResults: results,
          analysisCompleted: true,
          isProcessingAnalysis: false,
          currentProjectName: context.researchQuestion.slice(0, 50) + '...'
        });
      } else {
        updateFormState({ isProcessingAnalysis: false });
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      updateFormState({ isProcessingAnalysis: false });
    }
  }, [analyzeData, updateFormState]);

  const showResults = useCallback(() => {
    updateFormState({ showAnalysisView: true });
  }, [updateFormState]);

  const handleBackToProject = useCallback(() => {
    updateFormState({ showAnalysisView: false });
  }, [updateFormState]);

  const setShowProjectDialog = useCallback((show: boolean) => {
    updateFormState({ showProjectDialog: show });
  }, [updateFormState]);

  console.log('useNewProjectForm returning step:', formState.step);
  console.log('useNewProjectForm parsedData:', formState.parsedData ? 'has data' : 'no data');

  return {
    // Form state
    step: formState.step,
    researchQuestion: formState.researchQuestion,
    additionalContext: formState.additionalContext,
    files: formState.files,
    parsedData: formState.parsedData,
    columnMapping: formState.columnMapping,
    showAnalysisView: formState.showAnalysisView,
    isProcessingAnalysis: formState.isProcessingAnalysis,
    analysisCompleted: formState.analysisCompleted,
    analysisResults: formState.analysisResults || analysisResults,
    currentProjectName: formState.currentProjectName,
    showProjectDialog: formState.showProjectDialog,
    uploading: formState.uploading,
    parsing: formState.parsing,
    educationalMode: formState.educationalMode,
    
    // Analysis state
    isAnalyzing,
    analysisError,
    
    // Actions
    nextStep,
    prevStep,
    setResearchQuestion,
    setAdditionalContext,
    addFile,
    removeFile,
    setColumnMapping,
    handleFileUpload,
    startAnalysis,
    showResults,
    handleBackToProject,
    setShowProjectDialog
  };
};
