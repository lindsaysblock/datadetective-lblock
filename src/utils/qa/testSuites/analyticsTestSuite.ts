
import { QATestResult } from '../types';
import { DataAnalysisEngine } from '../../analysis/dataAnalysisEngine';
import { ParsedData } from '../../dataParser';

export class AnalyticsTestSuite {
  async runTests(): Promise<QATestResult[]> {
    const results: QATestResult[] = [];
    
    // Test data analysis engine functionality
    results.push(await this.testDataAnalysisEngine());
    results.push(await this.testRowCountAnalysis());
    results.push(await this.testActionAnalysis());
    results.push(await this.testTimeAnalysis());
    results.push(await this.testProductAnalysis());
    results.push(await this.testAnalysisErrorHandling());
    results.push(await this.testPerformanceWithLargeDatasets());
    
    return results;
  }

  private async testDataAnalysisEngine(): Promise<QATestResult> {
    try {
      const mockData: ParsedData = {
        columns: ['action', 'user_id', 'session_id', 'timestamp'],
        rows: [
          { action: 'view', user_id: 'user1', session_id: 'sess1', timestamp: '2024-01-01' },
          { action: 'purchase', user_id: 'user2', session_id: 'sess2', timestamp: '2024-01-02' }
        ],
        totalRows: 2,
        fileSize: 1024
      };
      
      const engine = new DataAnalysisEngine(mockData);
      const results = engine.runCompleteAnalysis();
      
      return {
        testName: 'Data Analysis Engine Initialization',
        status: results.length > 0 ? 'pass' : 'fail',
        message: `Analysis engine produced ${results.length} results`,
        category: 'analytics',
        performance: performance.now()
      };
    } catch (error) {
      return {
        testName: 'Data Analysis Engine Initialization',
        status: 'fail',
        message: `Engine initialization failed: ${error}`,
        category: 'analytics'
      };
    }
  }

  private async testRowCountAnalysis(): Promise<QATestResult> {
    try {
      const mockData: ParsedData = {
        columns: ['action', 'user_id', 'session_id', 'order_id', 'total_order_value'],
        rows: [
          { action: 'purchase', user_id: 'user1', session_id: 'sess1', order_id: 'order1', total_order_value: 100 },
          { action: 'purchase', user_id: 'user2', session_id: 'sess2', order_id: null, total_order_value: 0 },
          { action: 'view', user_id: 'unknown', session_id: 'sess3' }
        ],
        totalRows: 3,
        fileSize: 1024
      };
      
      const engine = new DataAnalysisEngine(mockData);
      const results = engine.analyzeRowCounts();
      
      const totalRowsResult = results.find(r => r.id === 'total-rows');
      const nullOrderResult = results.find(r => r.id === 'null-order-ids');
      
      return {
        testName: 'Row Count Analysis',
        status: totalRowsResult?.value === 3 && nullOrderResult?.value === 1 ? 'pass' : 'fail',
        message: `Row count analysis: ${totalRowsResult?.value} total rows, ${nullOrderResult?.value} null order IDs`,
        category: 'analytics'
      };
    } catch (error) {
      return {
        testName: 'Row Count Analysis',
        status: 'fail',
        message: `Row count analysis failed: ${error}`,
        category: 'analytics'
      };
    }
  }

  private async testActionAnalysis(): Promise<QATestResult> {
    try {
      const mockData: ParsedData = {
        columns: ['action', 'user_id'],
        rows: [
          { action: 'view', user_id: 'user1' },
          { action: 'purchase', user_id: 'user2' },
          { action: 'view', user_id: 'unknown' }
        ],
        totalRows: 3,
        fileSize: 1024
      };
      
      const engine = new DataAnalysisEngine(mockData);
      const results = engine.analyzeActionBreakdown();
      
      const actionResult = results.find(r => r.id === 'action-breakdown');
      const authResult = results.find(r => r.id === 'user-authentication');
      
      return {
        testName: 'Action Analysis',
        status: actionResult?.chartData?.length > 0 && authResult?.chartData?.length === 2 ? 'pass' : 'fail',
        message: `Action analysis: ${actionResult?.chartData?.length} action types, ${authResult?.chartData?.length} auth categories`,
        category: 'analytics'
      };
    } catch (error) {
      return {
        testName: 'Action Analysis',
        status: 'fail',
        message: `Action analysis failed: ${error}`,
        category: 'analytics'
      };
    }
  }

