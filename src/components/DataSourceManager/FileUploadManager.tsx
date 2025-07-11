
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { File, CheckCircle, Plus, X } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  status: 'success' | 'processing' | 'error';
}

interface FileUploadManagerProps {
  uploadedFiles: UploadedFile[];
  onRemoveFile: (fileId: string) => void;
  onUploadMore: () => void;
}

const FileUploadManager: React.FC<FileUploadManagerProps> = ({
  uploadedFiles,
  onRemoveFile,
  onUploadMore
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const hasSuccessfulUploads = uploadedFiles.some(f => f.status === 'success');

  if (uploadedFiles.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Success Indicator */}
      {hasSuccessfulUploads && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold text-green-800">Upload Successful!</h3>
              <p className="text-green-700">Your data has been uploaded and is ready for analysis.</p>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={onUploadMore} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Upload More Data
            </Button>
          </div>
        </div>
      )}

      {/* Uploaded Files List */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <File className="w-5 h-5" />
          Uploaded Files ({uploadedFiles.length})
        </h3>
        <div className="space-y-2">
          {uploadedFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between bg-white rounded-md p-3 border">
              <div className="flex items-center gap-3">
                {file.status === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
                {file.status === 'processing' && (
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                )}
                {file.status === 'error' && (
                  <X className="w-5 h-5 text-red-600" />
                )}
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • {file.uploadedAt.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={file.status === 'success' ? 'default' : file.status === 'error' ? 'destructive' : 'secondary'}
                >
                  {file.status === 'success' ? 'Ready' : file.status === 'processing' ? 'Processing' : 'Failed'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFile(file.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileUploadManager;
