
import React from 'react';
import { useDataUpload } from '@/hooks/useDataUpload';
import DataUploadFlow from './data/DataUploadFlow';

const DataUploadFlowWrapper: React.FC = () => {
  const {
    file,
    uploading,
    parsing,
    parsedData,
    researchQuestion,
    handleFileChange,
    handleFileUpload,
    handleResearchQuestionChange,
    handleStartAnalysis,
    handleSaveDataset
  } = useDataUpload();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Start Your Data Analysis Journey
          </h1>
          <p className="text-gray-600 mt-2">
            Upload your data and let AI help you discover insights
          </p>
        </div>
        
        <DataUploadFlow
          file={file}
          uploading={uploading}
          parsing={parsing}
          parsedData={parsedData}
          researchQuestion={researchQuestion}
          onFileChange={handleFileChange}
          onFileUpload={handleFileUpload}
          onResearchQuestionChange={handleResearchQuestionChange}
          onStartAnalysis={handleStartAnalysis}
          onSaveDataset={handleSaveDataset}
        />
      </div>
    </div>
  );
};

export default DataUploadFlowWrapper;
