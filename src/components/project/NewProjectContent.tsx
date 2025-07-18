
/**
 * New Project Content Component
 * Orchestrates the new project creation flow with proper error handling and validation
 */

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDatasetPersistence } from '@/hooks/useDatasetPersistence';
import { useToast } from '@/hooks/use-toast';
import { ResearchQuestionStep, DataSourceStep } from './QuickFormSteps';
import BusinessContextStep from './BusinessContextStep';
import AnalysisSummaryStep from './AnalysisSummaryStep';
import StepIndicator from './StepIndicator';
import { SPACING, FORM_STEPS } from '@/constants/ui';

interface NewProjectContentProps {
  formData: any;
  actions: any;
  onStartAnalysis: (educationalMode?: boolean, projectName?: string) => void;
  isLoading?: boolean;
}

const NewProjectContent: React.FC<NewProjectContentProps> = ({ formData, actions, onStartAnalysis, isLoading = false }) => {
  const { user } = useAuth();
  const { saveAnalysisProject } = useDatasetPersistence();
  const { toast } = useToast();

  console.log('🔍 NewProjectContent - DEBUGGING RENDER');
  console.log('🔍 Current step:', formData.step);
  console.log('🔍 Research question:', formData.researchQuestion);
  console.log('🔍 Component should ONLY render step indicator and current step form');
  
  const handleStartAnalysisWrapper = async (educationalMode: boolean = false, projectName: string = '') => {
    console.log('NewProjectContent starting analysis:', { educationalMode, projectName });
    
    try {
      // Validation logic
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
      case FORM_STEPS.RESEARCH_QUESTION:
        return (
          <ResearchQuestionStep
            researchQuestion={formData.researchQuestion}
            setResearchQuestion={actions.setResearchQuestion}
            onNext={actions.nextStep}
          />
        );
      case FORM_STEPS.DATA_SOURCE:
        return (
          <DataSourceStep
            files={formData.files}
            uploading={formData.uploading}
            parsing={formData.parsing}
            parsedData={formData.parsedData}
            processedFiles={formData.processedFiles}
            columnMapping={formData.columnMapping}
            onFileChange={actions.onFileChange}
            onFileUpload={actions.handleFileUpload}
            onRemoveFile={actions.removeFile}
            onColumnMapping={actions.setColumnMapping}
            onNext={actions.nextStep}
            onPrevious={actions.prevStep}
          />
        );
      case FORM_STEPS.BUSINESS_CONTEXT:
        return (
          <BusinessContextStep
            additionalContext={formData.businessContext}
            setAdditionalContext={actions.setAdditionalContext}
            parsedData={formData.parsedData}
            columnMapping={formData.columnMapping}
            onColumnMapping={actions.setColumnMapping}
            onNext={actions.nextStep}
            onPrevious={actions.prevStep}
          />
        );
      case FORM_STEPS.ANALYSIS_SUMMARY:
        return (
          <AnalysisSummaryStep
            researchQuestion={formData.researchQuestion}
            additionalContext={formData.businessContext}
            parsedData={formData.parsedData}
            columnMapping={formData.columnMapping}
            analysisResults={formData.analysisResults}
            analysisCompleted={formData.analysisCompleted}
            isProcessingAnalysis={formData.isProcessingAnalysis || isLoading}
            onStartAnalysis={handleStartAnalysisWrapper}
            onPrevious={actions.prevStep}
            formData={{ ...formData, actions }}
            projectName={formData.projectName}
            onProjectNameChange={actions.setProjectName}
          />
        );
      default:
        return null;
    }
  };

  console.log('🔍 About to render - checking what will be displayed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className={`container mx-auto px-${SPACING.MD} py-${SPACING.XL}`}>
        <div className="max-w-4xl mx-auto">
          {/* Step Indicator */}
          <StepIndicator currentStep={formData.step} />
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Step {formData.step} of 4
              </span>
              <span className="text-sm text-gray-600">
                {Math.round((formData.step / 4) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(formData.step / 4) * 100}%` }}
              />
            </div>
          </div>
          
          <div className={`bg-white rounded-xl shadow-lg p-${SPACING.XL}`}>
            {renderCurrentStep()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProjectContent;
