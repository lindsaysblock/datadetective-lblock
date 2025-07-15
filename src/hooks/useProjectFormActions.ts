
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

  const saveProjectToHistory = async (projectName: string, researchQuestion: string, additionalContext: string, parsedData: any[]) => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      if (!auth.user) {
        throw new Error('User not authenticated');
      }

      // Save each file as a dataset in the database
      for (const data of parsedData) {
        const metadata = {
          columns: data.columns || [],
          sample_rows: data.rows?.slice(0, 10) || []
        };

        const summary = {
          projectName,
          researchQuestion,
          description: additionalContext,
          totalRows: data.summary?.totalRows || data.rowCount || 0,
          totalColumns: data.summary?.totalColumns || data.columns?.length || 0,
          ...data.summary
        };

        await supabase
          .from('datasets')
          .insert([{
            user_id: auth.user.id,
            name: projectName,
            original_filename: data.name || 'uploaded_file.csv',
            file_size: null,
            mime_type: data.name?.endsWith('.csv') ? 'text/csv' : 'application/json',
            metadata: metadata,
            summary: summary
          }]);
      }

      toast({
        title: "Project Saved",
        description: `"${projectName}" has been saved to your project history.`,
      });

      return true;
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save project to history",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleStartAnalysisClick = async (educationalMode: boolean = false, projectName: string = '') => {
    if (!auth.user) {
      auth.setShowSignInModal(true);
      return;
    }

    if (!projectName.trim()) {
      toast({
        title: "Project Name Required",
        description: "Please enter a project name before starting analysis.",
        variant: "destructive",
      });
      return;
    }

    // Save project to history first
    const projectSaved = await saveProjectToHistory(
      projectName, 
      formState.researchQuestion, 
      formState.additionalContext, 
      formState.parsedData
    );

    if (!projectSaved) {
      return; // Error already shown in saveProjectToHistory
    }

    // Start analysis
    analysis.startAnalysis(formState.researchQuestion, formState.additionalContext, educationalMode, formState.parsedData);
    
    // Show project naming dialog
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
