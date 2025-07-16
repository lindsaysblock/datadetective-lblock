
/**
 * File Upload Input Component
 * Refactored to meet coding standards with proper constants and semantic styling
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAcceptString } from '@/utils/fileValidation';
import { SPACING, TEXT_SIZES, FILE_SIZES } from '@/constants/ui';

interface FileUploadInputProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadInput: React.FC<FileUploadInputProps> = ({ onFileChange }) => {
  const MAX_FILE_SIZE_MB = FILE_SIZES.MAX_FILE_SIZE / (1024 * 1024);
  
  return (
    <div>
      <Label htmlFor="file-upload" className={`block ${TEXT_SIZES.SMALL} font-medium mb-${SPACING.SM}`}>
        Select File
      </Label>
      <Input
        id="file-upload"
        type="file"
        accept={getAcceptString()}
        onChange={onFileChange}
        className="cursor-pointer"
      />
      <p className={`${TEXT_SIZES.SMALL} text-muted-foreground mt-${SPACING.XS}`}>
        Supported formats: CSV, JSON, TXT, XLSX (max {MAX_FILE_SIZE_MB}MB)
      </p>
    </div>
  );
};

export default FileUploadInput;
