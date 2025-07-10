
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';

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
        />
        <Label 
          htmlFor="upload" 
          className="cursor-pointer bg-blue-100 text-blue-700 rounded-md py-2 px-4 hover:bg-blue-200 transition-colors duration-200"
        >
          <Upload className="w-4 h-4 mr-2 inline-block" />
          {file ? file.name : 'Upload a file'}
        </Label>
        <Button onClick={onFileUpload} disabled={uploading || parsing}>
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
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
