
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAcceptString } from '@/utils/fileValidation';

interface FileUploadInputProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({ onFileChange }) => {
  return (
    <div>
      <Label htmlFor="file-upload" className="block text-sm font-medium mb-2">
        Select File
      </Label>
      <Input
        id="file-upload"
        type="file"
        accept={getAcceptString()}
        onChange={onFileChange}
        className="cursor-pointer"
      />
      <p className="text-xs text-gray-500 mt-1">
        Supported formats: CSV, JSON, TXT, XLSX (max 100MB)
      </p>
    </div>
  );
};

export default FileUploadInput;
