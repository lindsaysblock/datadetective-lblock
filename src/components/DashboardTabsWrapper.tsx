
import React from 'react';
import { ParsedData } from '@/utils/dataParser';
import DashboardContainer from './dashboard/DashboardContainer';

interface DashboardTabsWrapperProps {
  data?: ParsedData;
}

const DashboardTabsWrapper: React.FC<DashboardTabsWrapperProps> = ({ data }) => {
  return <DashboardContainer data={data} />;
};

export default DashboardTabsWrapper;
