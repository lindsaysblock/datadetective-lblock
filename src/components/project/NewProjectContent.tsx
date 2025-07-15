
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import StepIndicator from './StepIndicator';
import ResearchQuestionStep from './ResearchQuestionStep';
import DataSourceStep from './DataSourceStep';
import BusinessContextStep from './BusinessContextStep';
import AnalysisSummaryStep from './AnalysisSummaryStep';
import { useNewProjectForm } from '@/hooks/useNewProjectForm';
import { useProjectFormActions } from '@/hooks/useProjectFormActions';
import { useAuth } from '@/hooks/useAuth';

interface NewProjectContentProps {
  onStartAnalysis: (educationalMode?: boolean, projectName?: string) => void;
}

const NewProjectContent: React.FC<NewProjectContentProps> = ({ onStartAnalysis }) => {
  const formData = useNewProjectForm();
  const { user } = useAuth();

  // Create mock objects for the project form actions
  const mockAnalysis = {
    startAnalysis: () => {},
    resetAnalysis: () => {}
  };

  const mockAuth = {
    user,
    setShowSignInModal: () => {}
  };

  const mockDialogs = {
    setShowProjectDialog: () => {},
    setRecoveryDialogDismissed: () => {}
  };

  const mockPersistence = {
    saveFormData: () => {},
    clearFormData: () => {},
    getFormData: () => ({})
  };

  const projectFormActions = useProjectFormActions(
    formData,
    mockAnalysis,
    mockAuth,
    mockDialogs,
    mockPersistence.saveFormData,
    mockPersistence.clearFormData,
    mockPersistence.getFormData
  );

  console.log('NewProjectContent formData:', {
    step: formData.step,
    researchQuestion: formData.researchQuestion,
    hasResearchQuestion: !!formData.researchQuestion,
    researchQuestionLength: formData.researchQuestion?.length || 0
  });

  const handleStartAnalysisWrapper = async (educationalMode: boolean = false, projectName: string = '') => {
    console.log('NewProjectContent starting analysis:', { educationalMode, projectName });
    
    // Use the project form actions to handle the start analysis (which includes saving to history)
    await projectFormActions.handleStartAnalysisClick(educationalMode, projectName);
    
    // Then call the original onStartAnalysis
    onStartAnalysis(educationalMode, projectName);
  };

  const renderStepContent = () => {
    switch (formData.step) {
      case 1:
        return (
          <ResearchQuestionStep
            researchQuestion={formData.researchQuestion}
            setResearchQuestion={formData.setResearchQuestion}
            onNext={formData.nextStep}
          />
        );
      case 2:
        return (
          <DataSourceStep
            files={formData.files}
            uploading={formData.uploading}
            parsing={formData.parsing}
            parsedData={formData.parsedData}
            onFileChange={(event) => {
              const selectedFiles = event.target.files;
              if (selectedFiles && selectedFiles.length > 0) {
                Array.from(selectedFiles).forEach(file => {
                  formData.addFile(file);
                });
              }
            }}
            onFileUpload={formData.handleFileUpload}
            onRemoveFile={formData.removeFile}
            onColumnMapping={formData.setColumnMapping}
            onNext={formData.nextStep}
            onPrevious={formData.prevStep}
          />
        );
      case 3:
        return (
          <BusinessContextStep
            additionalContext={formData.additionalContext}
            setAdditionalContext={formData.setAdditionalContext}
            parsedData={formData.parsedData}
            columnMapping={formData.columnMapping}
            onColumnMapping={formData.setColumnMapping}
            onNext={formData.nextStep}
            onPrevious={formData.prevStep}
          />
        );
      case 4:
        return (
          <AnalysisSummaryStep
            researchQuestion={formData.researchQuestion}
            additionalContext={formData.additionalContext}
            parsedData={formData.parsedData}
            columnMapping={formData.columnMapping}
            analysisResults={formData.analysisResults}
            analysisCompleted={formData.analysisCompleted}
            isProcessingAnalysis={formData.isProcessingAnalysis}
            onStartAnalysis={handleStartAnalysisWrapper}
            onPrevious={formData.prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <StepIndicator currentStep={formData.step} />
      
      <Card className="mt-8">
        <CardContent className="p-8">
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewProjectContent;
