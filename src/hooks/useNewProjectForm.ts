
import { useProjectFormState } from './useProjectFormState';
import { useProjectAnalysis } from './useProjectAnalysis';
import { useProjectAuth } from './useProjectAuth';
import { useProjectDialogs } from './useProjectDialogs';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import { useFormDataPersistence } from './useFormDataPersistence';
import { useProjectFormActions } from './useProjectFormActions';

export const useNewProjectForm = () => {
  console.log('useNewProjectForm hook called');
  
  const { isLoading } = useFormPersistence();
  
  const formState = useProjectFormState();
  const analysis = useProjectAnalysis();
  const auth = useProjectAuth();
  const dialogs = useProjectDialogs();

  console.log('Form state initialized:', formState);
  console.log('Current step from form state:', formState.step);

  const { saveFormData, getFormData, clearFormData, hasStoredData } = useFormDataPersistence(
    formState,
    dialogs,
    isLoading
  );

  const actions = useProjectFormActions(
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
    
    // Actions
    ...actions
  };

  console.log('useNewProjectForm returning:', Object.keys(returnValue));
  
  return returnValue;
};
