
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, File, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Data</h2>
        <p className="text-gray-600">Upload your dataset to begin the analysis</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Data Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

            {files.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Selected Files:</h4>
                {files.map((file, index) => (
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
                ))}
                
                <Button 
                  onClick={onFileUpload}
                  disabled={uploading || parsing}
                  className="w-full"
                >
                  {uploading || parsing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {parsing ? 'Processing...' : 'Uploading...'}
                    </div>
                  ) : (
                    'Process Files'
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Data Preview */}
      {hasValidData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Data Successfully Processed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {parsedData.map((data, index) => (
                <div key={index} className="border rounded-lg p-4 bg-green-50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{data.name}</h4>
                    <div className="text-sm text-gray-600">
                      {data.rows} rows × {data.columns} columns
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Successfully processed and ready for analysis
                  </p>
                </div>
              ))}
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-medium">
                  ✅ Your data is ready! Continue to the next step to add context.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
