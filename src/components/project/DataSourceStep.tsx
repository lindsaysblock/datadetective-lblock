
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import DataSourceOptions from './steps/DataSourceOptions';
import ConnectedDataSection from './steps/ConnectedDataSection';

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

  const handleFileUpload = async (uploadedFiles: File[]) => {
    console.log('DataSourceStep handleFileUpload called with files:', uploadedFiles);
    
    if (uploadedFiles.length === 0) {
      console.log('No files provided, returning early');
      return;
    }

    try {
      // Create a proper FileList-like object
      const fileList = Object.assign(uploadedFiles, {
        item: (index: number) => uploadedFiles[index] || null,
        length: uploadedFiles.length
      }) as FileList;

      // Create a proper mock event that mimics a real file input change
      const mockEvent = {
        target: {
          files: fileList,
          value: '',
          type: 'file'
        },
        currentTarget: {
          files: fileList,
          value: '',
          type: 'file'
        },
        preventDefault: () => {},
        stopPropagation: () => {},
        nativeEvent: {} as Event,
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

      console.log('Calling onFileChange with mock event for files:', uploadedFiles.map(f => f.name));
      
      // Call the file change handler immediately
      onFileChange(mockEvent);
      
      // Trigger file upload processing
      console.log('Triggering onFileUpload');
      onFileUpload();
      
    } catch (error) {
      console.error('Error processing files in DataSourceStep:', error);
    }
  };

  const handleDataPaste = async (data: string) => {
    console.log('DataSourceStep handleDataPaste called with data length:', data.length);
    try {
      // Create a mock CSV file from pasted data
      const mockFile = new File([data], 'pasted-data.csv', { type: 'text/csv' });
      await handleFileUpload([mockFile]);
    } catch (error) {
      console.error('Error processing pasted data:', error);
    }
  };

  const handleDatabaseConnect = async (config: any) => {
    console.log('DataSourceStep handleDatabaseConnect called with config:', config);
    try {
      // Create a mock file to represent database connection
      const mockFile = new File(['database'], 'database-connection', { type: 'application/json' });
      await handleFileUpload([mockFile]);
    } catch (error) {
      console.error('Database connection error:', error);
    }
  };

  const handlePlatformConnect = async (platform: string, config: any) => {
    console.log('DataSourceStep handlePlatformConnect called for platform:', platform);
    try {
      // Create a mock file to represent platform connection
      const mockFile = new File(['platform'], `${platform}-connection`, { type: 'application/json' });
      await handleFileUpload([mockFile]);
    } catch (error) {
      console.error('Platform connection error:', error);
    }
  };

  const handleNext = () => {
    if (!hasUploadedData) {
      console.log('No uploaded data, cannot proceed to next step');
      return;
    }
    console.log('Proceeding to next step with data:', parsedData);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 2: Connect Your Data</h2>
        <p className="text-gray-600">Upload files, paste data, or connect to your existing data sources</p>
      </div>

      {!hasUploadedData ? (
        <div className="space-y-6">
          <DataSourceOptions
            onFileUpload={handleFileUpload}
            onDataPaste={handleDataPaste}
            onDatabaseConnect={handleDatabaseConnect}
            onPlatformConnect={handlePlatformConnect}
          />

          {/* Processing State */}
          {(uploading || parsing) && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-blue-700 font-medium">
                  {uploading ? 'Uploading your data...' : 'Processing and analyzing...'}
                </p>
                <p className="text-blue-600 text-sm mt-2">
                  This may take a few moments depending on your data size
                </p>
              </CardContent>
            </Card>
          )}

          {/* Help Text */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              <strong>Need help?</strong> You can upload files (CSV, Excel, JSON), paste your data directly, 
              or connect to platforms like Amplitude, Snowflake, Looker, and more. 
              Our AI will automatically detect data types and suggest the best analysis approaches.
            </p>
          </div>
        </div>
      ) : (
        <ConnectedDataSection
          parsedData={parsedData}
          files={files}
          onRemoveFile={onRemoveFile}
          onAddMore={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.csv,.xlsx,.xls,.json';
            input.multiple = true;
            input.onchange = (e) => {
              const selectedFiles = Array.from((e.target as HTMLInputElement).files || []);
              if (selectedFiles.length > 0) {
                handleFileUpload(selectedFiles);
              }
            };
            input.click();
          }}
        />
      )}

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
          {hasUploadedData ? 'Next: Add Context' : 'Connect Data to Continue'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default DataSourceStep;
