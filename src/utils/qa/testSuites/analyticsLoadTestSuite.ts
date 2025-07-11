
import { QATestResult } from '../types';
import { DataAnalysisEngine } from '../../analysis/dataAnalysisEngine';
import { ParsedData, DataColumn } from '../../dataParser';

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
      const concurrentPromises: Promise<any>[] = [];
      
      // Create multiple analysis engines running concurrently
      for (let i = 0; i < 5; i++) {
        const mockData: ParsedData = {
          columns: [
            { name: 'action', type: 'string' },
            { name: 'user_id', type: 'string' },
            { name: 'product_name', type: 'string' }
          ],
          rows: Array.from({ length: 1000 }, (_, j) => ({
            action: j % 2 === 0 ? 'view' : 'purchase',
            user_id: `user${j % 50}`,
            product_name: `Product ${j % 20}`
          })),
          rowCount: 1000,
          fileSize: 50000
        };
        
        const engine = new DataAnalysisEngine(mockData);
        concurrentPromises.push(Promise.resolve(engine.runCompleteAnalysis()));
      }
      
      const results = await Promise.all(concurrentPromises);
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      return {
        testName: 'Concurrent Analysis Load Test',
        status: duration < 10000 && results.every(r => r.length > 0) ? 'pass' : 'warning',
        message: `Concurrent analysis: ${duration.toFixed(0)}ms for 5 parallel analyses`,
        category: 'analytics-load',
        performance: duration
      };
    } catch (error) {
      return {
        testName: 'Concurrent Analysis Load Test',
        status: 'fail',
        message: `Concurrent analysis failed: ${error}`,
        category: 'analytics-load'
      };
    }
  }

  private async testMemoryUsageWithLargeDatasets(): Promise<QATestResult> {
    try {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Create very large dataset
      const largeRows = Array.from({ length: 50000 }, (_, i) => ({
        action: ['view', 'add_to_cart', 'purchase'][i % 3],
        user_id: `user${i % 1000}`,
        session_id: `session${i % 2000}`,
        product_name: `Product ${i % 100}`,
        timestamp: new Date(Date.now() - i * 1000).toISOString(),
        total_order_value: Math.random() * 500,
        cost: Math.random() * 200,
        quantity: Math.floor(Math.random() * 10) + 1
      }));
      
      const mockData: ParsedData = {
        columns: [
          { name: 'action', type: 'string' },
          { name: 'user_id', type: 'string' },
          { name: 'session_id', type: 'string' },
          { name: 'product_name', type: 'string' },
          { name: 'timestamp', type: 'string' },
          { name: 'total_order_value', type: 'number' },
          { name: 'cost', type: 'number' },
          { name: 'quantity', type: 'number' }
        ],
        rows: largeRows,
        rowCount: largeRows.length,
        fileSize: largeRows.length * 300
      };
      
      const engine = new DataAnalysisEngine(mockData);
      const results = engine.runCompleteAnalysis();
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024; // MB
      
      return {
        testName: 'Analytics Memory Usage Test',
        status: memoryIncrease < 100 && results.length > 0 ? 'pass' : 'warning',
        message: `Memory usage: ${memoryIncrease.toFixed(1)}MB increase for ${largeRows.length} rows`,
        category: 'analytics-load',
        performance: memoryIncrease
      };
    } catch (error) {
      return {
        testName: 'Analytics Memory Usage Test',
        status: 'fail',
        message: `Memory test failed: ${error}`,
        category: 'analytics-load'
      };
    }
  }

  private async testAnalysisUnderLoad(): Promise<QATestResult> {
    try {
      const startTime = performance.now();
      let completedAnalyses = 0;
      const maxDuration = 15000; // 15 seconds
      
      const mockData: ParsedData = {
        columns: [
          { name: 'action', type: 'string' },
          { name: 'user_id', type: 'string' },
          { name: 'product_name', type: 'string' },
          { name: 'timestamp', type: 'string' }
        ],
        rows: Array.from({ length: 5000 }, (_, i) => ({
          action: ['view', 'purchase'][i % 2],
          user_id: `user${i % 200}`,
          product_name: `Product ${i % 50}`,
          timestamp: new Date(Date.now() - i * 1000).toISOString()
        })),
        rowCount: 5000,
        fileSize: 250000
      };
      
      // Run analyses continuously for a period
      while (performance.now() - startTime < maxDuration) {
        const engine = new DataAnalysisEngine(mockData);
        const results = engine.runCompleteAnalysis();
        if (results.length > 0) completedAnalyses++;
        
        // Small delay to prevent overwhelming
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const actualDuration = performance.now() - startTime;
      const throughput = completedAnalyses / (actualDuration / 1000); // analyses per second
      
      return {
        testName: 'Analysis Under Load Test',
        status: throughput > 0.5 ? 'pass' : 'warning',
        message: `Load test: ${completedAnalyses} analyses in ${actualDuration.toFixed(0)}ms (${throughput.toFixed(2)}/sec)`,
        category: 'analytics-load',
        performance: throughput
      };
    } catch (error) {
      return {
        testName: 'Analysis Under Load Test',
        status: 'fail',
        message: `Load test failed: ${error}`,
        category: 'analytics-load'
      };
    }
  }

  private async testDataProcessingThroughput(): Promise<QATestResult> {
    try {
      const startTime = performance.now();
      const datasetSizes = [1000, 5000, 10000, 25000];
      const throughputResults: number[] = [];
      
      for (const size of datasetSizes) {
        const testStart = performance.now();
        
        const mockData: ParsedData = {
          columns: [
            { name: 'action', type: 'string' },
            { name: 'user_id', type: 'string' },
            { name: 'product_name', type: 'string' }
          ],
          rows: Array.from({ length: size }, (_, i) => ({
            action: ['view', 'add_to_cart', 'purchase'][i % 3],
            user_id: `user${i % 100}`,
            product_name: `Product ${i % 30}`
          })),
          rowCount: size,
          fileSize: size * 100
        };
        
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
      return {
        testName: 'Data Processing Throughput Test',
        status: 'fail',
        message: `Throughput test failed: ${error}`,
        category: 'analytics-load'
      };
    }
  }
}
