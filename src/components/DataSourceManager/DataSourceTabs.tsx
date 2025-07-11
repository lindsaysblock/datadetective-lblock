
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Zap, Database } from 'lucide-react';
import DataSourceConfig from '../DataSourceConfig';
import RealTimeDataStreaming from '../RealTimeDataStreaming';

interface DataSourceTabsProps {
  onDataSourceConnect: (source: any) => Promise<void>;
  onFileUpload: (file: File) => Promise<void>;
  uploadComplete: boolean;
  onUploadMore: () => void;
  analyzing: boolean;
}

const DataSourceTabs: React.FC<DataSourceTabsProps> = ({
  onDataSourceConnect,
  onFileUpload,
  uploadComplete,
  onUploadMore,
  analyzing
}) => {
  return (
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
          onDataSourceConnect={onDataSourceConnect}
          onFileUpload={onFileUpload}
          uploadComplete={uploadComplete}
          onUploadMore={onUploadMore}
        />
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
  );
};

export default DataSourceTabs;
