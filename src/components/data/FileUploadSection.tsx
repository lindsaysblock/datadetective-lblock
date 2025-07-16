
/**
 * File Upload Section Component
 * Refactored to meet coding standards with proper constants and semantic styling
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, File } from 'lucide-react';
import { SPACING, TEXT_SIZES, ICON_SIZES } from '@/constants/ui';

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
    <div className={`space-y-${SPACING.MD}`}>
      <div className={`flex items-center space-x-${SPACING.MD}`}>
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
            className={`cursor-pointer bg-primary/10 text-primary rounded-md py-${SPACING.SM} px-${SPACING.LG} hover:bg-primary/20 transition-colors duration-200 flex items-center gap-${SPACING.SM} ${TEXT_SIZES.SMALL} font-medium w-full justify-center border-2 border-dashed border-primary/30`}
          >
            <Upload className={ICON_SIZES.SM} />
            Choose File (CSV, JSON, or TXT)
          </Label>
        ) : (
          <div className={`flex items-center gap-${SPACING.MD} flex-1`}>
            <div className={`flex items-center gap-${SPACING.SM} ${TEXT_SIZES.SMALL} text-muted-foreground bg-muted rounded-md py-${SPACING.SM} px-${SPACING.SM}`}>
              <File className={ICON_SIZES.SM} />
              <span className="truncate max-w-xs">{file.name}</span>
            </div>
            <Button 
              onClick={onFileUpload} 
              disabled={!file || uploading || parsing}
              className={`flex items-center gap-${SPACING.SM}`}
            >
              <Upload className={ICON_SIZES.SM} />
              {uploading || parsing ? 'Processing...' : 'Upload'}
            </Button>
          </div>
        )}
      </div>

      {parsing && (
        <div className="text-primary flex items-center">
          <div className={`animate-spin rounded-full h-${SPACING.LG} w-${SPACING.LG} border-b-2 border-primary mr-${SPACING.SM}`}></div>
          Parsing data...
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
