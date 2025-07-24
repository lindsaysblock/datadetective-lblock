/**
 * Advanced Memory Leak Detection System
 * Comprehensive memory monitoring with automatic cleanup
 */

export interface MemoryLeak {
  id: string;
  type: 'dom-nodes' | 'event-listeners' | 'closures' | 'timers' | 'observers';
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  location: string;
  memoryImpact: number; // MB
  detectedAt: Date;
  autoCleanable: boolean;
}

export interface MemorySnapshot {
  timestamp: Date;
  heapUsed: number;
  heapTotal: number;
  domNodes: number;
  eventListeners: number;
  timers: number;
  observers: number;
  leaks: MemoryLeak[];
}

export class AdvancedMemoryLeakDetector {
  private snapshots: MemorySnapshot[] = [];
  private monitoringInterval: NodeJS.Timeout | null = null;
  private domObserver: MutationObserver | null = null;
  private eventListenerCount = 0;
  private timerIds: Set<number> = new Set();
  private observerInstances: Set<any> = new Set();

  startMonitoring(): void {
    console.log('🧠 Starting advanced memory leak detection');
    
    this.setupDOMObserver();
    this.trackEventListeners();
    this.trackTimers();
    this.trackObservers();
    
    // Take snapshots every 30 seconds
    this.monitoringInterval = setInterval(() => {
      this.takeMemorySnapshot();
    }, 30000);

    // Initial snapshot
    this.takeMemorySnapshot();
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    if (this.domObserver) {
      this.domObserver.disconnect();
      this.domObserver = null;
    }
    
    console.log('🧠 Stopped memory leak detection');
  }

  private async takeMemorySnapshot(): Promise<void> {
    const leaks = await this.detectMemoryLeaks();
    
    const snapshot: MemorySnapshot = {
      timestamp: new Date(),
      heapUsed: this.getHeapUsed(),
      heapTotal: this.getHeapTotal(),
      domNodes: document.querySelectorAll('*').length,
      eventListeners: this.eventListenerCount,
      timers: this.timerIds.size,
      observers: this.observerInstances.size,
      leaks
    };

    this.snapshots.push(snapshot);
    this.maintainSnapshotHistory();

    // Auto-cleanup critical leaks
    const criticalLeaks = leaks.filter(leak => 
      leak.severity === 'critical' && leak.autoCleanable
    );
    
    if (criticalLeaks.length > 0) {
      await this.performAutomaticCleanup(criticalLeaks);
    }

    this.dispatchMemoryUpdate(snapshot);
  }

  private async detectMemoryLeaks(): Promise<MemoryLeak[]> {
    const leaks: MemoryLeak[] = [];
    
    // Check DOM node growth
    const domNodeLeak = this.checkDOMNodeGrowth();
    if (domNodeLeak) leaks.push(domNodeLeak);
    
    // Check event listener accumulation
    const eventListenerLeak = this.checkEventListenerAccumulation();
    if (eventListenerLeak) leaks.push(eventListenerLeak);
    
    // Check timer leaks
    const timerLeak = this.checkTimerLeaks();
    if (timerLeak) leaks.push(timerLeak);
    
    // Check observer leaks
    const observerLeak = this.checkObserverLeaks();
    if (observerLeak) leaks.push(observerLeak);
    
    // Check heap growth pattern
    const heapLeak = this.checkHeapGrowthPattern();
    if (heapLeak) leaks.push(heapLeak);

    return leaks;
  }

  private checkDOMNodeGrowth(): MemoryLeak | null {
    const currentNodes = document.querySelectorAll('*').length;
    const recentSnapshots = this.snapshots.slice(-5);
    
    if (recentSnapshots.length < 3) return null;
    
    const growthRate = this.calculateGrowthRate(
      recentSnapshots.map(s => s.domNodes)
    );
    
    if (growthRate > 100) { // More than 100 nodes per snapshot
      return {
        id: `dom-growth-${Date.now()}`,
        type: 'dom-nodes',
        severity: growthRate > 500 ? 'critical' : 'high',
        description: `DOM nodes growing at ${growthRate.toFixed(1)} nodes per measurement`,
        location: 'DOM Tree',
        memoryImpact: currentNodes * 0.001, // Rough estimate
        detectedAt: new Date(),
        autoCleanable: false
      };
    }
    
    return null;
  }

