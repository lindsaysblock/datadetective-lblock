export class PerformanceOptimizer {
  private performanceMetrics = new Map<string, number>();
  private memorySnapshots: Array<{ timestamp: Date; usage: number }> = [];

  recordMetric(name: string, value: number): void {
    this.performanceMetrics.set(name, value);
  }

  getMetrics(): Map<string, number> {
    return new Map(this.performanceMetrics);
  }

  calculateSystemEfficiency(): number {
    const metrics = Array.from(this.performanceMetrics.values());
    if (metrics.length === 0) return 100;
    
    const avgMetric = metrics.reduce((sum, val) => sum + val, 0) / metrics.length;
    return Math.max(0, Math.min(100, 100 - (avgMetric / 1000) * 10));
  }

  calculateMemoryEfficiency(): number {
    if (this.memorySnapshots.length === 0) return 100;
    
    const latestSnapshot = this.memorySnapshots[this.memorySnapshots.length - 1];
    const memoryUsageMB = latestSnapshot.usage / (1024 * 1024);
    
    // Consider efficient if under 50MB, declining efficiency above that
    return Math.max(0, Math.min(100, 100 - Math.max(0, (memoryUsageMB - 50) * 2)));
  }

  takeMemorySnapshot(): void {
    if ('memory' in performance) {
      const usage = (performance as any).memory.usedJSHeapSize;
      this.memorySnapshots.push({
        timestamp: new Date(),
        usage
      });
      
      // Keep only last 10 snapshots
      if (this.memorySnapshots.length > 10) {
        this.memorySnapshots.shift();
      }
    }
  }

  detectMemoryLeaks(): boolean {
    if (this.memorySnapshots.length < 3) return false;
    
    const recent = this.memorySnapshots.slice(-3);
    const isIncreasing = recent.every((snapshot, index) => {
      if (index === 0) return true;
      return snapshot.usage > recent[index - 1].usage;
    });
    
    return isIncreasing && (recent[2].usage - recent[0].usage) > 10 * 1024 * 1024; // 10MB increase
  }

  clearMetrics(): void {
    this.performanceMetrics.clear();
    this.memorySnapshots.length = 0;
  }
}
