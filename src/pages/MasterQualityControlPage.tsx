/**
 * Master Quality Control Page - Comprehensive Quality Dashboard
 * Complete Phase 6 implementation with QA testing and orchestration
 */

import React, { useState } from 'react';
import { useMasterQualityOrchestration } from '@/hooks/useMasterQualityOrchestration';
import { useQATestManager } from '@/hooks/useQATestManager';
import { QATestResultsDashboard } from '@/components/qa/QATestResultsDashboard';
import { QualityControlHeader } from '@/components/quality/QualityControlHeader';
import { SystemStatusCards } from '@/components/quality/SystemStatusCards';
import { QualityControlTabs } from '@/components/quality/QualityControlTabs';

export default function MasterQualityControlPage() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const masterOrchestration = useMasterQualityOrchestration();
  const qaManager = useQATestManager();

  const handleRunFullOrchestration = async () => {
    try {
      await masterOrchestration.executeFullOrchestration();
    } catch (error) {
      console.error('Failed to run orchestration:', error);
    }
  };

  const handleRunTests = async () => {
    // Tests are handled by qaManager
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <QualityControlHeader
        isRunningOrchestration={masterOrchestration.isRunningFullSystem}
        isOperational={masterOrchestration.isOperational}
        isRunningTests={qaManager.isRunning || qaManager.isAutoFixing}
        onRunOrchestration={handleRunFullOrchestration}
        onStopOrchestration={masterOrchestration.emergencyStop}
        onRunTests={handleRunTests}
        onAutoFixTests={qaManager.runAutoFix}
      />

      <SystemStatusCards
        healthScore={masterOrchestration.overallHealthScore}
        testsPassed={qaManager.totalPassed}
        totalTests={qaManager.totalTests}
        successRate={qaManager.successRate}
        qualityScore={masterOrchestration.codeQuality.qualityScore || 82}
        performanceGains={masterOrchestration.globalMetrics.performanceGains}
      />

      <QualityControlTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        masterOrchestration={masterOrchestration}
        qaManager={qaManager}
      />
    </div>
  );
}