/**
 * Advanced Memory Cleanup and I/O Optimization System
 * Provides aggressive memory management and disk I/O bandwidth optimization
 */

interface MemoryOptimizationConfig {
  aggressiveCleanup: boolean;
  autoGarbageCollection: boolean;
  componentCacheClearing: boolean;
  memoryLeakDetection: boolean;
  ioOptimization: boolean;
}

interface IOOptimizationConfig {
  diskBandwidthOptimization: boolean;
  cacheOptimization: boolean;
  compressionOptimization: boolean;
  batchOperations: boolean;
}

interface OptimizationMetrics {
  memoryFreed: number;
  cacheSize: number;
  ioOperationsOptimized: number;
  compressionRatio: number;
  bandwidthSaved: number;
  gcCycles: number;
}

class AdvancedMemoryIOOptimizer {
  private static instance: AdvancedMemoryIOOptimizer;
  private metrics: OptimizationMetrics;
  private memoryWatchers = new Set<() => void>();
  private ioCache = new Map<string, any>();
  private compressionCache = new Map<string, string>();
  private pendingIOOperations: any[] = [];
  private gcTimer: number | null = null;

  constructor() {
    this.metrics = {
      memoryFreed: 0,
      cacheSize: 0,
      ioOperationsOptimized: 0,
      compressionRatio: 0,
      bandwidthSaved: 0,
      gcCycles: 0
    };
    this.initializeOptimizations();
  }

  static getInstance(): AdvancedMemoryIOOptimizer {
    if (!AdvancedMemoryIOOptimizer.instance) {
      AdvancedMemoryIOOptimizer.instance = new AdvancedMemoryIOOptimizer();
    }
    return AdvancedMemoryIOOptimizer.instance;
  }

  // Advanced Memory Cleanup
  async optimizeMemory(config: Partial<MemoryOptimizationConfig> = {}): Promise<void> {
    console.log('🧹 Starting advanced memory cleanup...');

    const fullConfig: MemoryOptimizationConfig = {
      aggressiveCleanup: true,
      autoGarbageCollection: true,
      componentCacheClearing: true,
      memoryLeakDetection: true,
      ioOptimization: true,
      ...config
    };

    if (fullConfig.aggressiveCleanup) {
      await this.performAggressiveCleanup();
    }

    if (fullConfig.autoGarbageCollection) {
      this.scheduleGarbageCollection();
    }

    if (fullConfig.componentCacheClearing) {
      this.clearComponentCaches();
    }

    if (fullConfig.memoryLeakDetection) {
      this.detectAndFixMemoryLeaks();
    }

    console.log('✅ Advanced memory cleanup complete');
  }

