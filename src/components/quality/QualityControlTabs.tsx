/**
 * Quality Control Tabs Component
 * Main tabbed interface for quality control sections
 */

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QATestResultsDashboard } from '@/components/qa/QATestResultsDashboard';
import { OverviewTab } from './OverviewTab';
import { OrchestrationTab } from './OrchestrationTab';
import { MetricsTab } from './MetricsTab';
import { ReportsTab } from './ReportsTab';

interface QualityControlTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  masterOrchestration: any;
  qaManager: any;
}

export const QualityControlTabs: React.FC<QualityControlTabsProps> = ({
  activeTab,
  onTabChange,
  masterOrchestration,
  qaManager
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="qa-testing">QA Testing</TabsTrigger>
        <TabsTrigger value="orchestration">Orchestration</TabsTrigger>
        <TabsTrigger value="metrics">Metrics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab 
          systemIntegrity={masterOrchestration.systemIntegrity}
          hasFailures={qaManager.totalTests > qaManager.totalPassed}
          totalTestsFailed={qaManager.totalTests - qaManager.totalPassed}
        />
      </TabsContent>

      <TabsContent value="qa-testing">
        <QATestResultsDashboard
          testSuites={qaManager.testSuites}
          onRetryTest={qaManager.retryTest}
          onRetryCategory={() => {}}
          onRunAllTests={() => {}}
          onAutoFixTests={qaManager.runAutoFix}
        />
      </TabsContent>

      <TabsContent value="orchestration">
        <OrchestrationTab 
          isFullyInitialized={masterOrchestration.isFullyInitialized}
          isSystemHealthy={masterOrchestration.isSystemHealthy}
          globalMetrics={masterOrchestration.globalMetrics}
        />
      </TabsContent>

      <TabsContent value="metrics">
        <MetricsTab />
      </TabsContent>

      <TabsContent value="reports">
        <ReportsTab 
          generateReport={masterOrchestration.generateComprehensiveReport}
          overallHealthScore={masterOrchestration.overallHealthScore}
          successRate={qaManager.successRate}
          lastRunTimestamp={qaManager.lastRunTimestamp}
        />
      </TabsContent>
    </Tabs>
  );
};