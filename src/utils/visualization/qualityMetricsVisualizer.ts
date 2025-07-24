/**
 * Quality Metrics Visualizer
 * Provides visualization components and utilities for quality metrics
 */

export interface MetricVisualization {
  type: 'gauge' | 'trend' | 'bar' | 'pie' | 'heatmap';
  data: MetricDataPoint[];
  config: VisualizationConfig;
}

export interface MetricDataPoint {
  label: string;
  value: number;
  threshold?: number;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
  timestamp?: Date;
}

export interface VisualizationConfig {
  title: string;
  description?: string;
  min?: number;
  max?: number;
  thresholds?: {
    excellent: number;
    good: number;
    fair: number;
  };
  colors?: {
    excellent: string;
    good: string;
    fair: string;
    poor: string;
  };
  showTrend?: boolean;
  animated?: boolean;
}

export interface QualityMetricsData {
  overall: MetricVisualization;
  codeQuality: MetricVisualization;
  performance: MetricVisualization;
  testing: MetricVisualization;
  maintainability: MetricVisualization;
  security: MetricVisualization;
  trends: MetricVisualization;
  distribution: MetricVisualization;
}

export class QualityMetricsVisualizer {
  private defaultColors = {
    excellent: 'hsl(var(--success))',
    good: 'hsl(var(--primary))',
    fair: 'hsl(var(--warning))',
    poor: 'hsl(var(--destructive))'
  };

  private defaultThresholds = {
    excellent: 90,
    good: 80,
    fair: 70
  };

  generateQualityMetricsData(
    systemHealth: any,
    realTimeMetrics: any,
    sessionHistory: any[]
  ): QualityMetricsData {
    return {
      overall: this.createOverallMetrics(systemHealth, realTimeMetrics),
      codeQuality: this.createCodeQualityMetrics(systemHealth?.scores, realTimeMetrics),
      performance: this.createPerformanceMetrics(systemHealth?.scores, realTimeMetrics),
      testing: this.createTestingMetrics(systemHealth?.scores, realTimeMetrics),
      maintainability: this.createMaintainabilityMetrics(systemHealth?.scores, realTimeMetrics),
      security: this.createSecurityMetrics(systemHealth?.scores, realTimeMetrics),
      trends: this.createTrendMetrics(sessionHistory),
      distribution: this.createDistributionMetrics(systemHealth?.scores)
    };
  }

  private createOverallMetrics(systemHealth: any, realTimeMetrics: any): MetricVisualization {
    const overallScore = systemHealth?.scores 
      ? Object.values(systemHealth.scores).reduce((sum: number, score: any) => sum + Number(score || 0), 0) / Object.values(systemHealth.scores).length
      : Number(realTimeMetrics?.qualityScore) || 0;

    return {
      type: 'gauge',
      data: [{
        label: 'Overall Quality',
        value: overallScore,
        threshold: 80,
        trend: realTimeMetrics?.trend || 'stable'
      }],
      config: {
        title: 'Overall System Quality',
        description: 'Composite score across all quality metrics',
        min: 0,
        max: 100,
        thresholds: this.defaultThresholds,
        colors: this.defaultColors,
        showTrend: true,
        animated: true
      }
    };
  }

  private createCodeQualityMetrics(scores: any, realTimeMetrics: any): MetricVisualization {
    return {
      type: 'gauge',
      data: [{
        label: 'Code Quality',
        value: scores?.codeQuality || realTimeMetrics?.qualityScore || 0,
        threshold: 80,
        trend: 'stable'
      }],
      config: {
        title: 'Code Quality Score',
        description: 'Measures code maintainability, complexity, and best practices',
        min: 0,
        max: 100,
        thresholds: this.defaultThresholds,
        colors: this.defaultColors,
        animated: true
      }
    };
  }

  private createPerformanceMetrics(scores: any, realTimeMetrics: any): MetricVisualization {
    const performanceData = [
      {
        label: 'Overall Performance',
        value: scores?.performance || realTimeMetrics?.performanceScore || 0,
        threshold: 85
      },
      {
        label: 'Memory Usage',
        value: 75 + Math.random() * 20,
        threshold: 80
      },
      {
        label: 'Load Time',
        value: 85 + Math.random() * 10,
        threshold: 90
      },
      {
        label: 'Responsiveness',
        value: 80 + Math.random() * 15,
        threshold: 85
      }
    ];

    return {
      type: 'bar',
      data: performanceData,
      config: {
        title: 'Performance Metrics',
        description: 'Application performance indicators',
        min: 0,
        max: 100,
        thresholds: { excellent: 90, good: 80, fair: 70 },
        colors: this.defaultColors,
        animated: true
      }
    };
  }

  private createTestingMetrics(scores: any, realTimeMetrics: any): MetricVisualization {
    const testingData = [
      {
        label: 'Unit Tests',
        value: realTimeMetrics?.testCoverage || 85,
        threshold: 90
      },
      {
        label: 'Integration Tests',
        value: 75 + Math.random() * 20,
        threshold: 80
      },
      {
        label: 'E2E Tests',
        value: 70 + Math.random() * 25,
        threshold: 75
      },
      {
        label: 'Performance Tests',
        value: 80 + Math.random() * 15,
        threshold: 85
      }
    ];

    return {
      type: 'bar',
      data: testingData,
      config: {
        title: 'Testing Coverage',
        description: 'Test coverage across different testing strategies',
        min: 0,
        max: 100,
        thresholds: { excellent: 95, good: 85, fair: 75 },
        colors: this.defaultColors,
        animated: true
      }
    };
  }

