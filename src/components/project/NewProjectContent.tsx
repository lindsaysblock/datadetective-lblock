
import React from 'react';
import StepIndicator from '@/components/project/StepIndicator';
import ProjectHeader from '@/components/project/ProjectHeader';
import ResearchQuestionStep from '@/components/project/ResearchQuestionStep';
import DataSourceStep from '@/components/project/DataSourceStep';
import BusinessContextStep from '@/components/project/BusinessContextStep';
import AnalysisSummaryStep from '@/components/project/AnalysisSummaryStep';

interface NewProjectContentProps {
  step: number;
  researchQuestion: string;
  additionalContext: string;
  files: File[];
  uploading: boolean;
  parsing: boolean;
  parsedData: any;
  isProcessingAnalysis: boolean;
  setResearchQuestion: (question: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleFileUpload: () => void;
  removeFile: (index: number) => void;
  setAdditionalContext: (context: string) => void;
  handleStartAnalysisClick: (educationalMode?: boolean) => void;
}

const NewProjectContent: React.FC<NewProjectContentProps> = ({
  step,
  researchQuestion,
  additionalContext,
  files,
  uploading,
  parsing,
  parsedData,
  isProcessingAnalysis,
  setResearchQuestion,
  nextStep,
  prevStep,
  handleFileChange,
  handleFileUpload,
  removeFile,
  setAdditionalContext,
  handleStartAnalysisClick
}) => {
  const renderCurrentStep = () => {
    console.log('Rendering step:', step);
    
    switch (step) {
      case 1:
        console.log('Rendering ResearchQuestionStep');
        return (
          <ResearchQuestionStep
            researchQuestion={researchQuestion}
            setResearchQuestion={setResearchQuestion}
            onNext={nextStep}
          />
        );

      case 2:
        console.log('Rendering DataSourceStep');
        return (
          <DataSourceStep
            files={files}
            uploading={uploading}
            parsing={parsing}
            parsedData={parsedData}
            onFileChange={handleFileChange}
            onFileUpload={handleFileUpload}
            onRemoveFile={removeFile}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        );

      case 3:
        console.log('Rendering BusinessContextStep');
        return (
          <BusinessContextStep
            additionalContext={additionalContext}
            setAdditionalContext={setAdditionalContext}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        );

      case 4:
        console.log('Rendering AnalysisSummaryStep');
        return (
          <AnalysisSummaryStep
            researchQuestion={researchQuestion}
            files={files}
            additionalContext={additionalContext}
            isProcessingAnalysis={isProcessingAnalysis}
            onPrevious={prevStep}
            onStartAnalysis={handleStartAnalysisClick}
          />
        );

      default:
        console.log('Unknown step:', step);
        return (
          <div className="text-center p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unknown step: {step}</h2>
            <p className="text-gray-600">Please refresh the page or contact support.</p>
          </div>
        );
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      <ProjectHeader />
      <StepIndicator currentStep={step} />
      
      <div className="space-y-8">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default NewProjectContent;
