
import React from 'react';
import { Card } from '@/components/ui/card';
import { Database } from 'lucide-react';
import DataSourceManager from '../DataSourceManager';

interface DataSourceTabProps {
  onFileUpload: (file: File) => void;
}

const DataSourceTab: React.FC<DataSourceTabProps> = ({ onFileUpload }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Connect Data Sources</h2>
        <p className="text-gray-600">Import data from external sources and databases</p>
      </div>
      <Card className="p-6 bg-white/80 backdrop-blur-sm border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold">External Data Sources</h2>
        </div>
        <DataSourceManager onFileUpload={onFileUpload} />
      </Card>
    </div>
  );
};

export default DataSourceTab;
