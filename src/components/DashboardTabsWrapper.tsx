
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import DashboardTabs from './dashboard/DashboardTabs';
import { InsightsTab } from './dashboard/tabs/InsightsTab';
import { AnalyticsTab } from './dashboard/tabs/AnalyticsTab';
import { VisualizationTab } from './dashboard/tabs/VisualizationTab';
import { ReportingTab } from './dashboard/tabs/ReportingTab';
import { HypothesisTab } from './dashboard/tabs/HypothesisTab';
import { FindingsTab } from './dashboard/tabs/FindingsTab';
import { AuditTab } from './dashboard/tabs/AuditTab';
import { QATab } from './dashboard/tabs/QATab';
import { ManageTab } from './dashboard/tabs/ManageTab';

const DashboardTabsWrapper: React.FC = () => {
  const [activeTab, setActiveTab] = useState('insights');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Comprehensive insights and analysis tools
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <TabsContent value="insights" className="mt-6">
          <InsightsTab />
        </TabsContent>
        
        <TabsContent value="analytics" className="mt-6">
          <AnalyticsTab />
        </TabsContent>
        
        <TabsContent value="visualize" className="mt-6">
          <VisualizationTab />
        </TabsContent>
        
        <TabsContent value="reporting" className="mt-6">
          <ReportingTab />
        </TabsContent>
        
        <TabsContent value="hypothesis" className="mt-6">
          <HypothesisTab />
        </TabsContent>
        
        <TabsContent value="findings" className="mt-6">
          <FindingsTab />
        </TabsContent>
        
        <TabsContent value="audit" className="mt-6">
          <AuditTab />
        </TabsContent>
        
        <TabsContent value="qa" className="mt-6">
          <QATab />
        </TabsContent>
        
        <TabsContent value="manage" className="mt-6">
          <ManageTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardTabsWrapper;
