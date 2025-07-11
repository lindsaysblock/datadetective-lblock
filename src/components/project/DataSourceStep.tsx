
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import ColumnIdentificationStep, { ColumnMapping } from '../data/ColumnIdentificationStep';
import FileUploadSection from './steps/FileUploadSection';
import ConnectedDataSection from './steps/ConnectedDataSection';

interface DataSourceStepProps {
  files: File[];
  uploading: boolean;
  parsing: boolean;
  parsedData: any[];
  columnMapping: ColumnMapping;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => void;
  onRemoveFile: (index: number) => void;
  onColumnMapping: (mapping: ColumnMapping) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const DataSourceStep: React.FC<DataSourceStepProps> = ({
  files,
  uploading,
  parsing,
  parsedData,
  columnMapping,
  onFileChange,
  onFileUpload,
  onRemoveFile,
  onColumnMapping,
  onNext,
  onPrevious
}) => {
  const [showColumnIdentification, setShowColumnIdentification] = useState(false);
  const hasValidData = parsedData && parsedData.length > 0;

  const handleAddAdditionalSource = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = '.csv,.json,.txt';
    fileInput.onchange = (e) => {
      if (e.target && (e.target as HTMLInputElement).files) {
        const mockEvent = {
          target: e.target as HTMLInputElement,
          currentTarget: e.target as HTMLInputElement,
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
    fileInput.click();
  };

  const handleContinueToColumnId = () => {
    setShowColumnIdentification(true);
  };

  const handleColumnMappingComplete = (mapping: ColumnMapping) => {
    onColumnMapping(mapping);
  };

  const handleColumnIdNext = () => {
    setShowColumnIdentification(false);
    onNext();
  };

  const handleColumnIdPrevious = () => {
    setShowColumnIdentification(false);
  };

  // Show column identification step if data is uploaded and user clicked to identify columns
  if (showColumnIdentification && hasValidData) {
    return (
      <ColumnIdentificationStep
        parsedData={parsedData}
        onColumnMappingComplete={handleColumnMappingComplete}
        onNext={handleColumnIdNext}
        onPrevious={handleColumnIdPrevious}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Data</h2>
        <p className="text-gray-600">Upload your dataset to begin the analysis</p>
      </div>

      {hasValidData ? (
        <ConnectedDataSection
          parsedData={parsedData}
          onRemoveFile={onRemoveFile}
          onContinueToColumnId={handleContinueToColumnId}
          onAddAdditionalSource={handleAddAdditionalSource}
        />
      ) : (
        <FileUploadSection
          files={files}
          uploading={uploading}
          parsing={parsing}
          onFileChange={onFileChange}
          onFileUpload={onFileUpload}
          onRemoveFile={onRemoveFile}
          onAddAdditionalSource={handleAddAdditionalSource}
        />
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button 
          onClick={onNext}
          disabled={!hasValidData}
          className={hasValidData ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default DataSourceStep;
