
import { useEffect } from 'react';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useToast } from '@/hooks/use-toast';
import { useProjectFormState } from './useProjectFormState';
import { useProjectAnalysis } from './useProjectAnalysis';
import { useProjectAuth } from './useProjectAuth';
import { useProjectDialogs } from './useProjectDialogs';

export const useNewProjectForm = () => {
  console.log('useNewProjectForm hook called');
  
  const { saveFormData, getFormData, clearFormData, hasStoredData, isLoading } = useFormPersistence();
  const { toast } = useToast();
  
  const formState = useProjectFormState();
  const analysis = useProjectAnalysis();
  const auth = useProjectAuth();
  const dialogs = useProjectDialogs();

  console.log('Form state initialized:', formState);
  console.log('Current step from form state:', formState.step);

  // Auto-save form data when values change
  useEffect(() => {
    if (!isLoading && !dialogs.showRecoveryDialog && formState.researchQuestion) {
      const timeoutId = setTimeout(() => {
        saveFormData({
          researchQuestion: formState.researchQuestion,
          additionalContext: formState.additionalContext,
          file: formState.file ? {
            name: formState.file.name,
            size: formState.file.size,
            type: formState.file.type,
            lastModified: formState.file.lastModified
          } : null,
          parsedData: formState.parsedData,
          currentStep: formState.step
        });
        console.log('Auto-saved form data');
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [
    formState.researchQuestion,
    formState.additionalContext,
    formState.file,
    formState.parsedData,
    formState.step,
    isLoading,
    dialogs.showRecoveryDialog,
    saveFormData
  ]);

  // Check for saved data on component mount
  useEffect(() => {
    if (!isLoading) {
      const hasSavedData = hasStoredData();
      console.log('Has stored data:', hasSavedData);
      
      if (hasSavedData) {
        const savedData = getFormData();
        console.log('Saved data found:', savedData);
        
        // Only show recovery dialog if there's meaningful saved data
        const hasMeaningfulData = savedData.researchQuestion || savedData.additionalContext || savedData.file;
        
        if (hasMeaningfulData) {
          dialogs.setLastSaved(savedData.lastSaved);
          dialogs.setShowRecoveryDialog(true);
        }
      }
    }
  }, [isLoading, hasStoredData, getFormData, dialogs]);

  const handleRestoreData = () => {
    console.log('handleRestoreData called');
    try {
      const savedData = getFormData();
      console.log('Restoring data:', savedData);
      
      formState.setResearchQuestion(savedData.researchQuestion || '');
      formState.setAdditionalContext(savedData.additionalContext || '');
      formState.setParsedData(savedData.parsedData);
      formState.setStep(savedData.currentStep || 1);
      
      if (savedData.file && savedData.parsedData) {
        const mockFile = new File([''], savedData.file.name, {
          type: savedData.file.type,
          lastModified: savedData.file.lastModified
        });
        formState.setFile(mockFile);
      }
      
      dialogs.setShowRecoveryDialog(false);
      
      toast({
        title: "Progress Restored",
        description: "Your previous work has been restored successfully.",
      });
    } catch (error) {
      console.error('Error restoring data:', error);
      toast({
        title: "Restoration Failed",
        description: "Unable to restore previous progress. Starting fresh.",
        variant: "destructive",
      });
      handleStartFresh();
    }
  };

  const handleStartFresh = () => {
    console.log('handleStartFresh called');
    clearFormData();
    formState.resetForm();
    dialogs.setShowRecoveryDialog(false);
    
    toast({
      title: "Starting Fresh",
      description: "Previous progress cleared. Starting with a clean slate.",
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      formState.setFile(selectedFile);
      formState.setParsedData({ rows: 100, columns: 10, preview: [] });
    }
  };

  const handleStartAnalysisClick = () => {
    if (!auth.user) {
      auth.setShowSignInModal(true);
      return;
    }

    analysis.startAnalysis(formState.researchQuestion, formState.additionalContext);
    dialogs.setShowProjectDialog(true);
  };

  const handleProjectConfirm = (projectName: string) => {
    console.log('Project named:', projectName);
    formState.setCurrentProjectName(projectName);
    clearFormData();
    
    if (analysis.analysisCompleted) {
      analysis.showResults();
      dialogs.setShowProjectDialog(false);
    } else {
      const checkAnalysis = setInterval(() => {
        if (analysis.analysisCompleted) {
          analysis.showResults();
          dialogs.setShowProjectDialog(false);
          clearInterval(checkAnalysis);
        }
      }, 500);
    }
  };

  const handleBackToProject = () => {
    analysis.resetAnalysis();
    formState.setCurrentProjectName('');
  };

  const returnValue = {
    // Form state
    ...formState,
    
    // Analysis state
    ...analysis,
    
    // Auth state
    ...auth,
    
    // Dialog state
    ...dialogs,
    
    // Actions
    handleFileChange,
    handleStartAnalysisClick,
    handleProjectConfirm,
    handleBackToProject,
    handleRestoreData,
    handleStartFresh
  };

  console.log('useNewProjectForm returning:', Object.keys(returnValue));
  
  return returnValue;
};
