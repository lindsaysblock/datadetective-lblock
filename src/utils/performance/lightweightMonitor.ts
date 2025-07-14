
// Lightweight performance monitor to replace heavy monitoring systems
export class LightweightPerformanceMonitor {
  private static instance: LightweightPerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private startTimes: Map<string, number> = new Map();

  static getInstance(): LightweightPerformanceMonitor {
    if (!LightweightPerformanceMonitor.instance) {
      LightweightPerformanceMonitor.instance = new LightweightPerformanceMonitor();
    }
    return LightweightPerformanceMonitor.instance;
  }

  startTimer(name: string): void {
    this.startTimes.set(name, performance.now());
  }

  endTimer(name: string): number {
    const startTime = this.startTimes.get(name);
    if (!startTime) return 0;
    
    const duration = performance.now() - startTime;
    this.metrics.set(name, duration);
    this.startTimes.delete(name);
    
    // Only log slow operations (>1000ms)
    if (duration > 1000) {
      console.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`);
    }
    
    return duration;
  }

  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  clearMetrics(): void {
    this.metrics.clear();
    this.startTimes.clear();
  }
}

export const lightweightMonitor = LightweightPerformanceMonitor.getInstance();
