
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePrivacyModal } from '@/hooks/usePrivacyModal';
import AnalyzingIcon from './AnalyzingIcon';
import PrivacySecurityModal from './PrivacySecurityModal';
import FileUploadManager from './DataSourceManager/FileUploadManager';
import DataSourceTabs from './DataSourceManager/DataSourceTabs';

interface DataSource {
  id: string;
  name: string;
  type: 'file' | 'database' | 'api' | 'warehouse' | 'amplitude';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: Date;
  status: 'success' | 'processing' | 'error';
}

interface DataSourceManagerProps {
  onFileUpload: (file: File) => Promise<void>;
}

const DataSourceManager: React.FC<DataSourceManagerProps> = ({
  onFileUpload
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const { toast } = useToast();
  const { isOpen, modalConfig, showModal, handleAccept, handleDecline } = usePrivacyModal();

  const handleDataSourceConnect = async (source: DataSource) => {
    const connectAction = async () => {
      console.log('Data source connected:', source);
      setAnalyzing(true);
      
      // Simulate connection and analysis process with progress updates
      const totalSteps = 5;
      const estimatedTotalTime = 15000; // 15 seconds
      setEstimatedTime(estimatedTotalTime);
      
      for (let step = 1; step <= totalSteps; step++) {
        await new Promise(resolve => setTimeout(resolve, estimatedTotalTime / totalSteps));
        const progress = (step / totalSteps) * 100;
        setUploadProgress(progress);
        setEstimatedTime(estimatedTotalTime - (step * (estimatedTotalTime / totalSteps)));
      }
      
      setAnalyzing(false);
      setUploadProgress(0);
      setEstimatedTime(0);
      
      toast({
        title: "Data Source Connected!",
        description: `Successfully connected to ${source.name}.`,
      });
    };

    showModal(connectAction, 'connection', source.name);
  };

  const handleFileUploadWithPrivacy = async (file: File) => {
    const uploadAction = async () => {
      try {
        const newFile: UploadedFile = {
          id: Date.now().toString(),
          name: file.name,
          size: file.size,
          uploadedAt: new Date(),
          status: 'processing'
        };
        
        setUploadedFiles(prev => [...prev, newFile]);
        console.log('Starting file upload for:', file.name);
        
        await onFileUpload(file);
        
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === newFile.id 
              ? { ...f, status: 'success' as const }
              : f
          )
        );
        
        console.log('File upload completed successfully:', file.name);
        
        toast({
          title: "File Uploaded Successfully!",
          description: `${file.name} has been processed and is ready for analysis.`,
        });
        
      } catch (error) {
        console.error('File upload error:', error);
        setUploadedFiles(prev => 
          prev.map(f => 
            f.name === file.name 
              ? { ...f, status: 'error' as const }
              : f
          )
        );
        
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}. Please try again.`,
          variant: "destructive",
        });
      }
    };
    
    showModal(uploadAction, 'upload');
  };

  const removeUploadedFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleUploadMore = () => {
    console.log('Upload more clicked');
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv,.json,.txt,.xlsx';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileUploadWithPrivacy(file);
      }
    };
    fileInput.click();
  };

  const hasSuccessfulUploads = uploadedFiles.some(f => f.status === 'success');

  console.log('DataSourceManager render - hasSuccessfulUploads:', hasSuccessfulUploads, 'uploadedFiles:', uploadedFiles);

  return (
    <div className="space-y-6">
      <PrivacySecurityModal
        isOpen={isOpen}
        onAccept={handleAccept}
        onDecline={handleDecline}
        dataType={modalConfig.dataType}
        sourceName={modalConfig.sourceName}
      />

      <FileUploadManager
        uploadedFiles={uploadedFiles}
        onRemoveFile={removeUploadedFile}
        onUploadMore={handleUploadMore}
      />

      <DataSourceTabs
        onDataSourceConnect={handleDataSourceConnect}
        onFileUpload={handleFileUploadWithPrivacy}
        uploadComplete={hasSuccessfulUploads}
        onUploadMore={handleUploadMore}
        analyzing={analyzing}
      />
      
      {analyzing && (
        <div className="text-center">
          <AnalyzingIcon isAnalyzing={analyzing} />
        </div>
      )}
    </div>
  );
};

export default DataSourceManager;
