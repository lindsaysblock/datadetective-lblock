import { useState, useCallback } from 'react';
import { getMemoryUsage, getDOMNodeCount, getEventListenerCount, getImageCount } from './optimizationHelpers';
import { applyImmediateOptimizations } from './optimizationActions';

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

interface SystemHealthResult {
  checks: number;
  critical: number;
  warnings: number;
  optimizations: string[];
}

export const useE2EOptimizations = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResults, setOptimizationResults] = useState<any[]>([]);

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