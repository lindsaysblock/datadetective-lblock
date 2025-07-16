/**
 * Project Form Component
 * Main form container with step-by-step workflow
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import StepIndicator from './StepIndicator';
import ResearchQuestionStep from './ResearchQuestionStep';
import DataSourceStep from './DataSourceStep';
import BusinessContextStep from './BusinessContextStep';
import AnalysisSummaryStep from './AnalysisSummaryStep';
import { SPACING, FORM_STEPS } from '@/constants/ui';

interface ProjectFormProps {
  formData: any;
  onStartAnalysis: (educationalMode?: boolean, projectName?: string) => void;
  isLoading?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ formData, onStartAnalysis, isLoading = false }) => {
  const progressPercentage = ((formData.step - 1) / 3) * 100;

  const renderCurrentStep = () => {
    switch (formData.step) {
      case FORM_STEPS.RESEARCH_QUESTION:
        return (
          <ResearchQuestionStep
            researchQuestion={formData.researchQuestion}
            setResearchQuestion={formData.setResearchQuestion}
            onNext={formData.nextStep}
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
            onFileChange={formData.onFileChange}
            onFileUpload={formData.handleFileUpload}
            onRemoveFile={formData.removeFile}
            onColumnMapping={formData.setColumnMapping}
            onNext={formData.nextStep}
            onPrevious={formData.prevStep}
          />
        );
      case FORM_STEPS.BUSINESS_CONTEXT:
        return (
          <BusinessContextStep
            additionalContext={formData.businessContext}
            setAdditionalContext={formData.setAdditionalContext}
            onNext={formData.nextStep}
            onPrevious={formData.prevStep}
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
            onStartAnalysis={onStartAnalysis}
            onPrevious={formData.prevStep}
            formData={formData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className={`mb-${SPACING.XL}`}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600">
            Step {formData.step} of 4
          </span>
          <span className="text-sm font-medium text-gray-600">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      {/* Step Indicator */}
      <StepIndicator currentStep={formData.step} />
      
      {/* Form Content */}
      <Card className={`mt-${SPACING.XL} shadow-lg border-0 bg-white/80 backdrop-blur-sm`}>
        <CardContent className={`p-${SPACING.XL}`}>
          {renderCurrentStep()}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectForm;