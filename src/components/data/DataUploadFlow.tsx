
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import FileUploadSection from './upload/FileUploadSection';
import ResearchQuestionSection from './upload/ResearchQuestionSection';
import AdditionalContextSection from './upload/AdditionalContextSection';
import AnalysisActionSection from './upload/AnalysisActionSection';
import ProjectNamingDialog from './upload/ProjectNamingDialog';

interface DataUploadFlowProps {
  file: File | null;
  uploading: boolean;
  parsing: boolean;
  parsedData: any;
  researchQuestion: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => void;
  onResearchQuestionChange: (value: string) => void;
  onStartAnalysis: () => void;
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
  onStartAnalysis,
  onSaveDataset
}) => {
  const [additionalContext, setAdditionalContext] = useState('');
  const [teachModeEnabled, setTeachModeEnabled] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [isProcessingAnalysis, setIsProcessingAnalysis] = useState(false);

  const handleFileChangeWithTextSupport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileChange(event);
      return;
    }

    // Handle text data input
    const textData = prompt('Paste your data here:');
    if (textData) {
      const textBlob = new Blob([textData], { type: 'text/plain' });
      const textFile = new File([textBlob], 'pasted-data.txt', { type: 'text/plain' });
      
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(textFile);
      
      const mockEvent = {
        target: {
          files: dataTransfer.files,
          value: '',
        } as HTMLInputElement,
        currentTarget: {} as HTMLInputElement,
        preventDefault: () => {},
        stopPropagation: () => {},
        nativeEvent: new Event('change'),
        isDefaultPrevented: () => false,
        isPropagationStopped: () => false,
        persist: () => {},
        bubbles: false,
        cancelable: false,
        defaultPrevented: false,
        eventPhase: 0,
        isTrusted: false,
        timeStamp: Date.now(),
        type: 'change'
      } as React.ChangeEvent<HTMLInputElement>;

      onFileChange(mockEvent);
    }
  };

  const handleStartAnalysisClick = () => {
    setShowProjectDialog(true);
  };

  const handleProjectConfirm = (projectName: string) => {
    console.log('Starting analysis with project name:', projectName);
    console.log('Teaching mode enabled:', teachModeEnabled);
    console.log('Research question:', researchQuestion);
    console.log('Additional context:', additionalContext);
    
    setIsProcessingAnalysis(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessingAnalysis(false);
      setShowProjectDialog(false);
      onStartAnalysis();
    }, 2000);
  };

  const isReadyToAnalyze = Boolean(parsedData && researchQuestion.trim());

  return (
    <div className="space-y-6">
      <FileUploadSection
        file={file}
        uploading={uploading}
        onFileChange={handleFileChangeWithTextSupport}
        onFileUpload={onFileUpload}
      />

      {(parsedData || uploading || parsing) && (
        <>
          <Separator />
          <ResearchQuestionSection
            researchQuestion={researchQuestion}
            onResearchQuestionChange={onResearchQuestionChange}
          />
        </>
      )}

      {parsedData && researchQuestion && (
        <>
          <Separator />
          <AdditionalContextSection
            additionalContext={additionalContext}
            onAdditionalContextChange={setAdditionalContext}
          />
        </>
      )}

      {parsedData && (
        <>
          <Separator />
          <AnalysisActionSection
            isReadyToAnalyze={isReadyToAnalyze}
            parsedData={parsedData}
            onStartAnalysis={handleStartAnalysisClick}
            onSaveDataset={onSaveDataset}
            teachModeEnabled={teachModeEnabled}
            onTeachModeToggle={setTeachModeEnabled}
          />
        </>
      )}

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