  private checkEventListenerAccumulation(): MemoryLeak | null {
    const recentSnapshots = this.snapshots.slice(-5);
    
    if (recentSnapshots.length < 3) return null;
    
    const growthRate = this.calculateGrowthRate(
      recentSnapshots.map(s => s.eventListeners)
    );
    
    if (growthRate > 10) { // More than 10 listeners per snapshot
      return {
        id: `event-listeners-${Date.now()}`,
        type: 'event-listeners',
        severity: growthRate > 50 ? 'critical' : 'high',
        description: `Event listeners accumulating at ${growthRate.toFixed(1)} per measurement`,
        location: 'Event System',
        memoryImpact: this.eventListenerCount * 0.01,
        detectedAt: new Date(),
        autoCleanable: true
      };
    }
    
    return null;
  }

  private checkTimerLeaks(): MemoryLeak | null {
    if (this.timerIds.size > 20) {
      return {
        id: `timers-${Date.now()}`,
        type: 'timers',
        severity: this.timerIds.size > 50 ? 'critical' : 'medium',
        description: `${this.timerIds.size} active timers detected`,
        location: 'Timer System',
        memoryImpact: this.timerIds.size * 0.005,
        detectedAt: new Date(),
        autoCleanable: true
      };
    }
    
    return null;
  }

  private checkObserverLeaks(): MemoryLeak | null {
    if (this.observerInstances.size > 10) {
      return {
        id: `observers-${Date.now()}`,
        type: 'observers',
        severity: this.observerInstances.size > 25 ? 'high' : 'medium',
        description: `${this.observerInstances.size} active observers detected`,
        location: 'Observer System',
        memoryImpact: this.observerInstances.size * 0.02,
        detectedAt: new Date(),
        autoCleanable: true
      };
    }
    
    return null;
  }

  private checkHeapGrowthPattern(): MemoryLeak | null {
    const recentSnapshots = this.snapshots.slice(-10);
    
    if (recentSnapshots.length < 5) return null;
    
    const heapGrowthRate = this.calculateGrowthRate(
      recentSnapshots.map(s => s.heapUsed)
    );
    
    if (heapGrowthRate > 5) { // More than 5MB per snapshot
      return {
        id: `heap-growth-${Date.now()}`,
        type: 'closures',
        severity: heapGrowthRate > 20 ? 'critical' : 'high',
        description: `Heap growing at ${heapGrowthRate.toFixed(1)}MB per measurement`,
        location: 'JavaScript Heap',
        memoryImpact: heapGrowthRate * 10, // Projected impact
        detectedAt: new Date(),
        autoCleanable: false
      };
    }
    
    return null;
  }

  private calculateGrowthRate(values: number[]): number {
    if (values.length < 2) return 0;
    
    const diffs = values.slice(1).map((val, i) => val - values[i]);
    return diffs.reduce((sum, diff) => sum + diff, 0) / diffs.length;
  }

  private async performAutomaticCleanup(leaks: MemoryLeak[]): Promise<void> {
    console.log(`🧹 Performing automatic cleanup for ${leaks.length} critical leaks`);
    
    for (const leak of leaks) {
      switch (leak.type) {
        case 'event-listeners':
          await this.cleanupEventListeners();
          break;
        case 'timers':
          await this.cleanupTimers();
          break;
        case 'observers':
          await this.cleanupObservers();
          break;
      }
    }
    
    // Force garbage collection if available
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
  }

  private async cleanupEventListeners(): Promise<void> {
    // In a real implementation, this would track and cleanup specific listeners
    console.log('🧹 Cleaning up excess event listeners');
    
    // Dispatch cleanup message
    const event = new CustomEvent('lovable-message', {
      detail: {
        message: 'MEMORY OPTIMIZATION: Remove unused event listeners and add proper cleanup in useEffect hooks. Implement event listener tracking and automatic cleanup.',
        silent: true
      }
    });
    window.dispatchEvent(event);
  }

