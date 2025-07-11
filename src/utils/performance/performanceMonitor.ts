
import { MemoryManager } from './memoryManager';
import { MetricsCollector, type PerformanceMetric, type MemorySnapshot } from './metricsCollector';
import { PerformanceObservers } from './performanceObservers';

export type { PerformanceMetric, MemorySnapshot };

export class PerformanceMonitor {
  private memoryManager = new MemoryManager();
  private metricsCollector = new MetricsCollector();
  private performanceObservers = new PerformanceObservers();

  constructor() {
    this.performanceObservers.initialize();
  }

  startMetric(name: string, metadata?: Record<string, any>): void {
    this.metricsCollector.startMetric(name, metadata);
  }

  endMetric(name: string): number | null {
    return this.metricsCollector.endMetric(name);
  }

  measureFunction<T>(name: string, fn: () => T, metadata?: Record<string, any>): T {
    return this.metricsCollector.measureFunction(name, fn, metadata);
  }

  async measureAsyncFunction<T>(
    name: string, 
    fn: () => Promise<T>, 
    metadata?: Record<string, any>
  ): Promise<T> {
    return this.metricsCollector.measureAsyncFunction(name, fn, metadata);
  }

  takeMemorySnapshot(): MemorySnapshot | null {
    return this.memoryManager.takeSnapshot();
  }

  getMemoryUsage(): number {
    return this.memoryManager.getMemoryUsage();
  }

  detectMemoryLeaks(): boolean {
    return this.memoryManager.detectMemoryLeaks();
  }

  generateReport(): {
    metrics: PerformanceMetric[];
    memoryUsage: MemorySnapshot[];
    summary: {
      slowOperations: PerformanceMetric[];
      averageDuration: number;
      totalOperations: number;
      memoryLeakDetected: boolean;
    };
  } {
    const completedMetrics = this.metricsCollector.getMetrics();
    const slowOperations = completedMetrics.filter(m => m.duration! > 1000);
    const averageDuration = completedMetrics.length > 0 
      ? completedMetrics.reduce((sum, m) => sum + m.duration!, 0) / completedMetrics.length 
      : 0;

    return {
      metrics: completedMetrics,
      memoryUsage: this.memoryManager.getSnapshots(),
      summary: {
        slowOperations,
        averageDuration,
        totalOperations: completedMetrics.length,
        memoryLeakDetected: this.memoryManager.detectMemoryLeaks()
      }
    };
  }

  cleanup(): void {
    this.performanceObservers.cleanup();
    this.metricsCollector.clearMetrics();
    this.memoryManager.clearSnapshots();
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions
export const measureRender = <T>(componentName: string, renderFn: () => T): T => {
  return performanceMonitor.measureFunction(`Render: ${componentName}`, renderFn);
};

export const measureAsync = async <T>(operationName: string, asyncFn: () => Promise<T>): Promise<T> => {
  return performanceMonitor.measureAsyncFunction(operationName, asyncFn);
};

export const trackMemory = (): MemorySnapshot | null => {
  return performanceMonitor.takeMemorySnapshot();
};
