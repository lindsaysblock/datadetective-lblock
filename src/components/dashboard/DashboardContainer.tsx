
import React, { useState } from 'react';
import { ParsedData } from '@/utils/dataParser';
import DashboardView from './DashboardView';
import { useDashboardData } from './hooks/useDashboardData';

interface DashboardContainerProps {
  data?: ParsedData;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({ data }) => {
  console.log('🎯 DashboardContainer rendered with data:', data);
  
  const [activeTab, setActiveTab] = useState('analytics');
  const { processedData, findings, recommendations, hypotheses } = useDashboardData(data);

  console.log('📊 Processed data:', processedData);

  return (
    <DashboardView
      activeTab={activeTab}
      onTabChange={setActiveTab}
      data={processedData}
      findings={findings}
      recommendations={recommendations}
    />
  );
};

export default DashboardContainer;
