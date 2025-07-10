
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, File } from 'lucide-react';

interface FileUploadSectionProps {
  file: File | null;
  uploading: boolean;
  parsing: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  file,
  uploading,
  parsing,
  onFileChange,
  onFileUpload
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Input
          type="file"
          id="upload"
          className="hidden"
          onChange={onFileChange}
          accept=".csv,.json,.txt"
        />
        
        {!file ? (
          <Label 
            htmlFor="upload" 
            className="cursor-pointer bg-blue-100 text-blue-700 rounded-md py-3 px-6 hover:bg-blue-200 transition-colors duration-200 flex items-center gap-2 text-sm font-medium w-full justify-center border-2 border-dashed border-blue-300"
          >
            <Upload className="w-4 h-4" />
            Choose File (CSV, JSON, or TXT)
          </Label>
        ) : (
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-md py-2 px-3">
              <File className="w-4 h-4" />
              <span className="truncate max-w-xs">{file.name}</span>
            </div>
            <Button 
              onClick={onFileUpload} 
              disabled={uploading || parsing}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {uploading || parsing ? 'Processing...' : 'Upload'}
            </Button>
          </div>
        )}
      </div>

      {parsing && (
        <div className="text-blue-600 flex items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
          Parsing data...
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
