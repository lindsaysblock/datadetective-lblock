
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, File, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FileUploadSectionProps {
  files: File[];
  uploading: boolean;
  parsing: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => void;
  onRemoveFile: (index: number) => void;
  onAddAdditionalSource: () => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  files,
  uploading,
  parsing,
  onFileChange,
  onFileUpload,
  onRemoveFile,
  onAddAdditionalSource
}) => {
  const getUploadButtonText = () => {
    if (uploading || parsing) {
      return parsing ? 'Processing...' : 'Uploading...';
    }
    return files.length === 1 ? 'Upload File' : 'Upload Files';
  };

  return (
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
                  {getUploadButtonText()}
                </div>
              ) : (
                getUploadButtonText()
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUploadSection;
