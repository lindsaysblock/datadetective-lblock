/**
 * Enterprise Quality Dashboard Hook
 * Provides comprehensive quality management interface for the unified orchestration system
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { UnifiedQualityOrchestrator, type QualityOrchestrationConfig, type OrchestrationSession, type SystemHealth } from '@/utils/orchestration/unifiedQualityOrchestrator';

export interface QualityDashboardState {
  isInitialized: boolean;
  isOrchestrating: boolean;
  currentSession: OrchestrationSession | null;
  sessionHistory: OrchestrationSession[];
  systemHealth: SystemHealth | null;
  config: QualityOrchestrationConfig;
  notifications: QualityNotification[];
  realTimeMetrics: RealTimeMetrics;
}

export interface QualityNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
}

export interface RealTimeMetrics {
  qualityScore: number;
  performanceScore: number;
  testCoverage: number;
  maintainabilityIndex: number;
  securityScore: number;
  trend: 'improving' | 'stable' | 'declining';
  lastUpdate: Date;
}

export interface QualityInsights {
  topIssues: string[];
  quickWins: string[];
  technicalDebt: number;
  automationOpportunities: string[];
  riskAreas: string[];
}

export function useEnterpriseQualityDashboard() {
  const [state, setState] = useState<QualityDashboardState>({
    isInitialized: false,
    isOrchestrating: false,
    currentSession: null,
    sessionHistory: [],
    systemHealth: null,
    config: {
      enableAutoRefactoring: true,
      enablePerformanceMonitoring: true,
      enableComprehensiveTesting: true,
      enableCodeGeneration: true,
      enableHookOptimization: true,
      automationLevel: 'assisted',
      qualityThresholds: {
        codeQuality: 80,
        performance: 85,
        testCoverage: 90,
        maintainability: 75
      }
    },
    notifications: [],
    realTimeMetrics: {
      qualityScore: 0,
      performanceScore: 0,
      testCoverage: 0,
      maintainabilityIndex: 0,
      securityScore: 0,
      trend: 'stable',
      lastUpdate: new Date()
    }
  });

  const orchestrator = useRef<UnifiedQualityOrchestrator | null>(null);
  const metricsInterval = useRef<NodeJS.Timeout | null>(null);

  // Initialize the orchestrator
  const initializeSystem = useCallback(async (config?: Partial<QualityOrchestrationConfig>) => {
    if (orchestrator.current) return;

    try {
      orchestrator.current = new UnifiedQualityOrchestrator(config || state.config);
      
      setState(prev => ({
        ...prev,
        isInitialized: true,
        config: { ...prev.config, ...config }
      }));

      addNotification('success', 'System Initialized', 'Enterprise Quality Dashboard is ready');
      
      // Start real-time metrics collection
      startRealTimeMetrics();
      
    } catch (error) {
      addNotification('error', 'Initialization Failed', `Failed to initialize quality system: ${error}`);
    }
  }, [state.config]);

  // Start quality orchestration
  const startOrchestration = useCallback(async (): Promise<string | null> => {
    if (!orchestrator.current || state.isOrchestrating) return null;

    try {
      setState(prev => ({ ...prev, isOrchestrating: true }));
      
      const sessionId = await orchestrator.current.startOrchestration();
      
      // Monitor session progress
      const monitorSession = setInterval(() => {
        if (orchestrator.current) {
          const status = orchestrator.current.getOrchestrationStatus();
          setState(prev => ({
            ...prev,
            currentSession: status.currentSession,
            systemHealth: status.lastHealth
          }));

          if (!status.isRunning) {
            clearInterval(monitorSession);
            setState(prev => ({ ...prev, isOrchestrating: false }));
            addNotification('success', 'Orchestration Complete', 'Quality orchestration finished successfully');
            refreshSessionHistory();
          }
        }
      }, 2000);

      addNotification('info', 'Orchestration Started', `Quality orchestration session ${sessionId} initiated`);
      return sessionId;
      
    } catch (error) {
      setState(prev => ({ ...prev, isOrchestrating: false }));
      addNotification('error', 'Orchestration Failed', `Failed to start orchestration: ${error}`);
      return null;
    }
  }, [state.isOrchestrating]);

  // Stop quality orchestration
  const stopOrchestration = useCallback(async (): Promise<OrchestrationSession | null> => {
    if (!orchestrator.current || !state.isOrchestrating) return null;

    try {
      const session = await orchestrator.current.stopOrchestration();
      
      setState(prev => ({
        ...prev,
        isOrchestrating: false,
        currentSession: null
      }));

      addNotification('info', 'Orchestration Stopped', 'Quality orchestration manually stopped');
      refreshSessionHistory();
      
      return session;
    } catch (error) {
      addNotification('error', 'Stop Failed', `Failed to stop orchestration: ${error}`);
      return null;
    }
  }, [state.isOrchestrating]);

  // Update system configuration
  const updateConfiguration = useCallback((newConfig: Partial<QualityOrchestrationConfig>) => {
    if (orchestrator.current) {
      orchestrator.current.updateConfig(newConfig);
    }
    
    setState(prev => ({
      ...prev,
      config: { ...prev.config, ...newConfig }
    }));

    addNotification('info', 'Configuration Updated', 'System configuration has been updated');
  }, []);

  // Get quality insights
  const getQualityInsights = useCallback((): QualityInsights => {
    const health = state.systemHealth;
    
    if (!health) {
      return {
        topIssues: [],
        quickWins: [],
        technicalDebt: 0,
        automationOpportunities: [],
        riskAreas: []
      };
    }

    const insights: QualityInsights = {
      topIssues: health.criticalIssues,
      quickWins: health.recommendations.filter(rec => 
        rec.includes('refactor') || rec.includes('optimize')
      ),
      technicalDebt: Math.max(0, 100 - health.scores.maintainability),
      automationOpportunities: [
        'Automated testing coverage',
        'Performance monitoring',
        'Code generation for repetitive patterns',
        'Refactoring suggestions'
      ],
      riskAreas: Object.entries(health.scores)
        .filter(([, score]) => score < 70)
        .map(([area]) => area)
    };

    return insights;
  }, [state.systemHealth]);

  // Generate comprehensive report
  const generateReport = useCallback((sessionId?: string): string => {
    if (!orchestrator.current) return 'System not initialized';

    if (sessionId) {
      return orchestrator.current.generateOrchestrationReport(sessionId);
    }

    // Generate overall system report
    const history = state.sessionHistory;
    const latestSession = history[0];

    let report = `# Enterprise Quality Dashboard Report\n\n`;
    report += `Generated: ${new Date().toISOString()}\n\n`;

    if (state.systemHealth) {
      report += `## Current System Health: ${state.systemHealth.overall.toUpperCase()}\n\n`;
      report += `### Quality Scores\n`;
      Object.entries(state.systemHealth.scores).forEach(([key, value]) => {
        report += `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${Math.round(value)}%\n`;
      });
    }

    report += `\n## Real-Time Metrics\n`;
    report += `- Quality Score: ${Math.round(state.realTimeMetrics.qualityScore)}%\n`;
    report += `- Performance Score: ${Math.round(state.realTimeMetrics.performanceScore)}%\n`;
    report += `- Test Coverage: ${Math.round(state.realTimeMetrics.testCoverage)}%\n`;
    report += `- Maintainability: ${Math.round(state.realTimeMetrics.maintainabilityIndex)}%\n`;
    report += `- Security Score: ${Math.round(state.realTimeMetrics.securityScore)}%\n`;
    report += `- Trend: ${state.realTimeMetrics.trend}\n`;

    if (history.length > 0) {
      report += `\n## Session History (${history.length} sessions)\n`;
      history.slice(0, 5).forEach(session => {
        report += `- ${session.id}: ${session.status} (${session.health.overall})\n`;
      });
    }

    const insights = getQualityInsights();
    if (insights.topIssues.length > 0) {
      report += `\n## Top Issues\n`;
      insights.topIssues.forEach(issue => report += `- ${issue}\n`);
    }

    return report;
  }, [state, getQualityInsights]);

  // Real-time metrics collection
  const startRealTimeMetrics = useCallback(() => {
    if (metricsInterval.current) return;

    metricsInterval.current = setInterval(() => {
      // Simulate real-time metrics updates
      const baseMetrics = state.realTimeMetrics;
      const variation = () => (Math.random() - 0.5) * 2; // -1 to +1

      setState(prev => ({
        ...prev,
        realTimeMetrics: {
          qualityScore: Math.max(0, Math.min(100, baseMetrics.qualityScore + variation())),
          performanceScore: Math.max(0, Math.min(100, baseMetrics.performanceScore + variation())),
          testCoverage: Math.max(0, Math.min(100, baseMetrics.testCoverage + variation() * 0.5)),
          maintainabilityIndex: Math.max(0, Math.min(100, baseMetrics.maintainabilityIndex + variation())),
          securityScore: Math.max(0, Math.min(100, baseMetrics.securityScore + variation() * 0.3)),
          trend: Math.random() > 0.7 ? 'improving' : Math.random() > 0.3 ? 'stable' : 'declining',
          lastUpdate: new Date()
        }
      }));
    }, 5000); // Update every 5 seconds
  }, [state.realTimeMetrics]);

  // Utility functions
  const addNotification = useCallback((
    type: QualityNotification['type'],
    title: string,
    message: string,
    action?: QualityNotification['action']
  ) => {
    const notification: QualityNotification = {
      id: `notif_${Date.now()}`,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      action
    };

    setState(prev => ({
      ...prev,
      notifications: [notification, ...prev.notifications.slice(0, 49)] // Keep max 50
    }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    }));
  }, []);

  const clearNotifications = useCallback(() => {
    setState(prev => ({ ...prev, notifications: [] }));
  }, []);

  const refreshSessionHistory = useCallback(() => {
    if (orchestrator.current) {
      const history = orchestrator.current.getSessionHistory();
      setState(prev => ({ ...prev, sessionHistory: history }));
    }
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (metricsInterval.current) {
        clearInterval(metricsInterval.current);
      }
    };
  }, []);

  // Auto-initialize on mount
  useEffect(() => {
    if (!state.isInitialized) {
      initializeSystem();
    }
  }, [state.isInitialized, initializeSystem]);

  return {
    // State
    ...state,
    
    // Core orchestration functions
    startOrchestration,
    stopOrchestration,
    updateConfiguration,
    
    // Insights and reporting
    getQualityInsights,
    generateReport,
    
    // Notification management
    addNotification,
    markNotificationRead,
    clearNotifications,
    
    // Data refresh
    refreshSessionHistory,
    
    // Status checks
    isHealthy: state.systemHealth?.overall === 'excellent' || state.systemHealth?.overall === 'good',
    hasNotifications: state.notifications.length > 0,
    unreadNotifications: state.notifications.filter(n => !n.read).length,
    isActive: state.isOrchestrating,
    systemInitialized: state.isInitialized
  };
}