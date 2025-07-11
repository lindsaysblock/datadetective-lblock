
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

  const handleFileUpload = async () => {
    if (formData.files.length > 0) {
      await formData.handleFileUpload(formData.files[0]);
    }
  };

  const handleColumnMapping = (mapping: ColumnMapping) => {
    // Convert ColumnMapping to the format expected by the form hook
    const mappingRecord: Record<string, string> = {};
    
    if (mapping.userIdColumn) mappingRecord.userIdColumn = mapping.userIdColumn;
    if (mapping.timestampColumn) mappingRecord.timestampColumn = mapping.timestampColumn;
    if (mapping.eventColumn) mappingRecord.eventColumn = mapping.eventColumn;
    
    // Store arrays as JSON strings for the record format
    if (mapping.valueColumns?.length) {
      mappingRecord.valueColumns = JSON.stringify(mapping.valueColumns);
    }
    if (mapping.categoryColumns?.length) {
      mappingRecord.categoryColumns = JSON.stringify(mapping.categoryColumns);
    }
    
    formData.setColumnMapping(mappingRecord);
  };

  const convertRecordToColumnMapping = (record: Record<string, string>): ColumnMapping => {
    return {
      userIdColumn: record.userIdColumn,
      timestampColumn: record.timestampColumn,
      eventColumn: record.eventColumn,
      valueColumns: record.valueColumns ? JSON.parse(record.valueColumns) : [],
      categoryColumns: record.categoryColumns ? JSON.parse(record.categoryColumns) : []
    };
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
            columnMapping={convertRecordToColumnMapping(formData.columnMapping)}
            onFileChange={handleFileChange}
            onFileUpload={handleFileUpload}
            onRemoveFile={formData.removeFile}
            onColumnMapping={handleColumnMapping}
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
            columnMapping={convertRecordToColumnMapping(formData.columnMapping)}
            onColumnMapping={handleColumnMapping}
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
            columnMapping={convertRecordToColumnMapping(formData.columnMapping)}
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
