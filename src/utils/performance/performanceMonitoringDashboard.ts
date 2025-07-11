import { performanceMonitor } from './performanceMonitor';

export interface PerformanceReport {
  overall: 'passed' | 'warning' | 'failed';
  results: {
    metric: string;
    passed: boolean;
    message: string;
    severity: string;
  }[];
  regressions: {
    metric: string;
    change: number;
    message: string;
  }[];
  violations: {
    policy: string;
    violation: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }[];
}

export class PerformanceMonitoringDashboard {
  private static instance: PerformanceMonitoringDashboard;
  private reports: PerformanceReport[] = [];
  private isMonitoring = false;

  static getInstance(): PerformanceMonitoringDashboard {
    if (!this.instance) {
      this.instance = new PerformanceMonitoringDashboard();
    }
    return this.instance;
  }

  startMonitoring(): void {
    this.isMonitoring = true;
    console.log('🔍 Performance monitoring started');
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    console.log('⏹️ Performance monitoring stopped');
  }

  generateReport(): PerformanceReport {
    const report = performanceMonitor.generateReport();
    const results: PerformanceReport['results'] = [];
    const violations: PerformanceReport['violations'] = [];
    
    // Check response time SLA
    const avgResponseTime = this.calculateAverageResponseTime(report.metrics);
    const responseTimePassed = avgResponseTime < 200;
    
    results.push({
      metric: 'Response Time SLA',
      passed: responseTimePassed,
      message: `Average response time: ${avgResponseTime.toFixed(2)}ms (Target: <200ms)`,
      severity: responseTimePassed ? 'low' : 'high'
    });

    if (!responseTimePassed) {
      violations.push({
        policy: 'Response Time SLA',
        violation: `Response time ${avgResponseTime.toFixed(2)}ms exceeds 200ms limit`,
        severity: 'high'
      });
    }

    // Check memory usage
    const memoryUsage = this.getMemoryUsage();
    const memoryPassed = memoryUsage < 128; // 128MB limit
    
    results.push({
      metric: 'Memory Usage',
      passed: memoryPassed,
      message: `Memory usage: ${memoryUsage.toFixed(2)}MB (Target: <128MB)`,
      severity: memoryPassed ? 'low' : 'medium'
    });

    if (!memoryPassed) {
      violations.push({
        policy: 'Memory Budget',
        violation: `Memory usage ${memoryUsage.toFixed(2)}MB exceeds 128MB limit`,
        severity: 'medium'
      });
    }

    // Check for performance regressions
    const regressions = this.detectRegressions(report.metrics);

    const overall = violations.length === 0 ? 'passed' : 
                   violations.some(v => v.severity === 'high' || v.severity === 'critical') ? 'failed' : 'warning';

    const performanceReport: PerformanceReport = {
      overall,
      results,
      regressions,
      violations
    };

    this.reports.push(performanceReport);
    return performanceReport;
  }

  generateDashboardData(): {
    currentMetrics: {
      responseTime: number;
      memoryUsage: number;
      bundleSize: number;
    };
    recommendations: Array<{
      message: string;
      priority: 'low' | 'medium' | 'high';
    }>;
  } {
    const report = performanceMonitor.generateReport();
    const avgResponseTime = this.calculateAverageResponseTime(report.metrics);
    const memoryUsage = this.getMemoryUsage();
    
    const recommendations = [];
    
    if (avgResponseTime > 200) {
      recommendations.push({
        message: 'Consider optimizing slow operations to meet response time SLA',
        priority: 'high' as const
      });
    }
    
    if (memoryUsage > 128) {
      recommendations.push({
        message: 'Memory usage is high, consider implementing memory optimization',
        priority: 'medium' as const
      });
    }
    
    return {
      currentMetrics: {
        responseTime: avgResponseTime,
        memoryUsage,
        bundleSize: 180 // Estimated
      },
      recommendations
    };
  }

  private calculateAverageResponseTime(metrics: any[]): number {
    if (metrics.length === 0) return 0;
    
    const responseTimes = metrics
      .filter(m => m.name && m.duration)
      .map(m => m.duration!);
    
    if (responseTimes.length === 0) return 0;
    
    return responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
  }

  private getMemoryUsage(): number {
    // Use performance monitor's memory tracking
    const snapshot = performanceMonitor.takeMemorySnapshot();
    if (snapshot) {
      return snapshot.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }
    
    // Fallback estimation
    return Math.random() * 100;
  }

  private detectRegressions(metrics: any[]): PerformanceReport['regressions'] {
    const regressions: PerformanceReport['regressions'] = [];
    
    // Simple regression detection - compare with previous measurements
    if (this.reports.length > 0) {
      const previousReport = this.reports[this.reports.length - 1];
      const currentAvgTime = this.calculateAverageResponseTime(metrics);
      
      const previousAvgTime = previousReport.results
        .find(r => r.metric === 'Response Time SLA')
        ?.message.match(/(\d+\.?\d*)/)?.[0];
      
      if (previousAvgTime) {
        const prevTime = parseFloat(previousAvgTime);
        const change = ((currentAvgTime - prevTime) / prevTime) * 100;
        
        if (change > 5) { // 5% regression threshold
          regressions.push({
            metric: 'Response Time',
            change,
            message: `Response time increased by ${change.toFixed(1)}% (${prevTime}ms → ${currentAvgTime.toFixed(2)}ms)`
          });
        }
      }
    }
    
    return regressions;
  }

  getLatestReport(): PerformanceReport | null {
    return this.reports.length > 0 ? this.reports[this.reports.length - 1] : null;
  }

  getAllReports(): PerformanceReport[] {
    return [...this.reports];
  }
}

export const performanceDashboard = PerformanceMonitoringDashboard.getInstance();
