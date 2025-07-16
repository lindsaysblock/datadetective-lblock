
/**
 * Dashboard Tab Navigation Component
 * Refactored to meet coding standards with proper constants and semantic styling
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Database } from 'lucide-react';
import { SPACING } from '@/constants/ui';

interface DashboardTabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardTabNavigation: React.FC<DashboardTabNavigationProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  return (
    <div className={`flex items-center space-x-${SPACING.MD}`}>
      <Button
        variant={activeTab === 'dataExploration' ? 'default' : 'outline'}
        onClick={() => setActiveTab('dataExploration')}
      >
        <Sparkles className={`w-${SPACING.MD} h-${SPACING.MD} mr-${SPACING.SM}`} />
        Data Exploration
      </Button>
      <Button
        variant={activeTab === 'myDatasets' ? 'default' : 'outline'}
        onClick={() => setActiveTab('myDatasets')}
      >
        <Database className={`w-${SPACING.MD} h-${SPACING.MD} mr-${SPACING.SM}`} />
        My Datasets
      </Button>
    </div>
  );
};

export default DashboardTabNavigation;