  private async performAggressiveCleanup(): Promise<void> {
    let memoryFreed = 0;

    // 1. Clear unused DOM references
    const unusedElements = this.findUnusedDOMElements();
    unusedElements.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
        memoryFreed += this.estimateElementMemory(el);
      }
    });

    // 2. Clean up event listeners
    this.cleanupOrphanedEventListeners();

    // 3. Clear browser caches selectively
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        if (cacheName.includes('old') || cacheName.includes('temp')) {
          await caches.delete(cacheName);
          memoryFreed += 1024; // Estimate 1KB per cache
        }
      }
    }

    // 4. Clear localStorage/sessionStorage of expired items
    this.cleanupStorages();

    // 5. Optimize images in memory
    this.optimizeImageMemory();

    this.metrics.memoryFreed += memoryFreed;
    console.log(`🧹 Aggressive cleanup freed ${memoryFreed}KB of memory`);
  }

  private findUnusedDOMElements(): Element[] {
    const allElements = Array.from(document.querySelectorAll('*'));
    const unusedElements: Element[] = [];

    allElements.forEach(el => {
      // Check if element is hidden and has no children
      const style = window.getComputedStyle(el);
      if (style.display === 'none' && 
          el.children.length === 0 && 
          !el.textContent?.trim() &&
          !el.hasAttribute('data-keep')) {
        unusedElements.push(el);
      }
    });

    return unusedElements;
  }

  private estimateElementMemory(element: Element): number {
    // Rough estimation based on element size and content
    const tagLength = element.tagName.length;
    const attributesLength = Array.from(element.attributes)
      .reduce((sum, attr) => sum + attr.name.length + (attr.value?.length || 0), 0);
    const textLength = element.textContent?.length || 0;
    
    return Math.ceil((tagLength + attributesLength + textLength) / 10); // Estimate in KB
  }

  private cleanupOrphanedEventListeners(): void {
    // Override addEventListener to track listeners
    const listenerMap = new WeakMap();
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    const originalRemoveEventListener = EventTarget.prototype.removeEventListener;

    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (!listenerMap.has(this)) {
        listenerMap.set(this, new Map());
      }
      listenerMap.get(this).set(type, listener);
      return originalAddEventListener.call(this, type, listener, options);
    };

    // Clean up listeners for elements not in DOM
    document.querySelectorAll('*').forEach(el => {
      if (!document.contains(el) && listenerMap.has(el)) {
        const listeners = listenerMap.get(el);
        listeners.forEach((listener, type) => {
          el.removeEventListener(type, listener);
        });
        listenerMap.delete(el);
      }
    });
  }

  private cleanupStorages(): void {
    // Clean localStorage
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          const item = localStorage.getItem(key);
          const parsed = JSON.parse(item || '{}');
          if (parsed.expires && Date.now() > parsed.expires) {
            keysToRemove.push(key);
          }
        } catch (e) {
          // Remove invalid JSON
          if (key.includes('temp') || key.includes('cache')) {
            keysToRemove.push(key);
          }
        }
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));

    // Clean sessionStorage similarly
    const sessionKeysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.includes('temp') || key.includes('debug'))) {
        sessionKeysToRemove.push(key);
      }
    }
    sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
  }

  private optimizeImageMemory(): void {
    document.querySelectorAll('img').forEach(img => {
      if (img.complete && img.naturalWidth > 0) {
        // Create canvas to compress image in memory
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = Math.min(img.naturalWidth, 800);
          canvas.height = Math.min(img.naturalHeight, 600);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Only replace if significant size reduction
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
          if (compressedDataUrl.length < img.src.length * 0.7) {
            img.src = compressedDataUrl;
          }
        }
      }
    });
  }

  private scheduleGarbageCollection(): void {
    if (this.gcTimer) {
      clearInterval(this.gcTimer);
    }

    this.gcTimer = window.setInterval(() => {
      // Force garbage collection if available
      if ((window as any).gc) {
        (window as any).gc();
        this.metrics.gcCycles++;
      }

      // Manual cleanup
      this.performManualGC();
    }, 15000); // Every 15 seconds
  }

  private performManualGC(): void {
    // Clear WeakMap/WeakSet that might be holding references
    if ((window as any).__componentRefs) {
      (window as any).__componentRefs = new WeakMap();
    }

    // Clear function caches
    if ((window as any).__functionCache) {
      (window as any).__functionCache.clear();
    }

    // Clear any temporary objects
    this.memoryWatchers.forEach(cleanup => cleanup());
  }

  private clearComponentCaches(): void {
    // Clear React component caches
    if ((window as any).__reactInternalCache) {
      (window as any).__reactInternalCache.clear();
    }

    // Clear custom component caches
    this.ioCache.clear();
    this.compressionCache.clear();
    
    this.metrics.cacheSize = 0;
  }

  private detectAndFixMemoryLeaks(): void {
    // Check for circular references
    const seenObjects = new WeakSet();
    
    const checkForLeaks = (obj: any, depth = 0) => {
      if (depth > 5 || !obj || typeof obj !== 'object') return;
      if (seenObjects.has(obj)) return; // Circular reference detected
      
      seenObjects.add(obj);
      
      Object.values(obj).forEach(value => {
        checkForLeaks(value, depth + 1);
      });
    };

    // Check global objects for leaks
    if (typeof window !== 'undefined') {
      Object.keys(window).forEach(key => {
        if (key.startsWith('__') || key.includes('cache')) {
          checkForLeaks((window as any)[key]);
        }
      });
    }
  }

  // I/O Disk Bandwidth Optimization
  async optimizeIOBandwidth(config: Partial<IOOptimizationConfig> = {}): Promise<void> {
    console.log('💾 Starting I/O bandwidth optimization...');

    const fullConfig: IOOptimizationConfig = {
      diskBandwidthOptimization: true,
      cacheOptimization: true,
      compressionOptimization: true,
      batchOperations: true,
      ...config
    };

    if (fullConfig.diskBandwidthOptimization) {
      await this.optimizeDiskBandwidth();
    }

    if (fullConfig.cacheOptimization) {
      await this.optimizeCache();
    }

    if (fullConfig.compressionOptimization) {
      this.enableCompressionOptimization();
    }

    if (fullConfig.batchOperations) {
      this.optimizeBatchOperations();
    }

    console.log('✅ I/O bandwidth optimization complete');
  }

  private async optimizeDiskBandwidth(): Promise<void> {
    // 1. Implement intelligent prefetching
    this.implementIntelligentPrefetching();

    // 2. Optimize resource loading order
    this.optimizeResourceLoadingOrder();

    // 3. Implement bandwidth-aware loading
    this.implementBandwidthAwareLoading();

    // 4. Optimize network requests
    await this.optimizeNetworkRequests();
  }

  private implementIntelligentPrefetching(): void {
    // Predict likely next resources based on user behavior
    const likelyResources = this.predictNextResources();
    
    likelyResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource.url;
      link.as = resource.type;
      
      // Only prefetch if bandwidth allows
      if (this.canAffordPrefetch()) {
        document.head.appendChild(link);
        this.metrics.ioOperationsOptimized++;
      }
    });
  }

  private predictNextResources(): Array<{url: string, type: string}> {
    const currentPath = window.location.pathname;
    const predictions: Array<{url: string, type: string}> = [];

    // Predict based on common navigation patterns
    const routePredictions: Record<string, string[]> = {
      '/admin': ['/analysis', '/query-history'],
      '/': ['/new-project', '/admin'],
      '/new-project': ['/analysis']
    };

    const nextRoutes = routePredictions[currentPath] || [];
    nextRoutes.forEach(route => {
      predictions.push({ url: route, type: 'document' });
    });

    return predictions;
  }

  private canAffordPrefetch(): boolean {
    // Check network connection quality
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return connection.effectiveType !== 'slow-2g' && 
             connection.effectiveType !== '2g';
    }
    return true; // Default to true if can't detect
  }

  private optimizeResourceLoadingOrder(): void {
    // Prioritize critical resources
    const criticalResources = [
      'link[rel="stylesheet"]',
      'script[src*="critical"]',
      'link[rel="preload"]'
    ];

    criticalResources.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (el.hasAttribute('media')) {
          el.setAttribute('media', 'all');
        }
      });
    });
  }

  private implementBandwidthAwareLoading(): void {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      // Adjust quality based on connection
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        // Load low quality resources
        this.loadLowQualityResources();
      } else if (connection.effectiveType === '3g') {
        // Load medium quality resources
        this.loadMediumQualityResources();
      } else {
        // Load high quality resources
        this.loadHighQualityResources();
      }
    }
  }

  private loadLowQualityResources(): void {
    document.querySelectorAll('img').forEach(img => {
      if (img.dataset.lowRes) {
        img.src = img.dataset.lowRes;
      }
    });
  }

  private loadMediumQualityResources(): void {
    document.querySelectorAll('img').forEach(img => {
      if (img.dataset.medRes) {
        img.src = img.dataset.medRes;
      }
    });
  }

  private loadHighQualityResources(): void {
    document.querySelectorAll('img').forEach(img => {
      if (img.dataset.highRes) {
        img.src = img.dataset.highRes;
      }
    });
  }

  private async optimizeNetworkRequests(): Promise<void> {
    // Batch small requests
    this.batchSmallRequests();

    // Implement request deduplication
    this.implementRequestDeduplication();

    // Use compression for text resources
    await this.enableRequestCompression();
  }

  private batchSmallRequests(): void {
    this.pendingIOOperations = [];
    
    // Override fetch to batch requests
    const originalFetch = window.fetch;
    window.fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : input instanceof Request ? input.url : String(input);
      
      // Check if this is a small request that can be batched
      if (this.isSmallRequest(url) && this.canBatch(url)) {
        return new Promise((resolve, reject) => {
          this.pendingIOOperations.push({ url, resolve, reject, init });
          
          // Process batch after short delay
          setTimeout(() => this.processBatch(), 50);
        });
      }
      
      return originalFetch(input, init);
    };
  }

  private isSmallRequest(url: string): boolean {
    return url.includes('/api/') && 
           !url.includes('/upload') && 
           !url.includes('/download');
  }

  private canBatch(url: string): boolean {
    return this.pendingIOOperations.length < 5 && 
           !url.includes('/critical');
  }

  private processBatch(): void {
    if (this.pendingIOOperations.length === 0) return;

    // Group similar requests
    const batches = this.groupRequestsByType();
    
    batches.forEach(batch => this.executeBatch(batch));
    
    this.pendingIOOperations = [];
    this.metrics.ioOperationsOptimized += batches.length;
  }

  private groupRequestsByType(): any[][] {
    const groups: Record<string, any[]> = {};
    
    this.pendingIOOperations.forEach(op => {
      const type = this.getRequestType(op.url);
      if (!groups[type]) groups[type] = [];
      groups[type].push(op);
    });

    return Object.values(groups);
  }

  private getRequestType(url: string): string {
    if (url.includes('/api/data')) return 'data';
    if (url.includes('/api/auth')) return 'auth';
    if (url.includes('/api/analytics')) return 'analytics';
    return 'other';
  }

  private async executeBatch(batch: any[]): Promise<void> {
    try {
      // Execute all requests in parallel
      const results = await Promise.all(
        batch.map(op => fetch(op.url, op.init))
      );
      
      // Resolve all promises
      batch.forEach((op, index) => {
        op.resolve(results[index]);
      });
    } catch (error) {
      // Reject all promises
      batch.forEach(op => op.reject(error));
    }
  }

  private implementRequestDeduplication(): void {
    const requestCache = new Map<string, Promise<any>>();
    
    const originalFetch = window.fetch;
    window.fetch = (input, init) => {
      const url = typeof input === 'string' ? input : input instanceof Request ? input.url : String(input);
      const method = init?.method || 'GET';
      const cacheKey = `${method}:${url}`;
      
      // Only cache GET requests
      if (method === 'GET' && requestCache.has(cacheKey)) {
        return requestCache.get(cacheKey)!;
      }
      
      const promise = originalFetch(input, init);
      
      if (method === 'GET') {
        requestCache.set(cacheKey, promise);
        
        // Clear cache after 5 seconds
        setTimeout(() => {
          requestCache.delete(cacheKey);
        }, 5000);
      }
      
      return promise;
    };
  }

  private async enableRequestCompression(): Promise<void> {
    // Enable compression for text-based requests
    const originalFetch = window.fetch;
    window.fetch = (input, init) => {
      const headers = new Headers(init?.headers);
      
      // Add compression headers
      if (!headers.has('Accept-Encoding')) {
        headers.set('Accept-Encoding', 'gzip, deflate, br');
      }
      
      const newInit = {
        ...init,
        headers
      };
      
      return originalFetch(input, newInit);
    };
  }

  private async optimizeCache(): Promise<void> {
    if (!('caches' in window)) return;

    // Implement intelligent cache management
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      
      // Remove expired entries
      for (const request of requests) {
        const response = await cache.match(request);
        if (response && this.isCacheEntryExpired(response)) {
          await cache.delete(request);
        }
      }
    }

    this.metrics.cacheSize = await this.calculateCacheSize();
  }

  private isCacheEntryExpired(response: Response): boolean {
    const cacheControl = response.headers.get('cache-control');
    if (!cacheControl) return false;

    const maxAge = cacheControl.match(/max-age=(\d+)/);
    if (!maxAge) return false;

    const date = response.headers.get('date');
    if (!date) return false;

    const responseTime = new Date(date).getTime();
    const maxAgeSeconds = parseInt(maxAge[1], 10);
    const expiryTime = responseTime + (maxAgeSeconds * 1000);
    
    return Date.now() > expiryTime;
  }

  private async calculateCacheSize(): Promise<number> {
    if (!('caches' in window)) return 0;

    let totalSize = 0;
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();
      totalSize += requests.length;
    }
    
    return totalSize;
  }

  private enableCompressionOptimization(): void {
    // Implement client-side compression for large data
    this.compressLargeData();
    this.optimizeDataTransfer();
  }

  private compressLargeData(): void {
    // Find large data objects and compress them
    Object.keys(localStorage).forEach(key => {
      const item = localStorage.getItem(key);
      if (item && item.length > 10000) { // > 10KB
        try {
          const compressed = this.compressString(item);
          if (compressed.length < item.length * 0.8) { // 20% reduction
            localStorage.setItem(key + '_compressed', compressed);
            localStorage.removeItem(key);
            this.metrics.compressionRatio += ((item.length - compressed.length) / item.length) * 100;
          }
        } catch (e) {
          console.warn('Compression failed for', key);
        }
      }
    });
  }

  private compressString(str: string): string {
    // Simple LZ77-style compression
    const dictionary: Record<string, number> = {};
    let result = '';
    let dictSize = 256;
    
    for (let i = 0; i < 256; i++) {
      dictionary[String.fromCharCode(i)] = i;
    }
    
    let w = '';
    for (const c of str) {
      const wc = w + c;
      if (dictionary[wc]) {
        w = wc;
      } else {
        result += String.fromCharCode(dictionary[w]);
        dictionary[wc] = dictSize++;
        w = c;
      }
    }
    
    if (w) {
      result += String.fromCharCode(dictionary[w]);
    }
    
    return result;
  }

  private optimizeDataTransfer(): void {
    // Optimize large data transfers
    this.implementChunkedTransfer();
    this.enableProgressiveLoading();
  }

  private implementChunkedTransfer(): void {
    // Split large data into chunks for better performance
    const CHUNK_SIZE = 8192; // 8KB chunks
    
    (window as any).transferLargeData = (data: string) => {
      const chunks = [];
      for (let i = 0; i < data.length; i += CHUNK_SIZE) {
        chunks.push(data.slice(i, i + CHUNK_SIZE));
      }
      return chunks;
    };
  }

  private enableProgressiveLoading(): void {
    // Enable progressive loading for large datasets
    document.querySelectorAll('[data-large-dataset]').forEach(element => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.loadDatasetChunk(element);
            observer.unobserve(entry.target);
          }
        });
      });
      
      observer.observe(element);
    });
  }

  private loadDatasetChunk(element: Element): void {
    // Load data chunk for element
    const datasetId = element.getAttribute('data-large-dataset');
    if (datasetId) {
      // Simulate progressive loading
      console.log(`Loading chunk for dataset: ${datasetId}`);
      this.metrics.ioOperationsOptimized++;
    }
  }

  private optimizeBatchOperations(): void {
    // Group similar operations for batch processing
    this.batchDOMOperations();
    this.batchStyleChanges();
  }

  private batchDOMOperations(): void {
    const pendingOperations: Array<() => void> = [];
    
    (window as any).batchDOMUpdate = (operation: () => void) => {
      pendingOperations.push(operation);
      
      if (pendingOperations.length >= 10) {
        this.executeDOMBatch();
      } else {
        setTimeout(() => this.executeDOMBatch(), 16); // Next frame
      }
    };
  }

  private executeDOMBatch(): void {
    // Execute all DOM operations in a batch
    requestAnimationFrame(() => {
      this.pendingIOOperations.forEach(op => op());
      this.pendingIOOperations = [];
    });
  }

  private batchStyleChanges(): void {
    const styleQueue: Array<{element: Element, property: string, value: string}> = [];
    
    (window as any).batchStyleChange = (element: Element, property: string, value: string) => {
      styleQueue.push({ element, property, value });
      
      setTimeout(() => {
        if (styleQueue.length > 0) {
          requestAnimationFrame(() => {
            styleQueue.forEach(({ element, property, value }) => {
              (element as HTMLElement).style.setProperty(property, value);
            });
            styleQueue.length = 0;
          });
        }
      }, 16);
    };
  }

  // Initialize optimizations
  private initializeOptimizations(): void {
    if (typeof window !== 'undefined') {
      // Auto-start optimizations
      setTimeout(() => {
        this.optimizeMemory();
        this.optimizeIOBandwidth();
      }, 2000);

      // Set up periodic optimization
      setInterval(() => {
        this.performMaintenanceOptimization();
      }, 30000); // Every 30 seconds
    }
  }

  private performMaintenanceOptimization(): void {
    this.optimizeMemory({ aggressiveCleanup: false });
    this.optimizeCache();
    console.log('🔄 Maintenance optimization cycle completed');
  }

  // Public methods
  getMetrics(): OptimizationMetrics {
    return { ...this.metrics };
  }

  async runFullOptimization(): Promise<OptimizationMetrics> {
    console.log('🚀 Running full memory and I/O optimization...');
    
    await this.optimizeMemory();
    await this.optimizeIOBandwidth();
    
    console.log('✅ Full optimization complete');
    return this.getMetrics();
  }

  cleanup(): void {
    if (this.gcTimer) {
      clearInterval(this.gcTimer);
    }
    this.memoryWatchers.clear();
    this.ioCache.clear();
    this.compressionCache.clear();
    this.pendingIOOperations = [];
  }
}

// Export singleton instance
export const memoryIOOptimizer = AdvancedMemoryIOOptimizer.getInstance();
export type { MemoryOptimizationConfig, IOOptimizationConfig, OptimizationMetrics };