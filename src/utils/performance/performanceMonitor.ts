export interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

export interface MemorySnapshot {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  timestamp: number;
}

export class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private memorySnapshots: MemorySnapshot[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers(): void {
    try {
      // Observe navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`🚀 Navigation: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
        }
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);

      // Observe resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 100) { // Only log slow resources
            console.log(`📦 Slow Resource: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
          }
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);

      // Observe long tasks
      const taskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.warn(`⚠️ Long Task: ${entry.duration.toFixed(2)}ms - may block UI`);
        }
      });
      taskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(taskObserver);

    } catch (error) {
      console.warn('Some performance observers not supported:', error);
    }
  }

  startMetric(name: string, metadata?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata
    };
    this.metrics.set(name, metric);
    console.log(`⏱️ Started: ${name}`);
  }

  endMetric(name: string): number | null {
    const metric = this.metrics.get(name);
    if (!metric) {
      console.warn(`⚠️ Metric not found: ${name}`);
      return null;
    }

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;
    
    console.log(`✅ Completed: ${name} - ${metric.duration.toFixed(2)}ms`);
    
    // Log warning for slow operations
    if (metric.duration > 1000) {
      console.warn(`🐌 Slow operation detected: ${name} took ${metric.duration.toFixed(2)}ms`);
    }

    return metric.duration;
  }

  measureFunction<T>(name: string, fn: () => T, metadata?: Record<string, any>): T {
    this.startMetric(name, metadata);
    try {
      const result = fn();
      return result;
    } finally {
      this.endMetric(name);
    }
  }

  async measureAsyncFunction<T>(
    name: string, 
    fn: () => Promise<T>, 
    metadata?: Record<string, any>
  ): Promise<T> {
    this.startMetric(name, metadata);
    try {
      const result = await fn();
      return result;
    } finally {
      this.endMetric(name);
    }
  }

  takeMemorySnapshot(): MemorySnapshot | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const snapshot: MemorySnapshot = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        timestamp: Date.now()
      };
      
      this.memorySnapshots.push(snapshot);
      
      // Keep only last 100 snapshots
      if (this.memorySnapshots.length > 100) {
        this.memorySnapshots.shift();
      }
      
      return snapshot;
    }
    return null;
  }

  getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  }

  detectMemoryLeaks(): boolean {
    if (this.memorySnapshots.length < 10) return false;
    
    const recent = this.memorySnapshots.slice(-10);
    const growth = recent[recent.length - 1].usedJSHeapSize - recent[0].usedJSHeapSize;
    const growthMB = growth / 1024 / 1024;
    
    if (growthMB > 50) {
      console.warn(`🚨 Potential memory leak detected: ${growthMB.toFixed(2)}MB growth in recent snapshots`);
      return true;
    }
    
    return false;
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
    const completedMetrics = Array.from(this.metrics.values()).filter(m => m.duration !== undefined);
    const slowOperations = completedMetrics.filter(m => m.duration! > 1000);
    const averageDuration = completedMetrics.length > 0 
      ? completedMetrics.reduce((sum, m) => sum + m.duration!, 0) / completedMetrics.length 
      : 0;

    return {
      metrics: completedMetrics,
      memoryUsage: [...this.memorySnapshots],
      summary: {
        slowOperations,
        averageDuration,
        totalOperations: completedMetrics.length,
        memoryLeakDetected: this.detectMemoryLeaks()
      }
    };
  }

  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
    this.memorySnapshots = [];
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
