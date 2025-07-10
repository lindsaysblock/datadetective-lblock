
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import AnalyticsTab from './tabs/AnalyticsTab';
import InsightsTab from './tabs/InsightsTab';
import VisualizationTab from './tabs/VisualizationTab';
import HypothesisTab from './tabs/HypothesisTab';
import FindingsTab from './tabs/FindingsTab';
import ReportingTab from './tabs/ReportingTab';
import ManageTab from './tabs/ManageTab';
import QATab from './tabs/QATab';
import AuditTab from './tabs/AuditTab';
import { ParsedData } from '@/utils/dataParser';

interface TabContentRendererProps {
  activeTab: string;
  data: ParsedData;
  findings: any[];
  recommendations: any[];
}

const TabContentRenderer: React.FC<TabContentRendererProps> = ({
  activeTab,
  data,
  findings,
  recommendations
}) => {
  return (
    <>
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
          recommendations={recommendations}
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
          findings={findings}
          onExportFinding={(finding) => console.log('Export finding:', finding)}
          onShareFinding={(finding) => console.log('Share finding:', finding)}
        />
      </TabsContent>
      
      <TabsContent value="reporting">
        <ReportingTab />
      </TabsContent>
      
      <TabsContent value="manage">
        <ManageTab 
          data={data}
          onDataUpdate={(newData) => console.log('Data updated:', newData)}
        />
      </TabsContent>
      
      <TabsContent value="qa">
        <QATab />
      </TabsContent>
      
      <TabsContent value="audit">
        <AuditTab />
      </TabsContent>
    </>
  );
};

export default TabContentRenderer;
