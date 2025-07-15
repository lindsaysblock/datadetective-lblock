
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import DataSourceOptions from './steps/DataSourceOptions';
import ConnectedDataSection from './steps/ConnectedDataSection';
import { useDataSourceHandlers } from '@/hooks/useDataSourceHandlers';

interface DataSourceStepProps {
  files: File[];
  uploading: boolean;
  parsing: boolean;
  parsedData: any[];
  processedFiles?: any[];
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
  processedFiles = [],
  onFileChange,
  onFileUpload,
  onRemoveFile,
  onNext,
  onPrevious
}) => {
  const [showAddMore, setShowAddMore] = React.useState(false);

  // Check if we have successfully parsed data
  const hasValidData = parsedData && parsedData.length > 0 && parsedData.some(data => 
    data && (data.rows?.length > 0 || data.summary?.totalRows > 0 || data.rowCount > 0)
  );

  console.log('DataSourceStep validation:', {
    filesCount: files?.length || 0,
    parsedDataCount: parsedData?.length || 0,
    hasValidData,
    uploading,
    parsing,
    showAddMore,
    parsedDataDetails: parsedData?.map(data => ({
      rows: data?.rows?.length || 0,
      totalRows: data?.summary?.totalRows || data?.rowCount || 0,
      name: data?.name
    }))
  });

  const dataSourceHandlers = useDataSourceHandlers(
    onFileChange,
    onFileUpload,
    setShowAddMore
  );

  const handleAddMoreData = () => {
    setShowAddMore(true);
  };

  const handleNext = () => {
    if (!hasValidData) {
      console.log('Cannot proceed - no valid data available');
      return;
    }
    console.log('Proceeding to next step with valid data');
    onNext();
  };

  // Auto-trigger upload when files are selected but not yet processed
  React.useEffect(() => {
    if (files && files.length > 0 && !uploading && !parsing && !hasValidData) {
      console.log('Auto-triggering upload for selected files');
      const timer = setTimeout(() => {
        onFileUpload();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [files, uploading, parsing, hasValidData, onFileUpload]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 2: Connect Your Data</h2>
        <p className="text-gray-600">Upload files, paste data, or connect to your existing data sources</p>
      </div>

      {/* Show existing data if available */}
      {hasValidData && (
        <div className="space-y-6">
          <ConnectedDataSection
            parsedData={parsedData}
            processedFiles={processedFiles}
            files={files}
            onRemoveFile={onRemoveFile}
            onAddMore={handleAddMoreData}
          />
          
          {!showAddMore && (
            <Card className="border-dashed border-2 border-blue-300 bg-blue-50">
              <CardContent className="p-6 text-center">
                <Button
                  onClick={handleAddMoreData}
                  variant="outline"
                  className="flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add More Data Sources
                </Button>
                <p className="text-sm text-blue-600 mt-2">
                  You can combine multiple data sources for richer analysis
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Show data source options if no data OR if user wants to add more */}
      {(!hasValidData || showAddMore) && (
        <div className="space-y-6">
          {showAddMore && (
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Additional Data Source</h3>
              <Button
                variant="ghost"
                onClick={() => setShowAddMore(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </Button>
            </div>
          )}
          
          <DataSourceOptions
            onFileUpload={dataSourceHandlers.handleFileUpload}
            onDataPaste={dataSourceHandlers.handleDataPaste}
            onDatabaseConnect={dataSourceHandlers.handleDatabaseConnect}
            onPlatformConnect={dataSourceHandlers.handlePlatformConnect}
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

          {/* Show selected files info - ONLY if files are selected but not yet processed */}
          {files && files.length > 0 && !uploading && !parsing && !hasValidData && (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-gray-900 mb-2">Selected Files:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span>{file.name}</span>
                      <span className="text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={onFileUpload}
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700"
                >
                  Process {files.length} File{files.length !== 1 ? 's' : ''}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Help Text */}
          {!hasValidData && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Need help?</strong> You can upload files (CSV, Excel, JSON), paste your data directly, 
                or connect to platforms like Amplitude, Snowflake, Looker, and more. 
                Our AI will automatically detect data types and suggest the best analysis approaches.
              </p>
            </div>
          )}
        </div>
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
          disabled={!hasValidData}
          className={hasValidData ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}
        >
          {hasValidData ? 'Next: Add Context' : 'Process Data to Continue'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default DataSourceStep;
