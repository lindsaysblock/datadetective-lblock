/**
 * Memory Optimizer
 * Focused utility for memory cleanup and optimization
 */

class MemoryOptimizer {
  private memoryCleanupTasks = new Set<() => void>();
  private gcTimer: number | null = null;

  async optimize(): Promise<number> {
    console.log('🧹 Optimizing memory usage...');
    
    let memoryFreed = 0;

    // Aggressive garbage collection scheduling
    this.scheduleMemoryCleanup();

    // Component cleanup registry
    this.setupComponentCleanup();

    // Image memory optimization
    memoryFreed += this.optimizeImageMemory();

    // Clean up localStorage/sessionStorage
    memoryFreed += this.cleanupStorages();

    console.log(`✅ Memory optimization complete - ${memoryFreed}KB freed`);
    return memoryFreed;
  }

  private scheduleMemoryCleanup(): void {
    if (this.gcTimer) {
      clearInterval(this.gcTimer);
    }

    this.gcTimer = window.setInterval(() => {
      if ((window as any).gc) {
        (window as any).gc();
      }
      this.performManualGC();
    }, 30000);
  }

  private performManualGC(): void {
    if ((window as any).__componentRefs) {
      (window as any).__componentRefs = new WeakMap();
    }
    if ((window as any).__functionCache) {
      (window as any).__functionCache.clear();
    }
    this.memoryCleanupTasks.forEach(cleanup => cleanup());
  }

  private setupComponentCleanup(): void {
    this.addMemoryCleanupTask(() => {
      if ((window as any).componentCache) {
        (window as any).componentCache.clear();
      }
    });
  }

  private optimizeImageMemory(): number {
    let memoryFreed = 0;
    document.querySelectorAll('img').forEach(img => {
      if (img.complete && img.naturalWidth > 0) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = Math.min(img.naturalWidth, 800);
          canvas.height = Math.min(img.naturalHeight, 600);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          if (compressedDataUrl.length < img.src.length * 0.7) {
            memoryFreed += (img.src.length - compressedDataUrl.length) / 1024;
            img.src = compressedDataUrl;
          }
        }
      }
    });
    return Math.floor(memoryFreed);
  }

  private cleanupStorages(): number {
    let memoryFreed = 0;
    
    // Clean localStorage
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('temp') || key.includes('cache'))) {
        const item = localStorage.getItem(key);
        if (item) {
          memoryFreed += item.length / 1024;
          keysToRemove.push(key);
        }
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

    return Math.floor(memoryFreed);
  }

  addMemoryCleanupTask(task: () => void): void {
    this.memoryCleanupTasks.add(task);
  }

  cleanup(): void {
    if (this.gcTimer) {
      clearInterval(this.gcTimer);
    }
    this.memoryCleanupTasks.clear();
  }
}

export const memoryOptimizer = new MemoryOptimizer();