
export interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, any>;
}

export class MetricsCollector {
  private metrics: Map<string, PerformanceMetric> = new Map();

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

  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values()).filter(m => m.duration !== undefined);
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}
