
/**
 * File Upload Success Component
 * Refactored to meet coding standards with proper constants and semantic styling
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Plus } from 'lucide-react';
import { SPACING, ICON_SIZES } from '@/constants/ui';

interface FileUploadSuccessProps {
  onUploadMore: () => void;
}

const FileUploadSuccess: React.FC<FileUploadSuccessProps> = ({ onUploadMore }) => {
  return (
    <div className="text-center">
      <div className={`flex items-center justify-center gap-${SPACING.SM} mb-${SPACING.SM}`}>
        <CheckCircle className={`${ICON_SIZES.LG} text-success`} />
        <span className="text-success font-medium">File uploaded successfully!</span>
      </div>
      <Button onClick={onUploadMore} className={`flex items-center gap-${SPACING.SM}`}>
        <Plus className={ICON_SIZES.SM} />
        Upload Another File
      </Button>
    </div>
  );
};

export default FileUploadSuccess;
