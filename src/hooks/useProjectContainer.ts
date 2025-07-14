
import { useState, useCallback, useEffect, useRef } from 'react';
import { useProjectFormManagement } from '@/hooks/useProjectFormManagement';
import { useAnalysisCoordination } from '@/hooks/useAnalysisCoordination';
import { useProjectFormPersistence } from '@/hooks/useProjectFormPersistence';
import { useProjectAuth } from '@/hooks/useProjectAuth';
import { useToast } from '@/hooks/use-toast';

export const useProjectContainer = () => {
  const [showAnalysisView, setShowAnalysisView] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [recoveryDialogDismissed, setRecoveryDialogDismissed] = useState(false);
  const [educationalMode, setEducationalMode] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  // Use ref to track if component is mounted
  const isMountedRef = useRef(true);

  const formManagement = useProjectFormManagement();
  const analysisCoordination = useAnalysisCoordination();
  const { saveFormData, clearFormData, getFormData, hasStoredData } = useProjectFormPersistence();
  const projectAuth = useProjectAuth();
  const { toast } = useToast();

  // Clean up on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Check for stored data on mount
  useEffect(() => {
    if (hasStoredData() && !recoveryDialogDismissed && isMountedRef.current) {
      setShowRecoveryDialog(true);
    }
  }, [hasStoredData, recoveryDialogDismissed]);

  // Auto-save form data
  useEffect(() => {
    if (isMountedRef.current && (formManagement.formState.step > 1 || formManagement.formState.researchQuestion)) {
      saveFormData({
        ...formManagement.formState,
        currentStep: formManagement.formState.step
      });
    }
  }, [formManagement.formState, saveFormData]);

  const handleStartAnalysis = useCallback((
    researchQuestion: string,
    additionalContext: string,
    educationalMode: boolean,
    parsedData: any[],
    columnMapping: any
  ) => {
    if (!isMountedRef.current) return;
    
    console.log('🚀 handleStartAnalysis called with:', {
      researchQuestion: researchQuestion?.slice(0, 50) + '...',
      hasAdditionalContext: !!additionalContext,
      educationalMode,
      hasData: !!parsedData && parsedData.length > 0,
      dataCount: parsedData?.length || 0
    });

    if (!projectAuth.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to start analysis.",
        variant: "destructive",
      });
      return;
    }

    setEducationalMode(educationalMode);
    setShowProjectDialog(true);
    setAnalysisProgress(0);
    
    // Start analysis with progress callback
    analysisCoordination.startAnalysis(
      researchQuestion,
      additionalContext,
      educationalMode,
      parsedData,
      columnMapping,
      (progress: number) => {
        if (isMountedRef.current) {
          console.log('📊 Analysis progress:', progress + '%');
          setAnalysisProgress(progress);
        }
      }
    );
  }, [projectAuth.user, toast, analysisCoordination]);

  const handleAnalysisComplete = useCallback(() => {
    if (!isMountedRef.current) return;
    
    console.log('✅ Analysis completed in container');
    setAnalysisProgress(100);
    
    if (analysisCoordination.analysisState.analysisResults) {
      formManagement.updateFormState({
        analysisCompleted: true,
        analysisResults: analysisCoordination.analysisState.analysisResults
      });
    }
  }, [analysisCoordination.analysisState.analysisResults, formManagement]);

  const handleProgressUpdate = useCallback((progress: number) => {
    if (isMountedRef.current) {
      setAnalysisProgress(progress);
    }
  }, []);

  const handleViewResults = useCallback(() => {
    if (!isMountedRef.current) return;
    
    console.log('📊 Viewing analysis results');
    setShowAnalysisView(true);
    setShowProjectDialog(false);
    
    // Clear any progress state
    setAnalysisProgress(0);
  }, []);

  const handleBackToProject = useCallback(() => {
    if (!isMountedRef.current) return;
    
    console.log('🔙 Returning to project form');
    setShowAnalysisView(false);
    analysisCoordination.resetAnalysis();
    formManagement.updateFormState({ currentProjectName: '' });
    setAnalysisProgress(0);
  }, [analysisCoordination, formManagement]);

  const handleProjectConfirm = useCallback((projectName: string) => {
    if (!isMountedRef.current) return;
    
    console.log('✅ Project confirmed:', projectName);
    formManagement.updateFormState({ currentProjectName: projectName });
    
    // Progress will be handled by the startAnalysis callback
  }, [formManagement]);

  const handleRestoreData = useCallback(() => {
    if (!isMountedRef.current) return;
    
    try {
      const savedData = getFormData();
      console.log('🔄 Restoring saved data:', savedData);
      
      formManagement.updateFormState({
        researchQuestion: savedData.researchQuestion || '',
        additionalContext: savedData.additionalContext || '',
        parsedData: savedData.parsedData || [],
        step: savedData.currentStep || 1
      });
      
      setShowRecoveryDialog(false);
      setRecoveryDialogDismissed(true);
      
      toast({
        title: "Progress Restored",
        description: "Your previous work has been restored successfully.",
      });
    } catch (error) {
      console.error('❌ Error restoring data:', error);
      toast({
        title: "Restoration Failed",
        description: "Unable to restore previous progress. Starting fresh.",
        variant: "destructive",
      });
      handleStartFresh();
    }
  }, [getFormData, formManagement, toast]);

  const handleStartFresh = useCallback(() => {
    if (!isMountedRef.current) return;
    
    console.log('🆕 Starting fresh');
    clearFormData();
    formManagement.resetForm();
    setShowRecoveryDialog(false);
    setRecoveryDialogDismissed(true);
    
    toast({
      title: "Starting Fresh",
      description: "Previous progress cleared. Starting with a clean slate.",
    });
  }, [clearFormData, formManagement, toast]);

  // Combined form data for backward compatibility
  const formData = {
    ...formManagement.formState,
    ...analysisCoordination.analysisState,
    ...projectAuth, // Include all auth properties including setShowSignInModal
    showAnalysisView,
    showProjectDialog,
    showRecoveryDialog,
    educationalMode,
    handleBackToProject,
    handleRestoreData,
    handleStartFresh,
    files: formManagement.formState.files || [],
    setResearchQuestion: (value: string) => formManagement.updateFormState({ researchQuestion: value }),
    setAdditionalContext: (value: string) => formManagement.updateFormState({ additionalContext: value }),
    addFile: formManagement.addFile,
    removeFile: formManagement.removeFile,
    handleFileUpload: formManagement.processFiles,
    setColumnMapping: (mapping: any) => formManagement.updateFormState({ columnMapping: mapping }),
    nextStep: formManagement.navigationActions.nextStep,
    prevStep: formManagement.navigationActions.prevStep,
    setShowProjectDialog,
    setShowRecoveryDialog
  };

  return {
    formData,
    analysisProgress,
    handleAnalysisComplete,
    handleProgressUpdate,
    handleViewResults,
    handleStartAnalysis,
    handleProjectConfirm,
    handleRestoreData,
    handleStartFresh,
    setShowProjectDialog,
    setShowRecoveryDialog
  };
};
