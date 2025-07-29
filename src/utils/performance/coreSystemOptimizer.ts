/**
 * Core System Optimizer Interface
 * Main entry point for system optimizations - kept under 200 lines
 */

export interface OptimizationConfig {
  eventListenerCleanup: boolean;
  errorHandling: boolean;
  memoryReduction: boolean;
  loadTimeOptimization: boolean;
  imageLazyLoading: boolean;
  codeSplitting: boolean;
}

export interface OptimizationMetrics {
  eventListenersOptimized: number;
  errorHandlersAdded: number;
  memoryReduced: number;
  loadTimeImproved: number;
  imagesLazyLoaded: number;
  chunksCreated: number;
  totalOptimizations: number;
  systemEfficiency: number;
}

export class CoreSystemOptimizer {
  private static instance: CoreSystemOptimizer;
  private metrics: OptimizationMetrics;
  private initialized = false;

  constructor() {
    this.metrics = {
      eventListenersOptimized: 0,
      errorHandlersAdded: 0,
      memoryReduced: 0,
      loadTimeImproved: 0,
      imagesLazyLoaded: 0,
      chunksCreated: 0,
      totalOptimizations: 0,
      systemEfficiency: 0
    };
  }

  static getInstance(): CoreSystemOptimizer {
    if (!CoreSystemOptimizer.instance) {
      CoreSystemOptimizer.instance = new CoreSystemOptimizer();
    }
    return CoreSystemOptimizer.instance;
  }

  async runBasicOptimizations(): Promise<OptimizationMetrics> {
    console.log('🚀 Running basic system optimizations...');
    
    // Import and run specific optimizers
    const { eventListenerOptimizer } = await import('./optimizers/eventListenerOptimizer');
    const { errorHandlingOptimizer } = await import('./optimizers/errorHandlingOptimizer');
    const { memoryOptimizer } = await import('./optimizers/memoryOptimizer');
    
    // Run optimizations
    this.metrics.eventListenersOptimized += await eventListenerOptimizer.optimize();
    this.metrics.errorHandlersAdded += await errorHandlingOptimizer.optimize();
    this.metrics.memoryReduced += await memoryOptimizer.optimize();
    
    this.calculateEfficiency();
    return this.getMetrics();
  }

  async runAdvancedOptimizations(): Promise<OptimizationMetrics> {
    console.log('🚀 Running advanced system optimizations...');
    
    // Import advanced optimizers
    const { loadTimeOptimizer } = await import('./optimizers/loadTimeOptimizer');
    const { imageOptimizer } = await import('./optimizers/imageOptimizer');
    const { codeSplittingOptimizer } = await import('./optimizers/codeSplittingOptimizer');
    
    // Run optimizations
    this.metrics.loadTimeImproved += await loadTimeOptimizer.optimize();
    this.metrics.imagesLazyLoaded += await imageOptimizer.optimize();
    this.metrics.chunksCreated += await codeSplittingOptimizer.optimize();
    
    this.calculateEfficiency();
    return this.getMetrics();
  }

  async runAllOptimizations(config: Partial<OptimizationConfig> = {}): Promise<OptimizationMetrics> {
    const defaultConfig: OptimizationConfig = {
      eventListenerCleanup: true,
      errorHandling: true,
      memoryReduction: true,
      loadTimeOptimization: true,
      imageLazyLoading: true,
      codeSplitting: true,
      ...config
    };

    if (defaultConfig.eventListenerCleanup || defaultConfig.errorHandling || defaultConfig.memoryReduction) {
      await this.runBasicOptimizations();
    }

    if (defaultConfig.loadTimeOptimization || defaultConfig.imageLazyLoading || defaultConfig.codeSplitting) {
      await this.runAdvancedOptimizations();
    }

    console.log('✅ All optimizations complete');
    return this.getMetrics();
  }

  private calculateEfficiency(): void {
    const totalOptimizations = 
      this.metrics.eventListenersOptimized +
      this.metrics.errorHandlersAdded +
      this.metrics.memoryReduced / 100 +
      this.metrics.loadTimeImproved / 100 +
      this.metrics.imagesLazyLoaded +
      this.metrics.chunksCreated;

    this.metrics.totalOptimizations = totalOptimizations;
    this.metrics.systemEfficiency = Math.min(100, (totalOptimizations / 10) * 100);
  }

  getMetrics(): OptimizationMetrics {
    return { ...this.metrics };
  }

  cleanup(): void {
    this.metrics = {
      eventListenersOptimized: 0,
      errorHandlersAdded: 0,
      memoryReduced: 0,
      loadTimeImproved: 0,
      imagesLazyLoaded: 0,
      chunksCreated: 0,
      totalOptimizations: 0,
      systemEfficiency: 0
    };
  }
}

// Export singleton instance - manual triggering only
export const coreSystemOptimizer = CoreSystemOptimizer.getInstance();