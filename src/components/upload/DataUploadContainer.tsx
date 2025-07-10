
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useDataUpload } from '@/hooks/useDataUpload';
import DataUploadView from './DataUploadView';
import DataUploadFlow from '../data/DataUploadFlow';

const DataUploadContainer: React.FC = () => {
  const [showUploadFlow, setShowUploadFlow] = useState(false);
  const { toast } = useToast();
  const uploadHook = useDataUpload();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      uploadHook.handleFileChange(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (uploadHook.file) {
      try {
        await uploadHook.handleFileUpload(uploadHook.file);
        toast({
          title: "Upload Successful",
          description: "Your file has been processed successfully.",
        });
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "There was an error processing your file.",
          variant: "destructive",
        });
      }
    }
  };

  if (showUploadFlow) {
    return (
      <DataUploadFlow 
        file={uploadHook.file}
        uploading={uploadHook.uploading}
        parsing={false}
        parsedData={uploadHook.parsedData}
        researchQuestion={uploadHook.researchQuestion}
        onFileChange={handleFileSelect}
        onFileUpload={handleUpload}
        onResearchQuestionChange={uploadHook.handleResearchQuestionChange}
        onStartAnalysis={uploadHook.handleStartAnalysis}
        onSaveDataset={uploadHook.handleSaveDataset}
      />
    );
  }

  return (
    <DataUploadView
      onStartUpload={() => setShowUploadFlow(true)}
      uploadError={uploadHook.uploadError}
      onClearError={uploadHook.resetUpload}
      parsedData={uploadHook.parsedData}
    />
  );
};

export default DataUploadContainer;
