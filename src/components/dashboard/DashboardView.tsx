
import React from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import DashboardTabs from './DashboardTabs';
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
    <div className="w-full">
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
  );
};

export default DashboardView;
