
import { QATestSuites } from './qaTestSuites';

export class PerformanceMonitor {
  private qaTestSuites: QATestSuites;
  private performanceMetrics: Map<string, number> = new Map();

  constructor(qaTestSuites: QATestSuites) {
    this.qaTestSuites = qaTestSuites;
  }

  async runTestWithMetrics<T>(testName: string, testFn: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    const startMemory = this.getMemoryUsage();
    
    try {
      const result = await testFn();
      const endTime = performance.now();
      const endMemory = this.getMemoryUsage();
      
      const duration = endTime - startTime;
      const memoryDelta = endMemory - startMemory;
      
      this.performanceMetrics.set(`${testName}_duration`, duration);
      this.performanceMetrics.set(`${testName}_memory`, memoryDelta);
      
      console.log(`⏱️ ${testName}: ${duration.toFixed(2)}ms, Memory: ${memoryDelta > 0 ? '+' : ''}${memoryDelta.toFixed(2)}MB`);
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.performanceMetrics.set(`${testName}_duration`, duration);
      this.performanceMetrics.set(`${testName}_error`, 1);
      
      console.error(`❌ ${testName} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024;
    }
    return 0;
  }

  calculateSystemEfficiency(): number {
    let efficiency = 100;
    
    // Penalize for slow test execution
    this.performanceMetrics.forEach((duration, testName) => {
      if (testName.endsWith('_duration')) {
        if (duration > 1000) efficiency -= 10; // Very slow
        else if (duration > 500) efficiency -= 5; // Slow
      }
    });
    
    // Penalize for errors
    this.performanceMetrics.forEach((value, testName) => {
      if (testName.endsWith('_error')) {
        efficiency -= 20; // Major penalty for errors
      }
    });
    
    return Math.max(0, efficiency);
  }

  calculateMemoryEfficiency(): number {
    let efficiency = 100;
    let totalMemoryDelta = 0;
    let memoryTests = 0;
    
    this.performanceMetrics.forEach((memoryDelta, testName) => {
      if (testName.endsWith('_memory')) {
        totalMemoryDelta += memoryDelta;
        memoryTests++;
      }
    });
    
    if (memoryTests > 0) {
      const avgMemoryDelta = totalMemoryDelta / memoryTests;
      if (avgMemoryDelta > 50) efficiency -= 30; // High memory usage
      else if (avgMemoryDelta > 20) efficiency -= 15; // Moderate memory usage
      else if (avgMemoryDelta > 10) efficiency -= 5; // Low memory usage
    }
    
    return Math.max(0, efficiency);
  }

  getMetrics(): Map<string, number> {
    return this.performanceMetrics;
  }

  clearMetrics(): void {
    this.performanceMetrics.clear();
  }
}
