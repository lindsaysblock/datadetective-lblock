
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import FileUploadSection from './upload/FileUploadSection';
import ResearchQuestionSection from './upload/ResearchQuestionSection';
import AdditionalContextSection from './upload/AdditionalContextSection';
import { AnalysisActionSection } from './upload/AnalysisActionSection';
import ProjectNamingDialog from './upload/ProjectNamingDialog';
import { Plus } from 'lucide-react';

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

  console.log('DataUploadFlow render:', { parsedData: !!parsedData, file: !!file, uploading, parsing });

  return (
    <div className="space-y-6">
      {/* Step 1: Research Question */}
      <ResearchQuestionSection
        researchQuestion={researchQuestion}
        onResearchQuestionChange={onResearchQuestionChange}
      />

      {/* Step 2: Connect Your Data */}
      <Separator />
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
            2
          </div>
          <Plus className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Connect Your Data</h3>
        </div>
        <FileUploadSection
          file={file}
          uploading={uploading}
          parsing={parsing}
          onFileChange={handleFileChangeWithTextSupport}
          onFileUpload={onFileUpload}
        />
      </div>

      {/* Step 3: Additional Context - Always show */}
      <Separator />
      <AdditionalContextSection
        additionalContext={additionalContext}
        onAdditionalContextChange={setAdditionalContext}
      />

      {/* Step 4: Analysis Action - Always show */}
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
