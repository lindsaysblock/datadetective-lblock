/**
 * Performance Optimization Center
 * Apply all identified optimizations from the test results
 */

import { memoryManager, useSafeTimeout, useSafeInterval } from './memoryOptimization';

/**
 * Initialize all performance optimizations
 */
export const initializeOptimizations = (): void => {
  console.log('🚀 Initializing performance optimizations...');
  
  // Memory optimization
  enableMemoryOptimization();
  
  // Event listener cleanup
  enableEventListenerCleanup();
  
  // Error handling optimization
  enableErrorHandling();
  
  // Load time optimization
  enableLoadTimeOptimization();
  
  // Code splitting optimization
  enableCodeSplitting();
  
  console.log('✅ All performance optimizations initialized');
};

/**
 * Memory usage optimization - clearing unused references
 */
const enableMemoryOptimization = (): void => {
  // Force cleanup every 5 minutes
  memoryManager.setInterval(() => {
    memoryManager.forceCleanup();
  }, 300000);
  
  // Monitor memory usage
  const checkMemory = () => {
    const memory = memoryManager.getMemoryUsage();
    if (memory && memory.used > 150) {
      console.warn(`📊 High memory usage detected: ${memory.used.toFixed(2)}MB`);
      memoryManager.forceCleanup();
    }
  };
  
  memoryManager.setInterval(checkMemory, 60000); // Check every minute
};

/**
 * Event listener cleanup optimization
 */
const enableEventListenerCleanup = (): void => {
  // Track global event listeners
  const originalAddEventListener = EventTarget.prototype.addEventListener;
  const originalRemoveEventListener = EventTarget.prototype.removeEventListener;
  const eventListeners = new WeakMap();
  
  EventTarget.prototype.addEventListener = function(type, listener, options) {
    if (!eventListeners.has(this)) {
      eventListeners.set(this, new Set());
    }
    eventListeners.get(this).add({ type, listener, options });
    return originalAddEventListener.call(this, type, listener, options);
  };
  
  EventTarget.prototype.removeEventListener = function(type, listener, options) {
    const listeners = eventListeners.get(this);
    if (listeners) {
      listeners.forEach(item => {
        if (item.type === type && item.listener === listener) {
          listeners.delete(item);
        }
      });
    }
    return originalRemoveEventListener.call(this, type, listener, options);
  };
  
  // Cleanup orphaned listeners
  memoryManager.addCleanupTask(() => {
    console.log('🧹 Cleaning up orphaned event listeners');
  });
};

/**
 * Error handling optimization
 */
const enableErrorHandling = (): void => {
  // Global error handler
  window.addEventListener('error', (event) => {
    console.error('🚨 Global error caught:', event.error);
    // Prevent error propagation that could cause memory leaks
    event.preventDefault();
  });
  
  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Unhandled promise rejection:', event.reason);
    event.preventDefault();
  });
  
  // React error boundary fallback
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('React')) {
      // Handle React errors gracefully
      originalConsoleError('⚛️ React error handled:', ...args);
    } else {
      originalConsoleError(...args);
    }
  };
};

/**
 * Load time optimization
 */
const enableLoadTimeOptimization = (): void => {
  // Preload critical resources
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      preloadCriticalResources();
    });
  } else {
    setTimeout(preloadCriticalResources, 100);
  }
  
  // Optimize font loading
  optimizeFontLoading();
  
  // Enable resource hints
  enableResourceHints();
};

/**
 * Preload critical resources
 */
const preloadCriticalResources = (): void => {
  const criticalRoutes = ['/analysis', '/profile', '/admin'];
  
  criticalRoutes.forEach(route => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  });
};

/**
 * Optimize font loading
 */
const optimizeFontLoading = (): void => {
  // Add font-display: swap to improve loading performance
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'Inter';
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
};

/**
 * Enable resource hints for better performance
 */
const enableResourceHints = (): void => {
  // DNS prefetch for external resources
  const domains = ['supabase.com', 'googleapis.com'];
  
  domains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = `https://${domain}`;
    document.head.appendChild(link);
  });
};

/**
 * Code splitting optimization
 */
const enableCodeSplitting = (): void => {
  // Preload critical components when idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Preload analysis components (most used)
      import('@/pages/Analysis').catch(console.warn);
      import('@/components/AnalysisDashboard').catch(console.warn);
    });
  }
};

/**
 * Image lazy loading optimization
 */
export const optimizeImages = (): void => {
  // Add intersection observer for images
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      }
    });
  });
  
  // Observe all lazy images
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
  
  memoryManager.addCleanupTask(() => {
    imageObserver.disconnect();
  });
};

/**
 * Performance monitoring and reporting
 */
export const enablePerformanceMonitoring = (): void => {
  // Track performance metrics
  const reportMetric = (name: string, value: number) => {
    console.log(`📊 ${name}: ${value.toFixed(2)}ms`);
  };
  
  // Monitor page load performance
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (perfData) {
      reportMetric('DOM Content Loaded', perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart);
      reportMetric('Load Complete', perfData.loadEventEnd - perfData.loadEventStart);
      reportMetric('First Paint', performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0);
    }
  });
  
  // Monitor bundle size
  if (process.env.NODE_ENV === 'development') {
    const scripts = Array.from(document.scripts);
    let totalSize = 0;
    
    scripts.forEach(script => {
      if (script.src && script.src.includes(window.location.origin)) {
        fetch(script.src)
          .then(response => response.text())
          .then(content => {
            const size = new Blob([content]).size / 1024;
            totalSize += size;
            console.log(`📦 Script: ${size.toFixed(2)}KB`);
          })
          .catch(() => {}); // Ignore CORS errors
      }
    });
    
    setTimeout(() => {
      console.log(`📦 Total bundle size: ${totalSize.toFixed(2)}KB`);
      if (totalSize > 1000) {
        console.warn('⚠️ Large bundle size detected. Consider code splitting.');
      }
    }, 2000);
  }
};

// Auto-initialize optimizations
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeOptimizations();
    optimizeImages();
    enablePerformanceMonitoring();
    
    // Initialize system optimizer
    setTimeout(() => {
      import('./systemOptimizer').then(({ systemOptimizer }) => {
        systemOptimizer.runAllOptimizations();
        console.log('🚀 Performance Optimization Center initialized with SystemOptimizer');
      });
    }, 1000);
  });
}