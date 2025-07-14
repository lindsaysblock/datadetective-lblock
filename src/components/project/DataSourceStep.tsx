
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import FileUploadSection from './steps/FileUploadSection';
import ConnectedDataSummary from './steps/ConnectedDataSummary';
import LoadingState from './steps/LoadingState';

interface DataSourceStepProps {
  files: File[];
  uploading: boolean;
  parsing: boolean;
  parsedData: any[];
  columnMapping?: any;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => void;
  onRemoveFile: (index: number) => void;
  onColumnMapping: (mapping: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const DataSourceStep: React.FC<DataSourceStepProps> = ({
  files,
  uploading,
  parsing,
  parsedData,
  onFileChange,
  onFileUpload,
  onRemoveFile,
  onNext,
  onPrevious
}) => {
  const hasUploadedData = parsedData && parsedData.length > 0;

  const handleNext = () => {
    if (!hasUploadedData) {
      return;
    }
    onNext();
  };

  const handleUploadComplete = () => {
    console.log('Upload completed, data available:', parsedData?.length > 0);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 2: Upload Your Data</h2>
        <p className="text-gray-600">Upload your data files to begin analysis</p>
      </div>

      {!hasUploadedData ? (
        <div className="space-y-4">
          <FileUploadSection
            files={files}
            uploading={uploading}
            parsing={parsing}
            parsedData={parsedData}
            onFileChange={onFileChange}
            onFileUpload={onFileUpload}
            onRemoveFile={onRemoveFile}
            onUploadComplete={handleUploadComplete}
          />

          {!hasUploadedData && files.length === 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm">
                <strong>Data Required:</strong> You must upload files to proceed to the next step.
              </p>
            </div>
          )}
        </div>
      ) : (
        <ConnectedDataSummary
          parsedData={parsedData}
          onRemoveFile={onRemoveFile}
          onAddAdditionalSource={() => {
            // Reset to allow more uploads
            console.log('Add additional source clicked');
          }}
        />
      )}

      <LoadingState uploading={uploading} parsing={parsing} />

      <div className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          onClick={onPrevious}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button 
          onClick={handleNext}
          disabled={!hasUploadedData}
          className={hasUploadedData ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}
        >
          {hasUploadedData ? 'Next: Business Context' : 'Upload Data to Continue'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default DataSourceStep;
