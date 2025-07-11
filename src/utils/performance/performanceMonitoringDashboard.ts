import { performanceMonitor } from './performanceMonitor';
import { performancePolicyEngine } from './performancePolicies';
import { analysisCache } from './cachingStrategy';
import { analyticsTaskQueue } from './loadBalancer';

export interface PerformanceDashboardData {
  currentMetrics: {
    responseTime: number;
    memoryUsage: number;
    cpuUsage: number;
    cacheHitRate: number;
    queueLength: number;
  };
  policyCompliance: {
    overall: 'passed' | 'warning' | 'failed';
    violations: Array<{ metric: string; message: string; severity: string; }>;
  };
  trends: {
    responseTimeTrend: Array<{ timestamp: number; value: number; }>;
    memoryTrend: Array<{ timestamp: number; value: number; }>;
    errorRateTrend: Array<{ timestamp: number; value: number; }>;
  };
  systemHealth: {
    uptime: number;
    errorRate: number;
    throughput: number;
    activeUsers: number;
  };
  recommendations: Array<{
    type: 'optimization' | 'scaling' | 'caching' | 'refactoring';
    priority: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    impact: string;
  }>;
}

export class PerformanceMonitoringDashboard {
  private metricsHistory: Array<{ timestamp: number; metrics: any }> = [];
  private alertThresholds = {
    responseTime: 500,
    memoryUsage: 100,
    errorRate: 5,
    cacheHitRate: 70
  };

  generateDashboardData(): PerformanceDashboardData {
    const currentMetrics = this.getCurrentMetrics();
    const policyCompliance = this.checkPolicyCompliance(currentMetrics);
    const trends = this.calculateTrends();
    const systemHealth = this.calculateSystemHealth();
    const recommendations = this.generateRecommendations(currentMetrics, policyCompliance);

    return {
      currentMetrics,
      policyCompliance,
      trends,
      systemHealth,
      recommendations
    };
  }

  private getCurrentMetrics() {
    const memoryUsage = performanceMonitor.getMemoryUsage();
    const cacheStats = analysisCache.getStats();
    const queueStats = analyticsTaskQueue.getQueueStats();
    
    return {
      responseTime: this.getAverageResponseTime(),
      memoryUsage,
      cpuUsage: this.getCPUUsage(),
      cacheHitRate: cacheStats.hitRate,
      queueLength: queueStats.totalTasks
    };
  }

  private checkPolicyCompliance(metrics: any) {
    return performancePolicyEngine.generatePerformanceReport({
      responseTime: metrics.responseTime,
      memoryUsage: metrics.memoryUsage,
      bundleSize: this.estimateBundleSize()
    });
  }

  private calculateTrends() {
    const now = Date.now();
    const last24Hours = now - 24 * 60 * 60 * 1000;
    
    const recentMetrics = this.metricsHistory.filter(m => m.timestamp > last24Hours);
    
    return {
      responseTimeTrend: recentMetrics.map(m => ({ 
        timestamp: m.timestamp, 
        value: m.metrics.responseTime || 0 
      })),
      memoryTrend: recentMetrics.map(m => ({ 
        timestamp: m.timestamp, 
        value: m.metrics.memoryUsage || 0 
      })),
      errorRateTrend: recentMetrics.map(m => ({ 
        timestamp: m.timestamp, 
        value: m.metrics.errorRate || 0 
      }))
    };
  }

  private calculateSystemHealth() {
    const uptime = performance.now();
    const errorRate = this.calculateErrorRate();
    const throughput = this.calculateThroughput();
    const activeUsers = this.estimateActiveUsers();

    return {
      uptime,
      errorRate,
      throughput,
      activeUsers
    };
  }

