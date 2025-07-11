
import React from 'react';
import StepIndicator from './StepIndicator';
import ResearchQuestionStep from './ResearchQuestionStep';
import DataSourceStep from './DataSourceStep';
import BusinessContextStep from './BusinessContextStep';
import AnalysisSummaryStep from './AnalysisSummaryStep';
import { useProjectFormState } from '@/hooks/useProjectFormState';

interface NewProjectContentProps {
  onStartAnalysis: (researchQuestion: string, additionalContext: string, educational: boolean, parsedData?: any, columnMapping?: any) => void;
}

const NewProjectContent: React.FC<NewProjectContentProps> = ({ onStartAnalysis }) => {
  const {
    step,
    researchQuestion,
    additionalContext,
    files,
    uploading,
    parsing,
    parsedData,
    columnMapping,
    setResearchQuestion,
    setAdditionalContext,
    nextStep,
    prevStep,
    handleFileUpload,
    addFile,
    removeFile,
    setColumnMapping
  } = useProjectFormState();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    selectedFiles.forEach(file => addFile(file));
  };

  const handleStartAnalysis = (educational: boolean = false) => {
    console.log('Starting analysis with:', {
      researchQuestion,
      additionalContext,
      educational,
      parsedData,
      columnMapping
    });
    onStartAnalysis(researchQuestion, additionalContext, educational, parsedData, columnMapping);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <ResearchQuestionStep
            researchQuestion={researchQuestion}
            setResearchQuestion={setResearchQuestion}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <DataSourceStep
            files={files}
            uploading={uploading}
            parsing={parsing}
            parsedData={parsedData}
            columnMapping={columnMapping}
            onFileChange={handleFileChange}
            onFileUpload={handleFileUpload}
            onRemoveFile={removeFile}
            onColumnMapping={setColumnMapping}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        );
      case 3:
        return (
          <BusinessContextStep
            additionalContext={additionalContext}
            setAdditionalContext={setAdditionalContext}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        );
      case 4:
        return (
          <AnalysisSummaryStep
            researchQuestion={researchQuestion}
            additionalContext={additionalContext}
            parsedData={parsedData}
            columnMapping={columnMapping}
            onStartAnalysis={handleStartAnalysis}
            onPrevious={prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <StepIndicator currentStep={step} />
      {renderStepContent()}
    </div>
  );
};

export default NewProjectContent;
