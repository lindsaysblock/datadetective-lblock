
import { QATestResult } from '../types';
import { DataAnalysisEngine } from '../../analysis/dataAnalysisEngine';
import { ParsedData } from '../../dataParser';

export class AnalyticsLoadTestSuite {
  async runLoadTests(): Promise<QATestResult[]> {
    const results: QATestResult[] = [];
    
    results.push(await this.testConcurrentAnalysis());
    results.push(await this.testMemoryUsageWithLargeDatasets());
    results.push(await this.testAnalysisUnderLoad());
    results.push(await this.testDataProcessingThroughput());
    
    return results;
  }

  private async testConcurrentAnalysis(): Promise<QATestResult> {
    try {
      const startTime = performance.now();
      const mockData = this.createMockBehavioralData(1000);
      
      // Run 5 concurrent analyses
      const analysisPromises = Array.from({ length: 5 }, () => {
        const engine = new DataAnalysisEngine(mockData);
        return Promise.resolve(engine.runCompleteAnalysis());
      });
      
      const results = await Promise.all(analysisPromises);
      const duration = performance.now() - startTime;
      
      return {
        testName: 'Concurrent Analysis Load Test',
        status: duration < 10000 && results.every(r => r.length > 0) ? 'pass' : 'warning',
        message: `Concurrent analysis: ${duration.toFixed(0)}ms for 5 parallel analyses`,
        category: 'analytics-load',
        performance: duration
      };
    } catch (error) {
      return this.createErrorResult('Concurrent Analysis Load Test', error);
    }
  }

  private async testMemoryUsageWithLargeDatasets(): Promise<QATestResult> {
    try {
      const initialMemory = this.getMemoryUsage();
      const largeData = this.createMockBehavioralData(50000);
      
      const engine = new DataAnalysisEngine(largeData);
      const results = engine.runCompleteAnalysis();
      
      const finalMemory = this.getMemoryUsage();
      const memoryIncrease = finalMemory - initialMemory;
      
      return {
        testName: 'Analytics Memory Usage Test',
        status: memoryIncrease < 100 && results.length > 0 ? 'pass' : 'warning',
        message: `Memory usage: ${memoryIncrease.toFixed(1)}MB increase for ${largeData.rowCount} rows`,
        category: 'analytics-load',
        performance: memoryIncrease
      };
    } catch (error) {
      return this.createErrorResult('Analytics Memory Usage Test', error);
    }
  }

  private async testAnalysisUnderLoad(): Promise<QATestResult> {
    try {
      const startTime = performance.now();
      let completedAnalyses = 0;
      const maxDuration = 15000;
      const mockData = this.createMockBehavioralData(5000);
      
      while (performance.now() - startTime < maxDuration) {
        const engine = new DataAnalysisEngine(mockData);
        const results = engine.runCompleteAnalysis();
        if (results.length > 0) completedAnalyses++;
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const actualDuration = performance.now() - startTime;
      const throughput = completedAnalyses / (actualDuration / 1000);
      
      return {
        testName: 'Analysis Under Load Test',
        status: throughput > 0.5 ? 'pass' : 'warning',
        message: `Load test: ${completedAnalyses} analyses in ${actualDuration.toFixed(0)}ms (${throughput.toFixed(2)}/sec)`,
        category: 'analytics-load',
        performance: throughput
      };
    } catch (error) {
      return this.createErrorResult('Analysis Under Load Test', error);
    }
  }

  private async testDataProcessingThroughput(): Promise<QATestResult> {
    try {
      const datasetSizes = [1000, 5000, 10000, 25000];
      const throughputResults: number[] = [];
      
      for (const size of datasetSizes) {
        const testStart = performance.now();
        const mockData = this.createMockBehavioralData(size);
        
        const engine = new DataAnalysisEngine(mockData);
        const results = engine.runCompleteAnalysis();
        
        const testDuration = performance.now() - testStart;
        const rowsPerSecond = size / (testDuration / 1000);
        throughputResults.push(rowsPerSecond);
        
        if (results.length === 0) throw new Error(`No results for ${size} rows`);
      }
      
      const avgThroughput = throughputResults.reduce((sum, val) => sum + val, 0) / throughputResults.length;
      
      return {
        testName: 'Data Processing Throughput Test',
        status: avgThroughput > 1000 ? 'pass' : 'warning',
        message: `Throughput: ${avgThroughput.toFixed(0)} rows/sec average across ${datasetSizes.length} dataset sizes`,
        category: 'analytics-load',
        performance: avgThroughput
      };
    } catch (error) {
      return this.createErrorResult('Data Processing Throughput Test', error);
    }
  }

  private createMockBehavioralData(size: number): ParsedData {
    const actions = ['view', 'add_to_cart', 'purchase', 'share', 'like'];
    const products = Array.from({ length: 20 }, (_, i) => `Product ${i + 1}`);
    
    return {
      columns: [
        { name: 'action', type: 'string', samples: actions },
        { name: 'user_id', type: 'string', samples: ['user1', 'user2'] },
        { name: 'product_name', type: 'string', samples: products.slice(0, 3) },
        { name: 'timestamp', type: 'string', samples: ['2024-01-01T10:00:00Z'] },
        { name: 'total_order_value', type: 'number', samples: [99.99] },
        { name: 'cost', type: 'number', samples: [29.99] },
        { name: 'quantity', type: 'number', samples: [1, 2, 3] }
      ],
      rows: Array.from({ length: size }, (_, i) => ({
        action: actions[i % actions.length],
        user_id: `user${i % 1000}`,
        product_name: products[i % products.length],
        timestamp: new Date(Date.now() - i * 1000).toISOString(),
        total_order_value: Math.random() * 500,
        cost: Math.random() * 200,
        quantity: Math.floor(Math.random() * 10) + 1
      })),
      rowCount: size,
      fileSize: size * 300,
      summary: {
        totalRows: size,
        totalColumns: 7,
        possibleUserIdColumns: ['user_id'],
        possibleEventColumns: ['action'],
        possibleTimestampColumns: ['timestamp']
      }
    };
  }

  private getMemoryUsage(): number {
    return 'memory' in performance ? 
      (performance as any).memory.usedJSHeapSize / 1024 / 1024 : 0;
  }

  private createErrorResult(testName: string, error: unknown): QATestResult {
    return {
      testName,
      status: 'fail',
      message: `${testName} failed: ${error}`,
      category: 'analytics-load'
    };
  }
}
