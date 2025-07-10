
import React, { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import DashboardTabs from './dashboard/DashboardTabs';
import AnalyticsTab from './dashboard/tabs/AnalyticsTab';
import InsightsTab from './dashboard/tabs/InsightsTab';
import VisualizationTab from './dashboard/tabs/VisualizationTab';
import HypothesisTab from './dashboard/tabs/HypothesisTab';
import FindingsTab from './dashboard/tabs/FindingsTab';
import ReportingTab from './dashboard/tabs/ReportingTab';
import ManageTab from './dashboard/tabs/ManageTab';
import QATab from './dashboard/tabs/QATab';
import AuditTab from './dashboard/tabs/AuditTab';
import { ParsedData } from '@/utils/dataParser';

interface DashboardTabsWrapperProps {
  data?: ParsedData;
}

const DashboardTabsWrapper: React.FC<DashboardTabsWrapperProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('analytics');

  const mockData: ParsedData = {
    columns: ['user_id', 'event_name', 'timestamp', 'value'],
    rows: [
      ['user_1', 'login', '2024-01-01T10:00:00Z', '1'],
      ['user_2', 'purchase', '2024-01-01T11:00:00Z', '99.99']
    ],
    summary: { 
      totalRows: 2, 
      totalColumns: 4,
      possibleUserIdColumns: ['user_id'],
      possibleEventColumns: ['event_name'],
      possibleTimestampColumns: ['timestamp']
    }
  };
  
  const mockFindings = [
    {
      id: '1',
      title: 'User Engagement Peak',
      description: 'Peak user activity occurs between 10-11 AM',
      confidence: 'high',
      type: 'insight'
    }
  ];

  const mockRecommendations = [
    {
      id: '1',
      type: 'bar' as const,
      title: 'User Activity by Hour',
      description: 'Shows peak usage times',
      config: { xAxis: 'hour', yAxis: 'count' }
    }
  ];

  const mockHypotheses = [
    {
      id: '1',
      hypothesis: 'Users are more active in the morning',
      status: 'testing' as const,
      confidence: 0.75,
      evidence: ['Peak activity at 10-11 AM', 'Lower evening engagement']
    }
  ];

  const currentData = data || mockData;

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <DashboardTabs />
        
        <TabsContent value="analytics">
          <AnalyticsTab />
        </TabsContent>
        
        <TabsContent value="insights">
          <InsightsTab 
            onUpdateHypothesis={(hypothesis) => console.log('Update hypothesis:', hypothesis)}
          />
        </TabsContent>
        
        <TabsContent value="visualization">
          <VisualizationTab 
            recommendations={mockRecommendations}
            onSelectVisualization={(rec) => console.log('Selected visualization:', rec)}
          />
        </TabsContent>
        
        <TabsContent value="hypothesis">
          <HypothesisTab 
            onHypothesisUpdate={(hypotheses) => console.log('Hypotheses updated:', hypotheses)}
          />
        </TabsContent>
        
        <TabsContent value="findings">
          <FindingsTab 
            findings={mockFindings}
            onExportFinding={(finding) => console.log('Export finding:', finding)}
            onShareFinding={(finding) => console.log('Share finding:', finding)}
          />
        </TabsContent>
        
        <TabsContent value="reporting">
          <ReportingTab />
        </TabsContent>
        
        <TabsContent value="manage">
          <ManageTab 
            data={currentData}
            onDataUpdate={(newData) => console.log('Data updated:', newData)}
          />
        </TabsContent>
        
        <TabsContent value="qa">
          <QATab />
        </TabsContent>
        
        <TabsContent value="audit">
          <AuditTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardTabsWrapper;
