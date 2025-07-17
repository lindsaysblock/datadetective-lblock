
/**
 * New Project Form Hook
 * Light orchestrator that combines focused form hooks
 */

import { useState } from 'react';
import { useFormValidation } from './useFormValidation';
import { useProjectFormData } from './useProjectFormData';
import { useProjectFormNavigation } from './useProjectFormNavigation';
import { useProjectFormActions } from './useProjectFormActions';

export { type FormData } from './useProjectFormData';

export const useNewProjectForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Core form data management
  const {
    formData,
    updateFormData,
    setProjectName,
    setResearchQuestion,
    setAdditionalContext,
    setColumnMapping,
    resetForm
  } = useProjectFormData();

  // Navigation
  const { nextStep, prevStep, goToStep } = useProjectFormNavigation(formData, updateFormData);

  // Complex actions (file handling, continue case)
  const {
    handleAddFile,
    handleRemoveFile,
    handleFileUpload,
    setContinueCaseData,
    onFileChange,
    processingState
  } = useProjectFormActions(formData, updateFormData, resetForm);

  // Validation
  const validationSchema = {
    projectName: { required: true, minLength: 3 },
    researchQuestion: { required: true, minLength: 10 }
  };
  const { validateForm } = useFormValidation(validationSchema);

  return {
    formData: {
      ...formData,
      uploading: processingState.uploading,
      parsing: processingState.parsing,
    },
    isLoading,
    error,
    actions: {
      updateFormData,
      nextStep,
      prevStep,
      goToStep,
      setProjectName,
      setResearchQuestion,
      setAdditionalContext,
      addFile: handleAddFile,
      removeFile: handleRemoveFile,
      setColumnMapping,
      onFileChange,
      handleFileUpload,
      setContinueCaseData,
      resetForm,
      validateFormData: (projectName: string) => validateForm({ 
        projectName, 
        researchQuestion: formData.researchQuestion 
      }),
    }
  };
};
