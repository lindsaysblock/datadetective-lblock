
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import StepIndicator from './StepIndicator';
import ResearchQuestionStep from './ResearchQuestionStep';
import DataSourceStep from './DataSourceStep';
import BusinessContextStep from './BusinessContextStep';
import AnalysisSummaryStep from './AnalysisSummaryStep';
import { useAuth } from '@/hooks/useAuth';
import { useDatasetPersistence } from '@/hooks/useDatasetPersistence';
import { useToast } from '@/hooks/use-toast';

interface NewProjectContentProps {
  formData: any;
  onStartAnalysis: (educationalMode?: boolean, projectName?: string) => void;
}

const NewProjectContent: React.FC<NewProjectContentProps> = ({ formData, onStartAnalysis }) => {
  const { user } = useAuth();
  const { saveAnalysisProject } = useDatasetPersistence();
  const { toast } = useToast();

  console.log('NewProjectContent formData:', {
    step: formData.step,
    researchQuestion: formData.researchQuestion,
    hasResearchQuestion: !!formData.researchQuestion,
    researchQuestionLength: formData.researchQuestion?.length || 0,
    projectName: formData.projectName,
    hasData: !!(formData.parsedData && formData.parsedData.length > 0),
    processedFilesCount: formData.processedFiles?.length || 0,
    uploading: formData.uploading,
    parsing: formData.parsing,
    setResearchQuestionType: typeof formData.setResearchQuestion
  });

  const handleStartAnalysisWrapper = async (educationalMode: boolean = false, projectName: string = '') => {
    console.log('NewProjectContent starting analysis:', { educationalMode, projectName });
    
    try {
      // Validate required fields
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

      if (!formData.uploadedData && (!formData.parsedData || formData.parsedData.length === 0)) {
        toast({
          title: "Data Required",
          description: "Please upload data files before starting analysis.",
          variant: "destructive",
        });
        return;
      }

      // Basic data validation
      if (formData.parsedData && formData.parsedData.length > 0) {
        const hasValidData = formData.parsedData.some((data: any) => 
          data && (data.rows > 0 || data.rowCount > 0)
        );

        if (!hasValidData) {
          toast({
            title: "Invalid Data",
            description: "The uploaded data appears to be empty. Please check your files.",
            variant: "destructive",
          });
          return;
        }
      }

      console.log('Validation passed, starting analysis');
      
      // Save project if user is authenticated
      if (user) {
        try {
          const savedProject = await saveAnalysisProject(
            projectName,
            formData.researchQuestion,
            formData.businessContext || '',
            formData.uploadedData || formData.parsedData
          );
          
          console.log('Project saved successfully:', savedProject);
        } catch (saveError) {
          console.error('Failed to save project:', saveError);
          // Continue with analysis even if save fails
        }
      }

      // Start the analysis
      onStartAnalysis(educationalMode, projectName);
      
    } catch (error) {
      console.error('Error starting analysis:', error);
      toast({
        title: "Analysis Failed to Start",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
    }
  };

  const renderCurrentStep = () => {
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
            processedFiles={formData.processedFiles}
            columnMapping={formData.columnMapping}
            onFileChange={formData.onFileChange}
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
            additionalContext={formData.businessContext}
            setAdditionalContext={formData.setAdditionalContext}
            onNext={formData.nextStep}
            onPrevious={formData.prevStep}
          />
        );
      case 4:
        return (
          <AnalysisSummaryStep
            researchQuestion={formData.researchQuestion}
            additionalContext={formData.businessContext}
            parsedData={formData.parsedData}
            columnMapping={formData.columnMapping}
            analysisResults={formData.analysisResults}
            analysisCompleted={formData.analysisCompleted}
            isProcessingAnalysis={formData.isProcessingAnalysis}
            onStartAnalysis={handleStartAnalysisWrapper}
            onPrevious={formData.prevStep}
            formData={formData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <StepIndicator currentStep={formData.step} />
        
        <Card className="mt-8">
          <CardContent className="p-8">
            {renderCurrentStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewProjectContent;
