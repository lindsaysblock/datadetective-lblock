
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FileUploadSectionProps {
  files: File[];
  uploading: boolean;
  parsing: boolean;
  parsedData: any[];
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => void;
  onRemoveFile: (index: number) => void;
  onUploadComplete?: () => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  files,
  uploading,
  parsing,
  parsedData,
  onFileChange,
  onFileUpload,
  onRemoveFile,
  onUploadComplete
}) => {
  const hasData = parsedData && parsedData.length > 0;
  const isProcessing = uploading || parsing;

  const handleUpload = async () => {
    console.log('FileUploadSection handleUpload called with files:', files.length);
    if (files.length === 0) {
      console.log('No files to upload in FileUploadSection');
      return;
    }
    
    await onFileUpload();
    
    if (onUploadComplete && hasData) {
      onUploadComplete();
    }
  };

  const getFileStatus = (index: number) => {
    if (index < parsedData.length) return 'success';
    if (isProcessing) return 'processing';
    return 'pending';
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed');
    onFileChange(event);
  };

  return (
    <div className="space-y-4">
      {/* File Upload Area */}
      <Card className="border-dashed border-2 border-gray-300 hover:border-blue-400 transition-colors">
        <CardContent className="pt-6">
          <div className="text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload your data files</h3>
            <p className="text-gray-600 mb-4">
              Drag and drop files here, or click to select files
            </p>
            <input
              type="file"
              onChange={handleFileInputChange}
              multiple
              accept=".csv,.json,.xlsx,.xls,.txt"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Choose Files
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Supports CSV, JSON, Excel, and TXT files
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Selected Files with Status */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Selected Files:</h4>
          {files.map((file, index) => {
            const status = getFileStatus(index);
            return (
              <div key={`${file.name}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    {status === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {status === 'processing' && (
                      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {status === 'pending' && <File className="w-5 h-5 text-gray-400" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={status === 'success' ? 'default' : status === 'processing' ? 'secondary' : 'outline'}
                    className={
                      status === 'success' ? 'bg-green-100 text-green-800' :
                      status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }
                  >
                    {status === 'success' ? 'Uploaded' : status === 'processing' ? 'Processing' : 'Pending'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFile(index)}
                    disabled={isProcessing}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upload Processing Status */}
      {isProcessing && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <h4 className="font-medium text-blue-900">
                  {uploading ? 'Uploading files...' : 'Processing data...'}
                </h4>
                <p className="text-sm text-blue-700">
                  {uploading ? 'Please wait while we upload your files.' : 'Analyzing and parsing your data.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Button */}
      {files.length > 0 && !hasData && !isProcessing && (
        <Button
          onClick={handleUpload}
          disabled={isProcessing || files.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Process Files ({files.length})
        </Button>
      )}

      {/* Success State */}
      {hasData && !isProcessing && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-medium text-green-900">Files processed successfully!</h4>
                <p className="text-sm text-green-700">
                  {parsedData.length} file{parsedData.length !== 1 ? 's' : ''} ready for analysis
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FileUploadSection;
