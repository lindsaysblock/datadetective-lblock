
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, File, X, CheckCircle } from 'lucide-react';

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

  const handleUpload = async () => {
    await onFileUpload();
    if (onUploadComplete) {
      onUploadComplete();
    }
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
              onChange={onFileChange}
              multiple
              accept=".csv,.json,.xlsx,.xls"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              Choose Files
            </label>
            <p className="text-xs text-gray-500 mt-2">
              Supports CSV, JSON, and Excel files
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Selected Files:</h4>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <File className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFile(index)}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && !hasData && (
        <Button
          onClick={handleUpload}
          disabled={uploading || parsing}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {uploading ? 'Uploading...' : parsing ? 'Processing...' : 'Process Files'}
        </Button>
      )}

      {/* Success State */}
      {hasData && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-medium text-green-900">Files processed successfully!</h4>
                <p className="text-sm text-green-700">
                  {parsedData.length} file{parsedData.length > 1 ? 's' : ''} ready for analysis
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
