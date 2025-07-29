import { useState, useCallback, useRef } from 'react';

interface SystemHealthResult {
  checks: number;
  critical: number;
  warnings: number;
  optimizations: string[];
}

interface PerformanceResult {
  efficient: boolean;
  efficiency: number;
  memoryUsage: number;
  optimizations: string[];
  beforeOptimization: {
    memoryUsage: number;
    domNodes: number;
    eventListeners: number;
    imageCount: number;
  };
  afterOptimization: {
    memoryUsage: number;
    domNodes: number;
    eventListeners: number;
    imageCount: number;
  };
}

export const useE2EOptimizations = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<any[]>([]);
  const abortController = useRef<AbortController | null>(null);

  // Helper functions with safe DOM handling
  const getMemoryUsage = (): number => {
    try {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        return memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
      }
      return 0;
    } catch {
      return 0;
    }
  };

  const getDOMNodeCount = (): number => {
    try {
      return document.querySelectorAll('*').length;
    } catch {
      return 0;
    }
  };

  const getEventListenerCount = (): number => {
    try {
      // Estimate based on common elements that typically have listeners
      const buttons = document.querySelectorAll('button').length;
      const inputs = document.querySelectorAll('input').length;
      const links = document.querySelectorAll('a').length;
      return buttons + inputs + links;
    } catch {
      return 0;
    }
  };

  const getImageCount = () => {
    try {
      const images = document.querySelectorAll('img');
      let loaded = 0;
      let total = images.length;
      
      images.forEach(img => {
        if (img.complete && img.naturalHeight !== 0) {
          loaded++;
        }
      });
      
      return { loaded, total };
    } catch {
      return { loaded: 0, total: 0 };
    }
  };

  // Safe immediate optimizations without className.split
  const applyImmediateOptimizations = async () => {
    console.log('🚀 Applying safe immediate optimizations...');

    try {
      // 1. Memory optimization - Force garbage collection if available
      if (typeof window !== 'undefined' && (window as any).gc) {
        (window as any).gc();
        console.log('✅ Forced garbage collection');
      }

      // 2. Image lazy loading optimization (safe version)
      let optimizedImages = 0;
      try {
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach(img => {
          try {
            img.setAttribute('loading', 'lazy');
            optimizedImages++;
          } catch (e) {
            // Ignore individual failures
          }
        });
        console.log(`✅ Applied lazy loading to ${optimizedImages} images`);
      } catch (e) {
        console.log('⚠️ Image optimization skipped due to error');
      }

      // 3. Safe CSS class cleanup (no className.split)
      let cleanedClasses = 0;
      try {
        const elementsWithManyClasses = document.querySelectorAll('[class]');
        elementsWithManyClasses.forEach(el => {
          try {
            const classAttr = el.getAttribute('class');
            if (classAttr && typeof classAttr === 'string' && classAttr.trim()) {
              const classList = classAttr.split(' ').filter(cls => cls.trim());
              if (classList.length > 10) {
                // Remove potential duplicate classes
                const uniqueClasses = [...new Set(classList)];
                if (uniqueClasses.length < classList.length) {
                  el.setAttribute('class', uniqueClasses.join(' '));
                  cleanedClasses++;
                }
              }
            }
          } catch (e) {
            // Ignore individual element failures
          }
        });
        console.log(`✅ Cleaned up CSS classes on ${cleanedClasses} elements`);
      } catch (e) {
        console.log('⚠️ CSS cleanup skipped due to error');
      }

      // 4. Safe localStorage cleanup
      try {
        const storageKeys = Object.keys(localStorage);
        const oldKeys = storageKeys.filter(key => 
          key.startsWith('temp_') || 
          key.includes('cache_') ||
          key.includes('old_')
        );
        oldKeys.forEach(key => {
          try {
            localStorage.removeItem(key);
          } catch (e) {
            // Ignore individual key failures
          }
        });
        console.log(`✅ Cleaned up ${oldKeys.length} localStorage entries`);
      } catch (e) {
        console.log('⚠️ Storage cleanup skipped due to error');
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error in immediate optimizations:', error);
    }
  };

  const runPerformanceAnalysis = useCallback(async () => {
    console.log('🔍 Starting safe performance analysis...');
    
    const optimizations: string[] = [];
    
    // Capture before optimization metrics safely
    const beforeMemory = getMemoryUsage();
    const beforeDOMNodes = getDOMNodeCount();
    const beforeEventListeners = getEventListenerCount();
    const beforeImages = getImageCount();

    const beforeOptimization = {
      memoryUsage: beforeMemory,
      domNodes: beforeDOMNodes,
      eventListeners: beforeEventListeners,
      imageCount: beforeImages.total
    };

    console.log('📊 Before optimization metrics:', beforeOptimization);

    let efficiency = 90; // Start with baseline efficiency

    // Analyze memory usage
    if (beforeMemory > 100) {
      efficiency -= 25;
      optimizations.push('Critical: Memory usage reduction required (>100MB)');
    } else if (beforeMemory > 75) {
      efficiency -= 15;
      optimizations.push('Memory optimization recommended (>75MB)');
    } else if (beforeMemory > 50) {
      efficiency -= 8;
      optimizations.push('Minor memory optimization available');
    }

    // DOM analysis
    if (beforeDOMNodes > 2000) {
      efficiency -= 10;
      optimizations.push('DOM optimization - Too many nodes');
    }

    // Apply optimizations safely
    try {
      await applyImmediateOptimizations();
    } catch (error) {
      console.error('Optimization failed:', error);
      optimizations.push('Some optimizations failed - see console for details');
    }

    // Capture after optimization metrics
    const afterMemory = getMemoryUsage();
    const afterDOMNodes = getDOMNodeCount();
    const afterEventListeners = getEventListenerCount();
    const afterImages = getImageCount();

    const afterOptimization = {
      memoryUsage: afterMemory,
      domNodes: afterDOMNodes,
      eventListeners: afterEventListeners,
      imageCount: afterImages.total
    };

    console.log('📈 After optimization metrics:', afterOptimization);

    return {
      efficient: efficiency > 70,
      efficiency: Math.min(100, Math.max(0, efficiency)),
      memoryUsage: afterMemory,
      optimizations,
      beforeOptimization,
      afterOptimization
    };
  }, []);

  const applyOptimizations = useCallback(async () => {
    setIsOptimizing(true);
    
    try {
      console.log('🔧 Applying safe comprehensive performance optimizations...');
      
      const result = await runPerformanceAnalysis();
      
      setOptimizationResults(prev => [...prev, {
        timestamp: new Date(),
        type: 'performance',
        result,
        success: true
      }]);

      return { success: true, result };
    } catch (error) {
      console.error('Optimization failed:', error);
      setOptimizationResults(prev => [...prev, {
        timestamp: new Date(),
        type: 'performance',
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      }]);
      return { success: false, error };
    } finally {
      setIsOptimizing(false);
    }
  }, [runPerformanceAnalysis]);

  const runSystemHealthCheck = useCallback(async () => {
    console.log('🏥 Running safe system health check...');
    
    let checks = 0;
    let critical = 0;
    let warnings = 0;
    const optimizations: string[] = [];

    try {
      // Check 1: Memory usage
      checks++;
      const memory = getMemoryUsage();
      if (memory > 100) {
        critical++;
        optimizations.push('Critical: High memory usage detected');
      } else if (memory > 50) {
        warnings++;
        optimizations.push('Warning: Elevated memory usage');
      }

      // Check 2: DOM complexity
      checks++;
      const domNodes = getDOMNodeCount();
      if (domNodes > 3000) {
        critical++;
        optimizations.push('Critical: DOM tree too complex');
      } else if (domNodes > 1500) {
        warnings++;
        optimizations.push('Warning: Large DOM tree detected');
      }

      // Check 3: Basic performance
      checks++;
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const loadTime = navigation ? navigation.loadEventEnd - navigation.fetchStart : 0;
      
      if (loadTime > 5000) {
        critical++;
        optimizations.push('Critical: Very slow page load');
      } else if (loadTime > 3000) {
        warnings++;
        optimizations.push('Warning: Slow page load detected');
      }

    } catch (error) {
      console.error('Health check error:', error);
      critical++;
      optimizations.push('Error during health check - see console');
    }

    return {
      checks,
      critical,
      warnings,
      optimizations
    };
  }, []);

  const cancelOptimizations = useCallback(() => {
    if (abortController.current) {
      abortController.current.abort();
    }
    setIsOptimizing(false);
    console.log('🛑 Optimizations cancelled');
  }, []);

  return {
    isOptimizing,
    optimizationResults,
    applyOptimizations,
    runPerformanceAnalysis,
    runSystemHealthCheck,
    cancelOptimizations
  };
};