
export interface PerformanceMetric {
  name: string;
  duration?: number;
  startTime: number;
  endTime?: number;
  metadata?: Record<string, any>;
}

export interface MemorySnapshot {
  timestamp: number;
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

export class MetricsCollector {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private completedMetrics: PerformanceMetric[] = [];

  startMetric(name: string, metadata?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata
    };
    this.metrics.set(name, metric);
  }

  endMetric(name: string): number | null {
    const metric = this.metrics.get(name);
    if (!metric) return null;

    const endTime = performance.now();
    const duration = endTime - metric.startTime;
    
    const completedMetric: PerformanceMetric = {
      ...metric,
      endTime,
      duration
    };
    
    this.completedMetrics.push(completedMetric);
    this.metrics.delete(name);
    
    return duration;
  }

  measureFunction<T>(name: string, fn: () => T, metadata?: Record<string, any>): T {
    this.startMetric(name, metadata);
    try {
      const result = fn();
      this.endMetric(name);
      return result;
    } catch (error) {
      this.endMetric(name);
      throw error;
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
      this.endMetric(name);
      return result;
    } catch (error) {
      this.endMetric(name);
      throw error;
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.completedMetrics];
  }

  clearMetrics(): void {
    this.metrics.clear();
    this.completedMetrics = [];
  }
}
