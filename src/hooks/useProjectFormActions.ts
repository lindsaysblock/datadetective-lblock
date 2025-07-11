import { useToast } from '@/hooks/use-toast';

export const useProjectFormActions = (
  formState: any,
  analysis: any,
  auth: any,
  dialogs: any,
  saveFormData: any,
  clearFormData: any,
  getFormData: any
) => {
  const { toast } = useToast();

  const handleRestoreData = () => {
    console.log('handleRestoreData called');
    try {
      const savedData = getFormData();
      console.log('Restoring data:', savedData);
      
      formState.setResearchQuestion(savedData.researchQuestion || '');
      formState.setAdditionalContext(savedData.additionalContext || '');
      formState.setParsedData(savedData.parsedData || []);
      formState.setStep(savedData.currentStep || 1);
      
      if (savedData.files && savedData.files.length > 0) {
        const mockFiles = savedData.files.map(fileData => 
          new File([''], fileData.name, {
            type: fileData.type,
            lastModified: fileData.lastModified
          })
        );
        formState.setFiles(mockFiles);
      }
      
      dialogs.setShowRecoveryDialog(false);
      dialogs.setRecoveryDialogDismissed(true);
      
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
    dialogs.setRecoveryDialogDismissed(true);
    
    toast({
      title: "Starting Fresh",
      description: "Previous progress cleared. Starting with a clean slate.",
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      Array.from(selectedFiles).forEach(file => {
        formState.addFile(file);
      });
    }
  };

  const handleFileUpload = () => {
    formState.handleFileUpload();
  };

  const removeFile = (index: number) => {
    formState.removeFile(index);
  };

  const handleStartAnalysisClick = (educationalMode: boolean = false) => {
    if (!auth.user) {
      auth.setShowSignInModal(true);
      return;
    }

    // Start analysis immediately with educational mode
    analysis.startAnalysis(formState.researchQuestion, formState.additionalContext, educationalMode, formState.parsedData);
    
    // Show project naming dialog immediately (it will persist until analysis is complete)
    dialogs.setShowProjectDialog(true);
  };

  const handleProjectConfirm = (projectName: string) => {
    console.log('Project named:', projectName);
    formState.setCurrentProjectName(projectName);
    
    // Don't clear form data or navigate yet - wait for analysis completion
    // The dialog will handle the waiting state and progress display
  };

  const handleBackToProject = () => {
    analysis.resetAnalysis();
    formState.setCurrentProjectName('');
  };

  return {
    handleRestoreData,
    handleStartFresh,
    handleFileChange,
    handleFileUpload,
    removeFile,
    handleStartAnalysisClick,
    handleProjectConfirm,
    handleBackToProject
  };
};
