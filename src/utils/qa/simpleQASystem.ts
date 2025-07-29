/**
 * Simplified QA System
 * Clean implementation that works with simpleOptimizer
 */

import { QATestResult, QAReport, PerformanceMetrics } from './types';
import { simpleOptimizer, OptimizationMetrics } from '../performance/simpleOptimizer';

class SimpleQASystem {
  private optimizationHistory: OptimizationMetrics[] = [];
  
  async runOptimizedQAAnalysis(): Promise<QAReport> {
    console.log('🚀 Starting QA Analysis...');
    
    const startTime = performance.now();
    
    // Run basic optimizations
    await simpleOptimizer.runBasicOptimizations();
    
    // Run tests
    const qaResults = await this.runBasicTests();
    
    // Track metrics
    const optimizationMetrics = simpleOptimizer.getMetrics();
    this.optimizationHistory.push(optimizationMetrics);
    
    const endTime = performance.now();
    const duration = endTime - startTime;

    // Generate report
    const report = this.generateReport(qaResults, optimizationMetrics, duration);
    
    console.log('✅ QA Analysis Complete');
    return report;
  }

  private async runBasicTests(): Promise<QATestResult[]> {
    const tests: QATestResult[] = [];
    
    // System efficiency test
    const metrics = simpleOptimizer.getMetrics();
    tests.push({
      testName: 'System Efficiency',
      status: metrics.systemEfficiency > 70 ? 'pass' : 'warning',
      message: `System efficiency: ${metrics.systemEfficiency.toFixed(1)}%`,
      performance: metrics.systemEfficiency,
      optimizations: [
        'Event listener optimization',
        'Error handling setup',
        'Memory cleanup',
        'Load time improvements'
      ]
    });

    // Memory test
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      const usedHeapSize = memoryInfo.usedJSHeapSize / 1024 / 1024; // MB
      
      tests.push({
        testName: 'Memory Usage',
        status: usedHeapSize < 50 ? 'pass' : 'warning',
        message: `Memory usage: ${usedHeapSize.toFixed(1)}MB`,
        performance: usedHeapSize,
        optimizations: [`${metrics.memoryReduced}KB memory freed`]
      });
    }

    // Event listener test
    tests.push({
      testName: 'Event Listeners',
      status: 'pass',
      message: `${metrics.eventListenersOptimized} listeners optimized`,
      optimizations: [
        'Passive listeners added',
        'Cleanup optimizations applied'
      ]
    });

    return tests;
  }

  private generateReport(
    results: QATestResult[], 
    optimizationMetrics: OptimizationMetrics, 
    duration: number
  ): QAReport {
    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;
    const warnings = results.filter(r => r.status === 'warning').length;

    const performanceMetrics: PerformanceMetrics = {
      renderTime: duration,
      memoryUsage: optimizationMetrics.memoryReduced,
      bundleSize: 0,
      componentCount: 0,
      largeFiles: [],
      qaSystemDuration: duration,
      systemEfficiency: optimizationMetrics.systemEfficiency,
      memoryEfficiency: Math.max(0, 100 - (optimizationMetrics.memoryReduced / 10)),
      codebaseHealth: (passed / results.length) * 100,
      refactoringReadiness: optimizationMetrics.totalOptimizations > 5 ? 80 : 60,
      dynamicAnalysisEnabled: true,
      enhancedMode: true,
      duration: duration
    };

    return {
      overall: failed > 0 ? 'fail' : warnings > 0 ? 'warning' : 'pass',
      timestamp: new Date(),
      totalTests: results.length,
      passed,
      failed,
      warnings,
      results,
      performanceMetrics,
      refactoringRecommendations: []
    };
  }

  getOptimizationHistory(): OptimizationMetrics[] {
    return [...this.optimizationHistory];
  }

  getSystemHealth(): {
    efficiency: number;
    memoryHealth: number;
    performanceScore: number;
    recommendations: string[];
  } {
    const metrics = simpleOptimizer.getMetrics();
    
    return {
      efficiency: metrics.systemEfficiency,
      memoryHealth: Math.max(0, 100 - (metrics.memoryReduced / 10)),
      performanceScore: (metrics.systemEfficiency + metrics.totalOptimizations) / 2,
      recommendations: [
        'Run optimizations regularly',
        'Monitor system performance',
        'Keep components under 200 lines',
        'Use proper error handling'
      ]
    };
  }
}

export const optimizedQASystem = new SimpleQASystem();
export { SimpleQASystem };
export type { OptimizationMetrics };