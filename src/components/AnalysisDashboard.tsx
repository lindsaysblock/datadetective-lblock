
import React, { useState } from 'react';
import { Tabs } from '@/components/ui/tabs';
import { type ParsedData } from '../utils/dataParser';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardTabs from './dashboard/DashboardTabs';
import InsightsTab from './dashboard/tabs/InsightsTab';
import AnalyticsTab from './dashboard/tabs/AnalyticsTab';
import VisualizationTab from './dashboard/tabs/VisualizationTab';
import ReportingTab from './dashboard/tabs/ReportingTab';
import HypothesisTab from './dashboard/tabs/HypothesisTab';
import FindingsTab from './dashboard/tabs/FindingsTab';
import AuditTab from './dashboard/tabs/AuditTab';
import QATab from './dashboard/tabs/QATab';
import ManageTab from './dashboard/tabs/ManageTab';
import { useDashboardData } from '../hooks/useDashboardData';
import { useDashboardActions } from '../hooks/useDashboardActions';
import { generateRecommendations } from '../utils/dashboardRecommendations';

interface AnalysisDashboardProps {
  parsedData: ParsedData;
  filename?: string;
  findings: any[];
  onDataUpdate?: (newData: ParsedData) => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({
  parsedData,
  filename,
  findings,
  onDataUpdate
}) => {
  const [activeTab, setActiveTab] = useState('insights');
  const { currentData, handleDataUpdate } = useDashboardData(parsedData, onDataUpdate);
  const {
    handleHypothesisUpdate,
    handleSelectVisualization,
    handleExportFinding,
    handleShareFinding
  } = useDashboardActions(filename);

  const recommendations = generateRecommendations(currentData);

  return (
    <div>
      <DashboardHeader
        filename={filename}
        totalRows={currentData.summary.totalRows}
        totalColumns={currentData.summary.totalColumns}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <InsightsTab onUpdateHypothesis={handleHypothesisUpdate} />
        <AnalyticsTab />
        <VisualizationTab 
          recommendations={recommendations}
          onSelectVisualization={handleSelectVisualization}
        />
        <ReportingTab />
        <HypothesisTab onHypothesisUpdate={handleHypothesisUpdate} />
        <FindingsTab 
          findings={findings}
          onExportFinding={handleExportFinding}
          onShareFinding={handleShareFinding}
        />
        <AuditTab />
        <QATab />
        <ManageTab 
          data={currentData}
          onDataUpdate={handleDataUpdate}
        />
      </Tabs>
    </div>
  );
};

export default AnalysisDashboard;
