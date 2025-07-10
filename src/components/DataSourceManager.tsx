
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePrivacyModal } from '@/hooks/usePrivacyModal';
import DataSourceConfig from './DataSourceConfig';
import RealTimeDataStreaming from './RealTimeDataStreaming';
import AnalyzingIcon from './AnalyzingIcon';
import PrivacySecurityModal from './PrivacySecurityModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Zap, Database, CheckCircle, Plus, File, X } from 'lucide-react';

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
  const [uploadComplete, setUploadComplete] = useState(false);
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
      setUploadComplete(true);
      
      toast({
        title: "Data Source Connected!",
        description: `Successfully connected to ${source.name}.`,
      });
    };

    // Show privacy modal before connecting
    showModal(connectAction, 'connection', source.name);
  };

  const handleFileUploadWithPrivacy = async (file: File) => {
    const uploadAction = async () => {
      try {
        // Add file to processing state
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
        
        // Update status to success
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === newFile.id 
              ? { ...f, status: 'success' as const }
              : f
          )
        );
        
        // Set upload complete to true to trigger the success UI
        console.log('Setting uploadComplete to true after successful upload');
        setUploadComplete(true);
        console.log('File upload completed successfully:', file.name);
        
        toast({
          title: "File Uploaded Successfully!",
          description: `${file.name} has been processed and is ready for analysis.`,
        });
        
      } catch (error) {
        console.error('File upload error:', error);
        // Update status to error
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
    
    // Show privacy modal before uploading
    showModal(uploadAction, 'upload');
  };

  const removeUploadedFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    if (uploadedFiles.length === 1) {
      setUploadComplete(false);
    }
  };

  const handleUploadMore = () => {
    console.log('Upload more clicked, keeping uploadComplete state');
    
    // Trigger file input click
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Check if we have any successfully uploaded files
  const hasSuccessfulUploads = uploadedFiles.some(f => f.status === 'success');

  console.log('DataSourceManager render - uploadComplete:', uploadComplete, 'hasSuccessfulUploads:', hasSuccessfulUploads);

  return (
    <div className="space-y-6">
      <PrivacySecurityModal
        isOpen={isOpen}
        onAccept={handleAccept}
        onDecline={handleDecline}
        dataType={modalConfig.dataType}
        sourceName={modalConfig.sourceName}
      />

      {/* Success Indicator - Show when files are uploaded successfully */}
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
            <Button onClick={handleUploadMore} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Upload More Data
            </Button>
          </div>
        </div>
      )}

      {/* Uploaded Files Section */}
      {uploadedFiles.length > 0 && (
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
                    onClick={() => removeUploadedFile(file.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Tabs defaultValue="connect" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="connect" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Connect Data
          </TabsTrigger>
          <TabsTrigger value="streaming" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Real-Time Streaming
          </TabsTrigger>
          <TabsTrigger value="databases" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Database Connections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="connect" className="space-y-6">
          <DataSourceConfig 
            onDataSourceConnect={handleDataSourceConnect}
            onFileUpload={handleFileUploadWithPrivacy}
            uploadComplete={hasSuccessfulUploads}
            onUploadMore={handleUploadMore}
          />
          
          {analyzing && (
            <div className="text-center">
              <AnalyzingIcon isAnalyzing={analyzing} />
            </div>
          )}
        </TabsContent>

        <TabsContent value="streaming" className="space-y-6">
          <RealTimeDataStreaming />
        </TabsContent>

        <TabsContent value="databases" className="space-y-6">
          <div className="text-center py-12">
            <Database className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Database Connections</h3>
            <p className="text-gray-500">
              Connect to your databases for persistent data storage and querying.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataSourceManager;
