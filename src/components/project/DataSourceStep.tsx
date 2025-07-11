
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import DataSourceOptions from './steps/DataSourceOptions';
import ConnectedDataSummary from './steps/ConnectedDataSummary';
import LoadingState from './steps/LoadingState';
import { useDataSourceHandlers } from '@/hooks/useDataSourceHandlers';

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
  const [showAddSource, setShowAddSource] = React.useState(false);

  const {
    handleFileUpload,
    handleDataPaste,
    handleDatabaseConnect,
    handlePlatformConnect
  } = useDataSourceHandlers(onFileChange, onFileUpload, setShowAddSource);

  const handleAddAdditionalSource = () => {
    setShowAddSource(true);
  };

  const handleCancelAddSource = () => {
    setShowAddSource(false);
  };

  const handleNext = () => {
    if (!hasUploadedData) {
      // Don't allow proceeding without data
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 2: Upload Your Data</h2>
        <p className="text-gray-600">Upload your data files or connect to external sources</p>
      </div>

      {!hasUploadedData || showAddSource ? (
        <div className="space-y-4">
          {hasUploadedData && showAddSource && (
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelAddSource}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Back to Summary
              </Button>
              <h3 className="text-lg font-semibold text-gray-900">Add Additional Data Source</h3>
            </div>
          )}
          
          <DataSourceOptions
            onFileUpload={handleFileUpload}
            onDataPaste={handleDataPaste}
            onDatabaseConnect={handleDatabaseConnect}
            onPlatformConnect={handlePlatformConnect}
          />

          {!hasUploadedData && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800 text-sm">
                <strong>Data Required:</strong> You must upload a file, paste data, or connect a data source to proceed to the next step.
              </p>
            </div>
          )}
        </div>
      ) : (
        <ConnectedDataSummary
          parsedData={parsedData}
          onRemoveFile={onRemoveFile}
          onAddAdditionalSource={handleAddAdditionalSource}
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
