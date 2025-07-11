
import { useEffect } from 'react';
import { useFormPersistence } from '@/hooks/useFormPersistence';

export const useFormDataPersistence = (
  formState: any,
  dialogs: any,
  isLoading: boolean
) => {
  const { saveFormData, getFormData, clearFormData, hasStoredData } = useFormPersistence();

  // Auto-save form data when values change
  useEffect(() => {
    if (isLoading || dialogs.showRecoveryDialog || dialogs.recoveryDialogDismissed) {
      return;
    }

    if (formState.researchQuestion) {
      const timeoutId = setTimeout(() => {
        saveFormData({
          researchQuestion: formState.researchQuestion,
          additionalContext: formState.additionalContext,
          files: formState.files.map((file: File) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
          })),
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
    formState.files,
    formState.parsedData,
    formState.step,
    isLoading,
    dialogs.showRecoveryDialog,
    dialogs.recoveryDialogDismissed,
    saveFormData
  ]);

  // Check for saved data on component mount
  useEffect(() => {
    if (isLoading || dialogs.recoveryDialogDismissed) {
      return;
    }
    
    const hasSavedData = hasStoredData();
    console.log('Has stored data:', hasSavedData);
    
    if (hasSavedData) {
      const savedData = getFormData();
      console.log('Saved data found:', savedData);
      
      // Only show recovery dialog if there's meaningful saved data
      const hasMeaningfulData = savedData.researchQuestion || savedData.additionalContext || savedData.files;
      
      if (hasMeaningfulData) {
        dialogs.setLastSaved(savedData.lastSaved);
        dialogs.setShowRecoveryDialog(true);
      }
    }
  }, [isLoading, dialogs.recoveryDialogDismissed, hasStoredData, getFormData, dialogs]);

  return {
    saveFormData,
    getFormData,
    clearFormData,
    hasStoredData
  };
};
