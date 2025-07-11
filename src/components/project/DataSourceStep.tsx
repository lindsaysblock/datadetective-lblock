
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, File, CheckCircle, ArrowRight, ArrowLeft, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DataSourceStepProps {
  files: File[];
  uploading: boolean;
  parsing: boolean;
  parsedData: any[];
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => void;
  onRemoveFile: (index: number) => void;
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
  const hasValidData = parsedData && parsedData.length > 0;

  const handleAddAdditionalSource = () => {
    // Trigger file input for additional files
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

  const getUploadButtonText = () => {
    if (uploading || parsing) {
      return parsing ? 'Processing...' : 'Uploading...';
    }
    return files.length === 1 ? 'Upload File' : 'Upload Files';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Data</h2>
        <p className="text-gray-600">Upload your dataset to begin the analysis</p>
      </div>

      {/* Combined Upload and Connected Data Section */}
      <Card className={hasValidData ? "bg-green-50 border-green-200" : ""}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${hasValidData ? "text-green-700" : ""}`}>
            {hasValidData ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                Data Sources Connected!
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Data Upload
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasValidData && (
            <div className="flex flex-col space-y-4">
              <div>
                <Label htmlFor="file-upload">Choose Files (CSV, JSON, TXT)</Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".csv,.json,.txt"
                  onChange={onFileChange}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {files.length > 0 && (
            <div className="space-y-2">
              {!hasValidData && (
                <h4 className="font-medium text-gray-900">Selected Files:</h4>
              )}
              
              {hasValidData && (
                <p className="text-sm text-green-700 mb-4">
                  {parsedData.length} file{parsedData.length > 1 ? 's' : ''} uploaded successfully.
                </p>
              )}

              {/* File List */}
              {hasValidData ? (
                // Show processed data
                parsedData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">{data.name}</span>
                      <span className="text-xs text-green-600">
                        ({data.rows} rows × {data.columns} columns)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFile(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      ×
                    </Button>
                  </div>
                ))
              ) : (
                // Show selected files
                files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFile(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
              
              {!hasValidData && (
                <Button 
                  onClick={onFileUpload}
                  disabled={uploading || parsing}
                  className="w-full"
                >
                  {uploading || parsing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {getUploadButtonText()}
                    </div>
                  ) : (
                    getUploadButtonText()
                  )}
                </Button>
              )}

              {hasValidData && (
                <>
                  <p className="text-xs text-green-600">
                    Successfully processed and ready for analysis
                  </p>
                  
                  {/* Add Additional Source Button */}
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      onClick={handleAddAdditionalSource}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Additional Source
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Success Message */}
      {hasValidData && (
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-800 font-medium">
            ✅ Your data is ready! Continue to the next step to add context.
          </p>
        </div>
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