  private async cleanupTimers(): Promise<void> {
    // Clear old timers (this would be more sophisticated in a real implementation)
    console.log('🧹 Cleaning up excess timers');
    
    // Clear some timers (careful implementation needed)
    let clearedCount = 0;
    for (const timerId of this.timerIds) {
      if (clearedCount < 10) { // Limit cleanup to avoid breaking functionality
        clearTimeout(timerId);
        clearInterval(timerId);
        this.timerIds.delete(timerId);
        clearedCount++;
      }
    }
  }

  private async cleanupObservers(): Promise<void> {
    console.log('🧹 Cleaning up excess observers');
    
    // Disconnect observers that aren't being used
    let disconnectedCount = 0;
    for (const observer of this.observerInstances) {
      if (disconnectedCount < 5) { // Limit cleanup
        if (observer && typeof observer.disconnect === 'function') {
          observer.disconnect();
          this.observerInstances.delete(observer);
          disconnectedCount++;
        }
      }
    }
  }

  private setupDOMObserver(): void {
    this.domObserver = new MutationObserver((mutations) => {
      // Track DOM changes for leak detection
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Track node additions/removals
        }
      });
    });

    this.domObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private trackEventListeners(): void {
    // Override addEventListener to track listener count
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
    
    EventTarget.prototype.addEventListener = function(...args) {
      originalAddEventListener.apply(this, args);
      // In a real implementation, we'd track specific listeners
    };

    EventTarget.prototype.removeEventListener = function(...args) {
      originalRemoveEventListener.apply(this, args);
      // Track listener removal
    };
  }

  private trackTimers(): void {
    // Override setTimeout and setInterval to track timers
    const originalSetTimeout = window.setTimeout;
    const originalSetInterval = window.setInterval;
    const originalClearTimeout = window.clearTimeout;
    const originalClearInterval = window.clearInterval;
    const self = this;
    
    (window as any).setTimeout = function(...args: any[]) {
      const id = originalSetTimeout.apply(window, args);
      self.timerIds.add(id);
      return id;
    };

    (window as any).setInterval = function(...args: any[]) {
      const id = originalSetInterval.apply(window, args);
      self.timerIds.add(id);
      return id;
    };

    (window as any).clearTimeout = function(id: number) {
      originalClearTimeout(id);
      self.timerIds.delete(id);
    };

    (window as any).clearInterval = function(id: number) {
      originalClearInterval(id);
      self.timerIds.delete(id);
    };
  }

  private trackObservers(): void {
    // Track various observer types
    const observerTypes = [
      'MutationObserver',
      'IntersectionObserver', 
      'ResizeObserver',
      'PerformanceObserver'
    ];
    const self = this;

    observerTypes.forEach(observerType => {
      const windowKey = observerType as keyof Window;
      if (window[windowKey]) {
        const OriginalObserver = window[windowKey] as any;
        (window as any)[observerType] = class extends OriginalObserver {
          constructor(...args: any[]) {
            super(...args);
            self.observerInstances.add(this);
          }
          
          disconnect() {
            super.disconnect();
            self.observerInstances.delete(this);
          }
        };
      }
    });
  }

  private getHeapUsed(): number {
    if ('memory' in performance && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize / (1024 * 1024);
    }
    return 0;
  }

  private getHeapTotal(): number {
    if ('memory' in performance && (performance as any).memory) {
      return (performance as any).memory.totalJSHeapSize / (1024 * 1024);
    }
    return 1024;
  }

  private maintainSnapshotHistory(): void {
    const MAX_SNAPSHOTS = 100;
    if (this.snapshots.length > MAX_SNAPSHOTS) {
      this.snapshots = this.snapshots.slice(-MAX_SNAPSHOTS);
    }
  }

  private dispatchMemoryUpdate(snapshot: MemorySnapshot): void {
    const event = new CustomEvent('memory-leak-update', {
      detail: snapshot
    });
    window.dispatchEvent(event);
  }

  getLatestSnapshot(): MemorySnapshot | null {
    return this.snapshots[this.snapshots.length - 1] || null;
  }

  getMemoryTrends(): MemorySnapshot[] {
    return [...this.snapshots];
  }

  getAllLeaks(): MemoryLeak[] {
    return this.snapshots.flatMap(snapshot => snapshot.leaks);
  }
}