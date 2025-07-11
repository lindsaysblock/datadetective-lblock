
import { useProjectFormState } from './useProjectFormState';
import { useDataAnalysis } from './useDataAnalysis';
import { useProjectAuth } from './useProjectAuth';
import { useProjectDialogs } from './useProjectDialogs';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useFormDataPersistence } from './useFormDataPersistence';
import { useProjectFormHandlers } from './useProjectFormHandlers';

export const useNewProjectForm = () => {
  console.log('useNewProjectForm hook called');
  
  const { isLoading } = useFormPersistence();
  
  const formState = useProjectFormState();
  const analysis = useDataAnalysis();
  const auth = useProjectAuth();
  const dialogs = useProjectDialogs();

  console.log('Form state initialized:', {
    step: formState.step,
    researchQuestion: formState.researchQuestion,
    files: formState.files?.length || 0,
    parsedData: formState.parsedData?.length || 0
  });

  const { saveFormData, getFormData, clearFormData } = useFormDataPersistence(
    formState,
    dialogs,
    isLoading
  );

  const handlers = useProjectFormHandlers(
    formState,
    analysis,
    auth,
    dialogs,
    saveFormData,
    clearFormData,
    getFormData
  );

  const returnValue = {
    // Form state
    ...formState,
    
    // Analysis state
    ...analysis,
    
    // Auth state
    ...auth,
    
    // Dialog state
    ...dialogs,
    
    // Handlers
    ...handlers
  };

  console.log('useNewProjectForm returning step:', returnValue.step);
  console.log('useNewProjectForm parsedData:', returnValue.parsedData?.length || 0);
  
  return returnValue;
};