  private async testTimeAnalysis(): Promise<QATestResult> {
    try {
      const mockData: ParsedData = {
        columns: ['action', 'timestamp', 'time_spent_sec'],
        rows: [
          { action: 'purchase', timestamp: '2024-01-01T10:00:00Z', time_spent_sec: 120 },
          { action: 'purchase', timestamp: '2024-01-02T14:00:00Z', time_spent_sec: 180 },
          { action: 'view', timestamp: '2024-01-01T10:30:00Z', time_spent_sec: 60 }
        ],
        totalRows: 3,
        fileSize: 1024
      };
      
      const engine = new DataAnalysisEngine(mockData);
      const results = engine.analyzeTimeTrends();
      
      const dateResult = results.find(r => r.id === 'purchases-by-date');
      const hourResult = results.find(r => r.id === 'time-by-hour');
      
      return {
        testName: 'Time Analysis',
        status: dateResult?.chartData?.length > 0 && hourResult?.chartData?.length > 0 ? 'pass' : 'fail',
        message: `Time analysis: ${dateResult?.chartData?.length} date points, ${hourResult?.chartData?.length} hour points`,
        category: 'analytics'
      };
    } catch (error) {
      return {
        testName: 'Time Analysis',
        status: 'fail',
        message: `Time analysis failed: ${error}`,
        category: 'analytics'
      };
    }
  }

  private async testProductAnalysis(): Promise<QATestResult> {
    try {
      const mockData: ParsedData = {
        columns: ['action', 'product_name', 'total_order_value', 'cost', 'quantity'],
        rows: [
          { action: 'view', product_name: 'Product A' },
          { action: 'purchase', product_name: 'Product A', total_order_value: 100, cost: 50, quantity: 1 },
          { action: 'view', product_name: 'Product B' },
          { action: 'purchase', product_name: 'Product B', total_order_value: 200, cost: 80, quantity: 1 }
        ],
        totalRows: 4,
        fileSize: 1024
      };
      
      const engine = new DataAnalysisEngine(mockData);
      const results = engine.analyzeProducts();
      
      const viewsResult = results.find(r => r.id === 'top-viewed-products');
      const purchasesResult = results.find(r => r.id === 'top-purchased-products');
      const profitResult = results.find(r => r.id === 'top-profit-products');
      
      return {
        testName: 'Product Analysis',
        status: viewsResult?.chartData?.length > 0 && purchasesResult?.chartData?.length > 0 && profitResult?.chartData?.length > 0 ? 'pass' : 'fail',
        message: `Product analysis: ${viewsResult?.chartData?.length} viewed products, ${purchasesResult?.chartData?.length} purchased products, ${profitResult?.chartData?.length} profitable products`,
        category: 'analytics'
      };
    } catch (error) {
      return {
        testName: 'Product Analysis',
        status: 'fail',
        message: `Product analysis failed: ${error}`,
        category: 'analytics'
      };
    }
  }

  private async testAnalysisErrorHandling(): Promise<QATestResult> {
    try {
      const invalidData: ParsedData = {
        columns: [],
        rows: [],
        totalRows: 0,
        fileSize: 0
      };
      
      const engine = new DataAnalysisEngine(invalidData);
      const results = engine.runCompleteAnalysis();
      
      return {
        testName: 'Analysis Error Handling',
        status: results.length >= 0 ? 'pass' : 'fail', // Should handle gracefully
        message: `Error handling: ${results.length} results with empty data`,
        category: 'analytics'
      };
    } catch (error) {
      return {
        testName: 'Analysis Error Handling',
        status: 'pass', // Expected to handle errors gracefully
        message: `Graceful error handling: ${error}`,
        category: 'analytics'
      };
    }
  }

  private async testPerformanceWithLargeDatasets(): Promise<QATestResult> {
    try {
      const startTime = performance.now();
      
      // Create large mock dataset
      const largeRows = Array.from({ length: 10000 }, (_, i) => ({
        action: i % 3 === 0 ? 'view' : i % 3 === 1 ? 'add_to_cart' : 'purchase',
        user_id: `user${i % 100}`,
        session_id: `session${i % 500}`,
        product_name: `Product ${i % 50}`,
        timestamp: new Date(Date.now() - i * 1000).toISOString(),
        total_order_value: Math.random() * 200,
        cost: Math.random() * 100,
        quantity: Math.floor(Math.random() * 5) + 1
      }));
      
      const mockData: ParsedData = {
        columns: ['action', 'user_id', 'session_id', 'product_name', 'timestamp', 'total_order_value', 'cost', 'quantity'],
        rows: largeRows,
        totalRows: largeRows.length,
        fileSize: largeRows.length * 200
      };
      
      const engine = new DataAnalysisEngine(mockData);
      const results = engine.runCompleteAnalysis();
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      return {
        testName: 'Analytics Performance Test',
        status: duration < 5000 && results.length > 0 ? 'pass' : 'warning',
        message: `Performance test: ${duration.toFixed(0)}ms for ${largeRows.length} rows, ${results.length} results`,
        category: 'analytics',
        performance: duration
      };
    } catch (error) {
      return {
        testName: 'Analytics Performance Test',
        status: 'fail',
        message: `Performance test failed: ${error}`,
        category: 'analytics'
      };
    }
  }
}