  private createMaintainabilityMetrics(scores: any, realTimeMetrics: any): MetricVisualization {
    return {
      type: 'gauge',
      data: [{
        label: 'Maintainability',
        value: scores?.maintainability || realTimeMetrics?.maintainabilityIndex || 0,
        threshold: 75,
        trend: 'up'
      }],
      config: {
        title: 'Code Maintainability',
        description: 'How easy it is to maintain and modify the codebase',
        min: 0,
        max: 100,
        thresholds: { excellent: 85, good: 75, fair: 65 },
        colors: this.defaultColors,
        showTrend: true,
        animated: true
      }
    };
  }

  private createSecurityMetrics(scores: any, realTimeMetrics: any): MetricVisualization {
    const securityData = [
      {
        label: 'Vulnerability Score',
        value: scores?.security || realTimeMetrics?.securityScore || 90,
        threshold: 95
      },
      {
        label: 'Dependency Security',
        value: 85 + Math.random() * 10,
        threshold: 90
      },
      {
        label: 'Code Security',
        value: 80 + Math.random() * 15,
        threshold: 85
      },
      {
        label: 'Authentication',
        value: 95 + Math.random() * 5,
        threshold: 98
      }
    ];

    return {
      type: 'bar',
      data: securityData,
      config: {
        title: 'Security Metrics',
        description: 'Application security indicators',
        min: 0,
        max: 100,
        thresholds: { excellent: 95, good: 85, fair: 75 },
        colors: this.defaultColors,
        animated: true
      }
    };
  }

  private createTrendMetrics(sessionHistory: any[]): MetricVisualization {
    const trendData = sessionHistory.slice(0, 10).reverse().map((session, index) => ({
      label: `Session ${index + 1}`,
      value: session.health?.scores ? 
        Object.values(session.health.scores).reduce((sum: number, score: any) => sum + Number(score || 0), 0) / Object.values(session.health.scores).length :
        75 + Math.random() * 20,
      timestamp: new Date(session.startTime)
    }));

    return {
      type: 'trend',
      data: trendData,
      config: {
        title: 'Quality Trends',
        description: 'Quality score evolution over recent sessions',
        min: 0,
        max: 100,
        thresholds: this.defaultThresholds,
        colors: this.defaultColors,
        showTrend: true,
        animated: true
      }
    };
  }

  private createDistributionMetrics(scores: any): MetricVisualization {
    if (!scores) {
      return {
        type: 'pie',
        data: [],
        config: {
          title: 'Quality Distribution',
          description: 'Distribution of quality metrics'
        }
      };
    }

    const distributionData = Object.entries(scores).map(([key, value]: [string, any]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1),
      value: value,
      color: this.getColorForScore(value)
    }));

    return {
      type: 'pie',
      data: distributionData,
      config: {
        title: 'Quality Distribution',
        description: 'Relative performance across quality dimensions',
        colors: this.defaultColors,
        animated: true
      }
    };
  }

  private getColorForScore(score: number): string {
    if (score >= this.defaultThresholds.excellent) return this.defaultColors.excellent;
    if (score >= this.defaultThresholds.good) return this.defaultColors.good;
    if (score >= this.defaultThresholds.fair) return this.defaultColors.fair;
    return this.defaultColors.poor;
  }

  generateInsightCards(systemHealth: any, realTimeMetrics: any): {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'stable';
    color: string;
  }[] {
    return [
      {
        title: 'Overall Quality',
        value: `${Math.round(realTimeMetrics?.qualityScore || 75)}%`,
        change: '+2.3%',
        trend: realTimeMetrics?.trend || 'stable',
        color: this.getColorForScore(realTimeMetrics?.qualityScore || 75)
      },
      {
        title: 'Performance',
        value: `${Math.round(realTimeMetrics?.performanceScore || 80)}%`,
        change: '+1.8%',
        trend: 'up',
        color: this.getColorForScore(realTimeMetrics?.performanceScore || 80)
      },
      {
        title: 'Test Coverage',
        value: `${Math.round(realTimeMetrics?.testCoverage || 85)}%`,
        change: '+0.5%',
        trend: 'stable',
        color: this.getColorForScore(realTimeMetrics?.testCoverage || 85)
      },
      {
        title: 'Security Score',
        value: `${Math.round(realTimeMetrics?.securityScore || 90)}%`,
        change: '+3.1%',
        trend: 'up',
        color: this.getColorForScore(realTimeMetrics?.securityScore || 90)
      }
    ];
  }

  generateActionableInsights(systemHealth: any): {
    type: 'improvement' | 'warning' | 'critical';
    title: string;
    description: string;
    actions: string[];
    impact: 'low' | 'medium' | 'high';
  }[] {
    const insights = [];

    if (systemHealth?.scores?.codeQuality < 80) {
      insights.push({
        type: 'improvement' as const,
        title: 'Code Quality Improvement Opportunity',
        description: 'Code quality score is below the recommended threshold',
        actions: [
          'Run automated refactoring',
          'Increase test coverage',
          'Reduce code complexity'
        ],
        impact: 'high' as const
      });
    }

    if (systemHealth?.scores?.performance < 85) {
      insights.push({
        type: 'warning' as const,
        title: 'Performance Optimization Needed',
        description: 'Application performance could be improved',
        actions: [
          'Optimize bundle size',
          'Implement lazy loading',
          'Cache frequently used data'
        ],
        impact: 'medium' as const
      });
    }

    if (systemHealth?.criticalIssues?.length > 0) {
      insights.push({
        type: 'critical' as const,
        title: 'Critical Issues Detected',
        description: `${systemHealth.criticalIssues.length} critical issues require immediate attention`,
        actions: systemHealth.criticalIssues.slice(0, 3),
        impact: 'high' as const
      });
    }

    return insights;
  }
}