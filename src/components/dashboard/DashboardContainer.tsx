
import React, { useState } from 'react';
import { ParsedData } from '@/utils/dataParser';
import DashboardView from './DashboardView';
import { useDashboardData } from './hooks/useDashboardData';

interface DashboardContainerProps {
  data?: ParsedData;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('analytics');
  const { processedData, findings, recommendations, hypotheses } = useDashboardData(data);

  // Ensure the data has the required structure with all ParsedData properties
  const normalizedData: ParsedData = processedData || {
    columns: [],
    rows: [],
    rowCount: 0,
    fileSize: 0,
    summary: {
      totalRows: 0,
      totalColumns: 0
    }
  };

  return (
    <DashboardView
      activeTab={activeTab}
      onTabChange={setActiveTab}
      data={normalizedData}
      findings={findings}
      recommendations={recommendations}
    />
  );
};

export default DashboardContainer;
