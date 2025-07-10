
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import DataSourceConfig from './DataSourceConfig';
import AnalyzingIcon from './AnalyzingIcon';

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

  const handleDataSourceConnect = async (source: DataSource) => {
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

  return (
    <div className="space-y-6">
      <DataSourceConfig 
        onDataSourceConnect={handleDataSourceConnect}
        onFileUpload={onFileUpload}
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