  private generateRecommendations(metrics: any, compliance: any): Array<{
    type: 'optimization' | 'scaling' | 'caching' | 'refactoring';
    priority: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    impact: string;
  }> {
    const recommendations = [];

    // High response time
    if (metrics.responseTime > this.alertThresholds.responseTime) {
      recommendations.push({
        type: 'optimization' as const,
        priority: 'high' as const,
        message: 'Response time exceeds threshold. Consider optimizing database queries and API calls.',
        impact: 'Improve user experience and reduce bounce rate'
      });
    }

    // High memory usage
    if (metrics.memoryUsage > this.alertThresholds.memoryUsage) {
      recommendations.push({
        type: 'optimization' as const,
        priority: 'high' as const,
        message: 'Memory usage is high. Review for memory leaks and optimize data structures.',
        impact: 'Prevent crashes and improve stability'
      });
    }

    // Low cache hit rate
    if (metrics.cacheHitRate < this.alertThresholds.cacheHitRate) {
      recommendations.push({
        type: 'caching' as const,
        priority: 'medium' as const,
        message: 'Cache hit rate is low. Review caching strategy and TTL settings.',
        impact: 'Reduce database load and improve response times'
      });
    }

    // High queue length
    if (metrics.queueLength > 10) {
      recommendations.push({
        type: 'scaling' as const,
        priority: 'medium' as const,
        message: 'Task queue is growing. Consider adding more workers or optimizing task processing.',
        impact: 'Reduce processing delays and improve throughput'
      });
    }

    // Policy violations
    compliance.results.forEach(result => {
      if (!result.passed && result.severity === 'critical') {
        recommendations.push({
          type: 'refactoring' as const,
          priority: 'critical' as const,
          message: `Critical policy violation: ${result.message}`,
          impact: 'Maintain code quality and system stability'
        });
      }
    });

    return recommendations;
  }

  private getAverageResponseTime(): number {
    const recentMetrics = this.metricsHistory.slice(-10);
    if (recentMetrics.length === 0) return 0;
    
    const total = recentMetrics.reduce((sum, m) => sum + (m.metrics.responseTime || 0), 0);
    return total / recentMetrics.length;
  }

  private getCPUUsage(): number {
    // Simulate CPU usage calculation
    return Math.random() * 100;
  }

  private calculateErrorRate(): number {
    const recentMetrics = this.metricsHistory.slice(-100);
    if (recentMetrics.length === 0) return 0;
    
    const errors = recentMetrics.filter(m => m.metrics.hasError).length;
    return (errors / recentMetrics.length) * 100;
  }

  private calculateThroughput(): number {
    const recentMetrics = this.metricsHistory.slice(-60); // Last minute
    return recentMetrics.length;
  }

  private estimateActiveUsers(): number {
    // Simulate active user estimation
    return Math.floor(Math.random() * 50) + 10;
  }

  private estimateBundleSize(): number {
    // Simulate bundle size calculation
    return 180; // KB
  }

  recordMetric(metrics: any): void {
    this.metricsHistory.push({
      timestamp: Date.now(),
      metrics
    });
    
    // Keep only last 1000 entries
    if (this.metricsHistory.length > 1000) {
      this.metricsHistory = this.metricsHistory.slice(-1000);
    }
  }

  startMonitoring(): void {
    // Record metrics every 30 seconds
    setInterval(() => {
      const metrics = this.getCurrentMetrics();
      this.recordMetric(metrics);
      
      // Check for alerts
      this.checkAlerts(metrics);
    }, 30000);
  }

  private checkAlerts(metrics: any): void {
    const alerts = [];
    
    if (metrics.responseTime > this.alertThresholds.responseTime) {
      alerts.push(`High response time: ${metrics.responseTime}ms`);
    }
    
    if (metrics.memoryUsage > this.alertThresholds.memoryUsage) {
      alerts.push(`High memory usage: ${metrics.memoryUsage}MB`);
    }
    
    if (alerts.length > 0) {
      console.warn('🚨 Performance Alerts:', alerts);
      
      // Dispatch custom event for UI notifications
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('performance-alert', {
          detail: { alerts, metrics }
        }));
      }
    }
  }
}

export const performanceDashboard = new PerformanceMonitoringDashboard();

// Auto-start monitoring in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  performanceDashboard.startMonitoring();
}
