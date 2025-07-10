
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Plus } from 'lucide-react';

interface FileUploadSuccessProps {
  onUploadMore: () => void;
}

const FileUploadSuccess: React.FC<FileUploadSuccessProps> = ({ onUploadMore }) => {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <CheckCircle className="w-6 h-6 text-green-600" />
        <span className="text-green-700 font-medium">File uploaded successfully!</span>
      </div>
      <Button onClick={onUploadMore} className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Upload Another File
      </Button>
    </div>
  );
};

export default FileUploadSuccess;
