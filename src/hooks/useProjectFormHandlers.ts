
import { useToast } from '@/hooks/use-toast';
import { useDatasetPersistence } from '@/hooks/useDatasetPersistence';

export const useProjectFormHandlers = (
  formState: any,
  analysis: any,
  auth: any,
  dialogs: any,
  saveFormData: any,
  clearFormData: any,
  getFormData: any
) => {
  const { toast } = useToast();
  const { saveDataset } = useDatasetPersistence();

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
        const mockFiles = savedData.files.map((fileData: any) => 
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

  const handleStartAnalysisClick = (educationalMode: boolean = false) => {
    if (!auth.user) {
      auth.setShowSignInModal(true);
      return;
    }

    analysis.startAnalysis(formState.researchQuestion, formState.additionalContext, educationalMode, formState.parsedData);
    dialogs.setShowProjectDialog(true);
  };

  const handleProjectConfirm = async (projectName: string) => {
    console.log('Project named:', projectName);
    formState.setCurrentProjectName(projectName);
    
    // Save the project to the database
    try {
      if (formState.files && formState.files.length > 0) {
        // Use the first file's name as the filename
        const filename = formState.files[0].name;
        await saveDataset(filename, {
          columns: formState.parsedData[0]?.columns || [],
          rows: formState.parsedData || [],
          summary: {
            projectName: projectName,
            researchQuestion: formState.researchQuestion,
            additionalContext: formState.additionalContext,
            totalRows: formState.parsedData?.length || 0,
            description: formState.researchQuestion
          }
        });
        
        toast({
          title: "Project Saved",
          description: `${projectName} has been saved to your project history.`,
        });
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Save Failed",
        description: "Project could not be saved to history.",
        variant: "destructive",
      });
    }
  };

  const handleBackToProject = () => {
    analysis.resetAnalysis();
    formState.setCurrentProjectName('');
  };

  return {
    handleRestoreData,
    handleStartFresh,
    handleStartAnalysisClick,
    handleProjectConfirm,
    handleBackToProject
  };
};
