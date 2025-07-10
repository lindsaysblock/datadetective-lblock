import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePrivacyModal } from '@/hooks/usePrivacyModal';
import DataSourceConfig from './DataSourceConfig';
import RealTimeDataStreaming from './RealTimeDataStreaming';
import AnalyzingIcon from './AnalyzingIcon';
import PrivacySecurityModal from './PrivacySecurityModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Zap, Database } from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  type: 'file' | 'database' | 'api' | 'warehouse' | 'amplitude';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
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

    // Show privacy modal before connecting
    showModal(connectAction, 'connection', source.name);
  };

  const handleFileUploadWithPrivacy = async (file: File) => {
    const uploadAction = () => onFileUpload(file);
    
    // Show privacy modal before uploading
    showModal(uploadAction, 'upload');
  };

  return (
    <div className="space-y-6">
      <PrivacySecurityModal
        isOpen={isOpen}
        onAccept={handleAccept}
        onDecline={handleDecline}
        dataType={modalConfig.dataType}
        sourceName={modalConfig.sourceName}
      />

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
