import { diskIOOptimizer } from '../../performance/diskIOOptimizer';

export class PerformanceOptimizer {
  private performanceMetrics = new Map<string, number>();
  private memorySnapshots: Array<{ timestamp: Date; usage: number }> = [];
  private ioMetrics = { reads: 0, writes: 0, cacheHits: 0 };

  recordMetric(name: string, value: number): void {
    this.performanceMetrics.set(name, value);
    
    // Use deferred write for metric storage
    diskIOOptimizer.deferredWrite(`metric_${name}`, {
      name,
      value,
      timestamp: Date.now()
    });
  }

  recordIOOperation(type: 'read' | 'write' | 'cache_hit'): void {
    switch (type) {
      case 'read':
        this.ioMetrics.reads++;
        break;
      case 'write':
        this.ioMetrics.writes++;
        break;
      case 'cache_hit':
        this.ioMetrics.cacheHits++;
        break;
    }
  }

  getMetrics(): Map<string, number> {
    return new Map(this.performanceMetrics);
  }

  getIOMetrics(): { reads: number; writes: number; cacheHits: number; efficiency: number } {
    const totalOps = this.ioMetrics.reads + this.ioMetrics.writes;
    const efficiency = totalOps > 0 ? (this.ioMetrics.cacheHits / totalOps) * 100 : 100;
    
    return {
      ...this.ioMetrics,
      efficiency
    };
  }

  calculateSystemEfficiency(): number {
    const ioEfficiency = this.getIOMetrics().efficiency;
    const metrics = Array.from(this.performanceMetrics.values());
    
    if (metrics.length === 0) return ioEfficiency;
    
    const avgMetric = metrics.reduce((sum, val) => sum + val, 0) / metrics.length;
    const computeEfficiency = Math.max(0, Math.min(100, 100 - (avgMetric / 1000) * 10));
    
    // Weight I/O efficiency higher since it's our focus
    return (ioEfficiency * 0.7) + (computeEfficiency * 0.3);
  }

  calculateMemoryEfficiency(): number {
    if (this.memorySnapshots.length === 0) return 100;
    
    const latestSnapshot = this.memorySnapshots[this.memorySnapshots.length - 1];
    const memoryUsageMB = latestSnapshot.usage / (1024 * 1024);
    
    // More aggressive memory efficiency calculation
    return Math.max(0, Math.min(100, 100 - Math.max(0, (memoryUsageMB - 25) * 4)));
  }

  takeMemorySnapshot(): void {
    if ('memory' in performance) {
      const usage = (performance as any).memory.usedJSHeapSize;
      this.memorySnapshots.push({
        timestamp: new Date(),
        usage
      });
      
      // Keep only last 5 snapshots for reduced memory usage
      if (this.memorySnapshots.length > 5) {
        this.memorySnapshots.shift();
      }
      
      // Record as I/O operation
      this.recordIOOperation('read');
    }
  }

  detectMemoryLeaks(): boolean {
    if (this.memorySnapshots.length < 3) return false;
    
    const recent = this.memorySnapshots.slice(-3);
    const isIncreasing = recent.every((snapshot, index) => {
      if (index === 0) return true;
      return snapshot.usage > recent[index - 1].usage;
    });
    
    return isIncreasing && (recent[2].usage - recent[0].usage) > 5 * 1024 * 1024; // 5MB increase
  }

  optimizeIO(): void {
    // Trigger cache optimization
    diskIOOptimizer.flushPendingWrites();
    
    // Clear old metrics to free memory
    const cutoffTime = Date.now() - 5 * 60 * 1000; // 5 minutes
    const recentMetrics = new Map<string, number>();
    
    for (const [key, value] of this.performanceMetrics) {
      if (value > cutoffTime) {
        recentMetrics.set(key, value);
      }
    }
    
    this.performanceMetrics = recentMetrics;
    
    console.log('🚀 I/O optimization completed');
  }

  clearMetrics(): void {
    this.performanceMetrics.clear();
    this.memorySnapshots.length = 0;
    this.ioMetrics = { reads: 0, writes: 0, cacheHits: 0 };
    
    // Clear related caches
    diskIOOptimizer.cleanup();
  }
}
