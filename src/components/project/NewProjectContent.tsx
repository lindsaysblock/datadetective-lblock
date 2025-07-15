
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import StepIndicator from './StepIndicator';
import ResearchQuestionStep from './ResearchQuestionStep';
import DataSourceStep from './DataSourceStep';
import BusinessContextStep from './BusinessContextStep';
import AnalysisSummaryStep from './AnalysisSummaryStep';
import { useNewProjectForm } from '@/hooks/useNewProjectForm';
import { useAuth } from '@/hooks/useAuth';
import { useDatasetPersistence } from '@/hooks/useDatasetPersistence';
import { useToast } from '@/hooks/use-toast';

interface NewProjectContentProps {
  onStartAnalysis: (educationalMode?: boolean, projectName?: string) => void;
}

const NewProjectContent: React.FC<NewProjectContentProps> = ({ onStartAnalysis }) => {
  const formData = useNewProjectForm();
  const { user } = useAuth();
  const { saveAnalysisProject } = useDatasetPersistence();
  const { toast } = useToast();

  console.log('NewProjectContent formData:', {
    step: formData.step,
    researchQuestion: formData.researchQuestion,
    hasResearchQuestion: !!formData.researchQuestion,
    researchQuestionLength: formData.researchQuestion?.length || 0
  });

  const handleStartAnalysisWrapper = async (educationalMode: boolean = false, projectName: string = '') => {
    console.log('NewProjectContent starting analysis:', { educationalMode, projectName });
    
    // Validate required fields
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to start analysis.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.researchQuestion?.trim()) {
      toast({
        title: "Research Question Required",
        description: "Please enter a research question before starting analysis.",
        variant: "destructive",
      });
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

    if (!formData.parsedData || formData.parsedData.length === 0) {
      toast({
        title: "Data Required",
        description: "Please upload data files before starting analysis.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Save the complete analysis project with enhanced metadata
      console.log('Saving analysis project with enhanced metadata');
      
      await saveAnalysisProject(
        projectName,
        formData.researchQuestion,
        formData.additionalContext || '',
        formData.parsedData
      );

      console.log('Project saved successfully, starting analysis');

      // Now start the analysis
      onStartAnalysis(educationalMode, projectName);

    } catch (error) {
      console.error('Error in project validation/saving:', error);
      toast({
        title: "Error",
        description: "An error occurred while processing your request. Please try again.",
        variant: "destructive",
      });
    }
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
