
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Wand2 } from 'lucide-react';
import RateLimitedDropzone from '../RateLimitedDropzone';
import EnhancedUploadProgress from '../EnhancedUploadProgress';

interface DataUploadTabProps {
  onFileProcessed: (file: File) => void;
  onGenerateMockData: () => void;
  uploading: boolean;
  uploadProgress: number;
  uploadStatus: 'uploading' | 'processing' | 'complete' | 'error';
  uploadFilename: string;
  uploadError: string | null;
  estimatedTime: number;
  user: any;
  onSaveToAccount: () => void;
}

const DataUploadTab: React.FC<DataUploadTabProps> = ({
  onFileProcessed,
  onGenerateMockData,
  uploading,
  uploadProgress,
  uploadStatus,
  uploadFilename,
  uploadError,
  estimatedTime,
  user,
  onSaveToAccount
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Your Data</h2>
        <p className="text-gray-600">Choose how you'd like to provide data for analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 bg-white/80 backdrop-blur-sm border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <Upload className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold">Upload Your Data</h2>
          </div>
          <RateLimitedDropzone 
            onFileProcessed={onFileProcessed}
            maxFileSize={100}
            maxFilesPerHour={20}
          />
        </Card>

        <Card className="p-6 bg-white/80 backdrop-blur-sm border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <Wand2 className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold">AI Data Generation</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Don't have data? Let our AI generate sample datasets for practice
          </p>
          <Button onClick={onGenerateMockData} className="w-full">
            Generate Sample Data
          </Button>
        </Card>
      </div>

      {(uploading || uploadStatus === 'complete' || uploadStatus === 'error') && (
        <EnhancedUploadProgress
          isUploading={uploading}
          progress={uploadProgress}
          status={uploadStatus}
          filename={uploadFilename}
          error={uploadError}
          estimatedTime={estimatedTime}
          onSaveToAccount={user ? onSaveToAccount : undefined}
          showSaveOption={user && uploadStatus === 'complete'}
        />
      )}
    </div>
  );
};

export default DataUploadTab;
