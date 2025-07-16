
import React, { useCallback, useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { usePrivacyModal } from '@/hooks/usePrivacyModal';
import { getDropzoneAccept, validateFile as validateFileUnified } from '@/utils/fileValidation';
import PrivacySecurityModal from './PrivacySecurityModal';

interface RateLimitedDropzoneProps {
  onFileProcessed: (file: File) => void;
  maxFileSize?: number; // in MB
  maxFilesPerHour?: number;
  allowedTypes?: string[];
}

const RateLimitedDropzone: React.FC<RateLimitedDropzoneProps> = ({ 
  onFileProcessed,
  maxFileSize = 50, // 50MB default
  maxFilesPerHour = 10,
  allowedTypes = ['csv', 'json', 'txt', 'xlsx']
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [lastResetTime, setLastResetTime] = useState(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { isOpen, modalConfig, showModal, handleAccept, handleDecline } = usePrivacyModal();

  // Reset upload count every hour
  const checkRateLimit = () => {
    const now = Date.now();
    const hourInMs = 60 * 60 * 1000;
    
    if (now - lastResetTime > hourInMs) {
      setUploadCount(0);
      setLastResetTime(now);
      return true;
    }
    
    return uploadCount < maxFilesPerHour;
  };

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxFileSize) {
      return {
        isValid: false,
        error: `File size (${fileSizeInMB.toFixed(1)}MB) exceeds limit of ${maxFileSize}MB`
      };
    }

    // Use unified validation
    const validation = validateFileUnified(file);
    if (!validation.isValid) {
      return {
        isValid: false,
        error: validation.error || 'File validation failed'
      };
    }

    // Check rate limit
    if (!checkRateLimit()) {
      const nextReset = new Date(lastResetTime + 60 * 60 * 1000);
      return {
        isValid: false,
        error: `Upload limit reached (${maxFilesPerHour}/hour). Try again at ${nextReset.toLocaleTimeString()}`
      };
    }

    return { isValid: true };
  };

  const processFile = useCallback((file: File) => {
    const validation = validateFile(file);
    
    if (!validation.isValid) {
      toast({
        title: "Upload Rejected",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }

    const uploadAction = () => {
      setUploadCount(prev => prev + 1);
      onFileProcessed(file);
    };
    
    showModal(uploadAction, 'upload');
  }, [onFileProcessed, showModal, uploadCount, lastResetTime, maxFileSize, maxFilesPerHour]);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      toast({
        title: "File rejected",
        description: rejection.errors?.[0]?.message || "Invalid file type or size",
        variant: "destructive"
      });
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      processFile(file);
    }
  }, [processFile, toast]);

  const onDragEnter = useCallback(() => {
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragActive(false);
  }, []);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    accept: getDropzoneAccept(),
    maxFiles: 1,
    maxSize: maxFileSize * 1024 * 1024,
    noClick: true
  });

  const handleChooseFile = () => {
    if (!checkRateLimit()) {
      const nextReset = new Date(lastResetTime + 60 * 60 * 1000);
      toast({
        title: "Upload Limit Reached",
        description: `You've reached the hourly limit of ${maxFilesPerHour} files. Try again at ${nextReset.toLocaleTimeString()}`,
        variant: "destructive"
      });
      return;
    }
    open();
  };

  const remainingUploads = maxFilesPerHour - uploadCount;
  const nextReset = new Date(lastResetTime + 60 * 60 * 1000);

  return (
    <>
      <PrivacySecurityModal
        isOpen={isOpen}
        onAccept={handleAccept}
        onDecline={handleDecline}
        dataType={modalConfig.dataType}
        sourceName={modalConfig.sourceName}
      />
      
      <Card className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            {isDragActive ? (
              <Upload className="mx-auto h-12 w-12 text-blue-500" />
            ) : (
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
            )}
            
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? 'Drop your file here' : 'Drop files to upload'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {allowedTypes.map(type => `.${type}`).join(', ')} files only (max {maxFileSize}MB)
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <Button 
                onClick={handleChooseFile} 
                variant="outline"
                disabled={remainingUploads <= 0}
              >
                Choose File
              </Button>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Remaining: {remainingUploads}/{maxFilesPerHour}</span>
                </div>
                {remainingUploads <= 0 && (
                  <Badge variant="outline" className="text-orange-600">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Limit Reached
                  </Badge>
                )}
              </div>
              
              {remainingUploads <= 0 && (
                <p className="text-xs text-gray-500">
                  Reset at {nextReset.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default RateLimitedDropzone;
