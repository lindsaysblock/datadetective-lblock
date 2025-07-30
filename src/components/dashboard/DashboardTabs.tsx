
/**
 * Dashboard Tabs Component
 * Refactored to meet coding standards with proper constants and semantic styling
 */

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, BarChart3, Database, TestTube, Settings, Brain, FileText, Shield } from 'lucide-react';
import { SPACING } from '@/constants/ui';

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, onTabChange }) => {
  const TAB_COUNT = 8;
  
  return (
    <TabsList className={`grid w-full grid-cols-${TAB_COUNT} mb-${SPACING.XL}`}>
      <TabsTrigger value="insights" className={`flex items-center gap-${SPACING.SM}`}>
        <Lightbulb className={`w-${SPACING.MD} h-${SPACING.MD}`} />
        Business Insights
      </TabsTrigger>
      <TabsTrigger value="analytics" className={`flex items-center gap-${SPACING.SM}`}>
        <Brain className={`w-${SPACING.MD} h-${SPACING.MD}`} />
        AI Analytics
      </TabsTrigger>
      <TabsTrigger value="visualize" className="flex items-center gap-2">
        <BarChart3 className="w-4 h-4" />
        Visualizations
      </TabsTrigger>
      <TabsTrigger value="reporting" className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Reports
      </TabsTrigger>
      <TabsTrigger value="hypothesis" className="flex items-center gap-2">
        <TestTube className="w-4 h-4" />
        Hypothesis
      </TabsTrigger>
      <TabsTrigger value="findings" className="flex items-center gap-2">
        <Database className="w-4 h-4" />
        Findings
      </TabsTrigger>
      <TabsTrigger value="audit" className="flex items-center gap-2">
        <Shield className="w-4 h-4" />
        Audit
      </TabsTrigger>
      <TabsTrigger value="manage" className="flex items-center gap-2">
        <Settings className="w-4 h-4" />
        Manage
      </TabsTrigger>
    </TabsList>
  );
};

export default DashboardTabs;
