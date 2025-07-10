
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Database } from 'lucide-react';

interface DashboardTabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardTabNavigation: React.FC<DashboardTabNavigationProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <div className="flex items-center space-x-4">
      <Button
        variant={activeTab === 'dataExploration' ? 'default' : 'outline'}
        onClick={() => setActiveTab('dataExploration')}
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Data Exploration
      </Button>
      <Button
        variant={activeTab === 'myDatasets' ? 'default' : 'outline'}
        onClick={() => setActiveTab('myDatasets')}
      >
        <Database className="w-4 h-4 mr-2" />
        My Datasets
      </Button>
    </div>
  );
};

export default DashboardTabNavigation;
