export interface MemorySnapshot {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  timestamp: number;
}

export class MemoryManager {
  private memorySnapshots: MemorySnapshot[] = [];
  private readonly MAX_SNAPSHOTS = 100;

  takeSnapshot(): MemorySnapshot | null {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const snapshot: MemorySnapshot = {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        timestamp: Date.now()
      };
      
      this.memorySnapshots.push(snapshot);
      
      // Keep only last MAX_SNAPSHOTS snapshots
      if (this.memorySnapshots.length > this.MAX_SNAPSHOTS) {
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

  getSnapshots(): MemorySnapshot[] {
    return [...this.memorySnapshots];
  }

  clearSnapshots(): void {
    this.memorySnapshots = [];
  }
}
