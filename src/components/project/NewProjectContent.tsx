
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
    hasData: !!(formData.parsedData && formData.parsedData.length > 0)
  });

  const handleStartAnalysisWrapper = async (educationalMode: boolean = false, projectName: string = '') => {
    console.log('NewProjectContent starting analysis:', { educationalMode, projectName });
    
    try {
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

      if (!formData.uploadedData && (!formData.parsedData || formData.parsedData.length === 0)) {
        toast({
          title: "Data Required",
          description: "Please upload data files before starting analysis.",
          variant: "destructive",
        });
        return;
      }

      console.log('Validation passed, saving analysis project with enhanced metadata');
      
      // Save the complete analysis project with enhanced metadata
      const savedProject = await saveAnalysisProject(
        projectName,
        formData.researchQuestion,
        formData.businessContext || '',
        formData.uploadedData || formData.parsedData
      );

      console.log('Project saved successfully:', savedProject?.id);

      // Show success message
      toast({
        title: "Analysis Starting",
        description: `Project "${projectName}" saved successfully. Starting analysis...`,
      });

      // Now start the analysis
      onStartAnalysis(educationalMode, projectName);

    } catch (error) {
      console.error('Error in project validation/saving:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      toast({
        title: "Error Starting Analysis",
        description: `Failed to start analysis: ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    switch (formData.step) {
      case 1:
        return (
          <ResearchQuestionStep
            researchQuestion={formData.researchQuestion || ''}
            setResearchQuestion={(value) => formData.setResearchQuestion?.(value)}
            onNext={() => formData.nextStep?.()}
          />
        );
      case 2:
        return (
          <DataSourceStep
            files={formData.files || []}
            uploading={formData.uploading || false}
            parsing={formData.parsing || false}
            parsedData={formData.parsedData || formData.uploadedData || []}
            onFileChange={(event) => {
              const selectedFiles = event.target.files;
              if (selectedFiles && selectedFiles.length > 0 && formData.addFile) {
                Array.from(selectedFiles).forEach(file => {
                  formData.addFile(file);
                });
              }
            }}
            onFileUpload={formData.handleFileUpload}
            onRemoveFile={formData.removeFile}
            onColumnMapping={formData.setColumnMapping}
            onNext={() => formData.nextStep?.()}
            onPrevious={() => formData.prevStep?.()}
          />
        );
      case 3:
        return (
          <BusinessContextStep
            additionalContext={formData.businessContext || ''}
            setAdditionalContext={(value) => formData.setAdditionalContext?.(value)}
            parsedData={formData.parsedData || formData.uploadedData || []}
            columnMapping={formData.columnMapping || {}}
            onColumnMapping={formData.setColumnMapping}
            onNext={() => formData.nextStep?.()}
            onPrevious={() => formData.prevStep?.()}
          />
        );
      case 4:
        return (
          <AnalysisSummaryStep
            researchQuestion={formData.researchQuestion || ''}
            additionalContext={formData.businessContext || ''}
            parsedData={formData.parsedData || formData.uploadedData || []}
            columnMapping={formData.columnMapping || {}}
            analysisResults={formData.analysisResults}
            analysisCompleted={formData.analysisCompleted || false}
            isProcessingAnalysis={formData.isProcessingAnalysis || false}
            onStartAnalysis={handleStartAnalysisWrapper}
            onPrevious={() => formData.prevStep?.()}
            formData={formData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <StepIndicator currentStep={formData.step || 1} />
      
      <Card className="mt-8">
        <CardContent className="p-8">
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewProjectContent;
