
/**
 * Data Upload Flow Component
 * Refactored to meet coding standards with proper constants and semantic styling
 */

import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import ResearchQuestionSection from './upload/ResearchQuestionSection';
import AdditionalContextSection from './upload/AdditionalContextSection';
import { AnalysisActionSection } from './upload/AnalysisActionSection';
import ProjectNamingDialog from './upload/ProjectNamingDialog';
import DataConnectionStep from './upload/DataConnectionStep';
import { SPACING, TIMEOUTS } from '@/constants/ui';

interface DataUploadFlowProps {
  file: File | null;
  uploading: boolean;
  parsing: boolean;
  parsedData: any;
  researchQuestion: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => void;
  onResearchQuestionChange: (value: string) => void;
  onStartAnalysis: (parsedData?: any) => void;
  onSaveDataset: () => void;
}

const DataUploadFlow: React.FC<DataUploadFlowProps> = ({
  file,
  uploading,
  parsing,
  parsedData,
  researchQuestion,
  onFileChange,
  onFileUpload,
  onResearchQuestionChange,
  onStartAnalysis
}) => {
  const [additionalContext, setAdditionalContext] = useState('');
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [isProcessingAnalysis, setIsProcessingAnalysis] = useState(false);

  const handleStartAnalysisClick = () => {
    setShowProjectDialog(true);
  };

  const handleProjectConfirm = (projectName: string) => {
    console.log('Starting analysis with project name:', projectName);
    console.log('Research question:', researchQuestion);
    console.log('Additional context:', additionalContext);
    console.log('Parsed data structure:', {
      hasParsedData: !!parsedData,
      dataKeys: parsedData ? Object.keys(parsedData) : [],
      rowsCount: parsedData?.rows?.length || 0,
      columnsCount: parsedData?.columns?.length || 0
    });
    
    setIsProcessingAnalysis(true);
    
    setTimeout(() => {
      setIsProcessingAnalysis(false);
      setShowProjectDialog(false);
      // Pass the complete context to analysis
      onStartAnalysis(parsedData);
    }, TIMEOUTS.MEDIUM);
  };

  return (
    <div className={`space-y-${SPACING.LG}`}>
      <ResearchQuestionSection
        researchQuestion={researchQuestion}
        onResearchQuestionChange={onResearchQuestionChange}
      />

      <DataConnectionStep
        file={file}
        uploading={uploading}
        parsing={parsing}
        onFileChange={onFileChange}
        onFileUpload={onFileUpload}
      />

      <Separator />
      <AdditionalContextSection
        additionalContext={additionalContext}
        onAdditionalContextChange={setAdditionalContext}
      />

      <Separator />
      <AnalysisActionSection
        researchQuestion={researchQuestion}
        setResearchQuestion={onResearchQuestionChange}
        parsedData={parsedData}
        onStartAnalysis={handleStartAnalysisClick}
      />

      <ProjectNamingDialog
        open={showProjectDialog}
        onOpenChange={setShowProjectDialog}
        onConfirm={handleProjectConfirm}
        isProcessing={isProcessingAnalysis}
      />
    </div>
  );
};

export default DataUploadFlow;
