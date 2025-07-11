import type { MemorySnapshot } from './metricsCollector';

export class MemoryManager {
  private snapshots: MemorySnapshot[] = [];
  private lastSnapshot: MemorySnapshot | null = null;

  takeSnapshot(): MemorySnapshot | null {
    if (!('memory' in performance)) {
      return null;
    }

    const memory = (performance as any).memory;
    const snapshot: MemorySnapshot = {
      timestamp: Date.now(),
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit
    };

    this.snapshots.push(snapshot);
    this.lastSnapshot = snapshot;
    
    // Keep only last 100 snapshots
    if (this.snapshots.length > 100) {
      this.snapshots = this.snapshots.slice(-100);
    }

    return snapshot;
  }

  getMemoryUsage(): number {
    if (!('memory' in performance)) {
      return 0;
    }

    const memory = (performance as any).memory;
    return memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
  }

  detectMemoryLeaks(): boolean {
    if (this.snapshots.length < 2) return false;

    const recent = this.snapshots.slice(-10);
    const trend = recent.reduce((acc, snapshot, index) => {
      if (index === 0) return acc;
      const prev = recent[index - 1];
      return acc + (snapshot.usedJSHeapSize - prev.usedJSHeapSize);
    }, 0);

    // If memory usage is consistently increasing by more than 5MB
    return trend > 5 * 1024 * 1024;
  }

  getSnapshots(): MemorySnapshot[] {
    return [...this.snapshots];
  }

  clearSnapshots(): void {
    this.snapshots = [];
    this.lastSnapshot = null;
  }
}
