
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Gauge, Wand2, GitBranch, FileSearch } from 'lucide-react';
import DataQualityDashboard from './DataQualityDashboard';
import DataTransformationTools from './DataTransformationTools';
import DataVersionControl from './DataVersionControl';
import { type ParsedData } from '../utils/dataParser';

interface DataManagementPanelProps {
  data: ParsedData;
  onDataUpdate: (newData: ParsedData) => void;
}

const DataManagementPanel: React.FC<DataManagementPanelProps> = ({
  data,
  onDataUpdate
}) => {
  const [activeTab, setActiveTab] = useState('quality');

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <Database className="w-6 h-6 text-blue-500" />
          Data Management Suite
        </h1>
        <p className="text-gray-600">
          Comprehensive tools for data quality monitoring, transformation, and version control
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="quality" className="flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            Data Quality
          </TabsTrigger>
          <TabsTrigger value="transform" className="flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            Transform
          </TabsTrigger>
          <TabsTrigger value="versions" className="flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Version Control
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quality">
          <DataQualityDashboard data={data} />
        </TabsContent>

        <TabsContent value="transform">
          <DataTransformationTools 
            data={data} 
            onDataTransformed={onDataUpdate} 
          />
        </TabsContent>

        <TabsContent value="versions">
          <DataVersionControl 
            currentData={data} 
            onDataRestore={onDataUpdate} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataManagementPanel;
