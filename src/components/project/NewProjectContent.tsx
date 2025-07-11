
import React from 'react';
import { DataAnalysisContext, ColumnMapping } from '@/types/data';
import StepIndicator from './StepIndicator';
import ResearchQuestionStep from './ResearchQuestionStep';
import DataSourceStep from './DataSourceStep';
import BusinessContextStep from './BusinessContextStep';
import AnalysisSummaryStep from './AnalysisSummaryStep';
import { useNewProjectForm } from '@/hooks/useNewProjectForm';

interface NewProjectContentProps {
  onStartAnalysis: (researchQuestion: string, additionalContext: string, educational: boolean, parsedData?: any, columnMapping?: any) => Promise<void>;
}

const NewProjectContent: React.FC<NewProjectContentProps> = ({ onStartAnalysis }) => {
  const formData = useNewProjectForm();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    selectedFiles.forEach(file => formData.addFile(file));
  };

  const handleStartAnalysis = async (educational: boolean = false) => {
    console.log('Starting analysis with:', {
      researchQuestion: formData.researchQuestion,
      additionalContext: formData.additionalContext,
      educational,
      parsedData: formData.parsedData,
      columnMapping: formData.columnMapping
    });
    
    await onStartAnalysis(
      formData.researchQuestion,
      formData.additionalContext,
      educational,
      formData.parsedData,
      formData.columnMapping
    );
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
            parsedData={formData.parsedData ? [formData.parsedData] : []}
            columnMapping={formData.columnMapping}
            onFileChange={handleFileChange}
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
            parsedData={formData.parsedData ? [formData.parsedData] : []}
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
            parsedData={formData.parsedData ? [formData.parsedData] : []}
            columnMapping={formData.columnMapping}
            analysisResults={formData.analysisResults}
            analysisCompleted={formData.analysisCompleted}
            isProcessingAnalysis={formData.isProcessingAnalysis}
            onStartAnalysis={handleStartAnalysis}
            onPrevious={formData.prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <StepIndicator currentStep={formData.step} />
      {renderStepContent()}
    </div>
  );
};

export default NewProjectContent;
