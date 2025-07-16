import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePrivacyModal } from '@/hooks/usePrivacyModal';
import { getDropzoneAccept } from '@/utils/fileValidation';
import PrivacySecurityModal from './PrivacySecurityModal';

interface DropzoneProps {
  onFileProcessed: (file: File) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileProcessed }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const { toast } = useToast();
  const { isOpen, modalConfig, showModal, handleAccept, handleDecline } = usePrivacyModal();

  const processFile = useCallback((file: File) => {
    const uploadAction = () => onFileProcessed(file);
    showModal(uploadAction, 'upload');
  }, [onFileProcessed, showModal]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const onDragEnter = useCallback(() => {
    setIsDragActive(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragActive(false);
  }, []);

  const onDropRejected = useCallback(() => {
    toast({
      title: "File rejected",
      description: "Please upload a valid CSV, JSON, or TXT file",
      variant: "destructive"
    });
  }, [toast]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    onDragEnter,
    onDragLeave,
    onDropRejected,
    accept: getDropzoneAccept(),
    maxFiles: 1,
    noClick: true
  });

  const handleChooseFile = () => {
    open();
  };

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
                CSV, JSON, or TXT files only
              </p>
            </div>
            
            <Button onClick={handleChooseFile} variant="outline">
              Choose File
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
};

export default Dropzone;
