
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import DashboardTabs from './DashboardTabs';
import DashboardHeader from './DashboardHeader';
import TabContentRenderer from './TabContentRenderer';
import { ParsedData } from '@/utils/dataParser';

interface DashboardViewProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  data: ParsedData;
  findings: any[];
  recommendations: any[];
}

const DashboardView: React.FC<DashboardViewProps> = ({
  activeTab,
  onTabChange,
  data,
  findings,
  recommendations
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <DashboardHeader
        filename="Dashboard Data"
        totalRows={data.summary.totalRows}
        totalColumns={data.summary.totalColumns}
      />
      
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <DashboardTabs 
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
          
          <TabContentRenderer
            activeTab={activeTab}
            data={data}
            findings={findings}
            recommendations={recommendations}
          />
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardView;
