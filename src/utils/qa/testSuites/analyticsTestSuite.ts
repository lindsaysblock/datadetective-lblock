
import { QATestResult } from '../types';
import { DataAnalysisEngine } from '../../analysis/dataAnalysisEngine';
import { ParsedData, DataColumn } from '../../dataParser';

export class AnalyticsTestSuite {
  async runTests(): Promise<QATestResult[]> {
    const results: QATestResult[] = [];
    
    results.push(await this.testBasicAnalysis());
    results.push(await this.testRowCountAnalysis());
    results.push(await this.testActionBreakdownAnalysis());
    results.push(await this.testTimeAnalysis());
    results.push(await this.testProductAnalysis());
    results.push(await this.testDataQuality());
    
    return results;
  }

  private async testBasicAnalysis(): Promise<QATestResult> {
    try {
      const mockData: ParsedData = {
        columns: [
          { name: 'action', type: 'string' },
          { name: 'user_id', type: 'string' },
          { name: 'product_name', type: 'string' },
          { name: 'timestamp', type: 'string' }
        ],
        rows: [
          { action: 'view', user_id: 'user1', product_name: 'Product A', timestamp: '2024-01-01T10:00:00Z' },
          { action: 'purchase', user_id: 'user2', product_name: 'Product B', timestamp: '2024-01-01T11:00:00Z' }
        ],
        rowCount: 2,
        fileSize: 500
      };
      
      const engine = new DataAnalysisEngine(mockData);
      const results = engine.runCompleteAnalysis();
      
      return {
        testName: 'Basic Analytics Engine Test',
        status: results.length > 0 ? 'pass' : 'fail',
        message: `Generated ${results.length} analysis results`,
        category: 'analytics'
      };
    } catch (error) {
      return {
        testName: 'Basic Analytics Engine Test',
        status: 'fail',
        message: `Analysis failed: ${error}`,
        category: 'analytics'
      };
    }
  }

  private async testRowCountAnalysis(): Promise<QATestResult> {
    try {
      const mockData: ParsedData = {
        columns: [
          { name: 'action', type: 'string' },
          { name: 'user_id', type: 'string' },
          { name: 'session_id', type: 'string' },
          { name: 'order_id', type: 'string' },
          { name: 'total_order_value', type: 'number' }
        ],
        rows: Array.from({ length: 1000 }, (_, i) => ({
          action: i % 3 === 0 ? 'purchase' : 'view',
          user_id: `user${i % 100}`,
          session_id: `session${i % 200}`,
          order_id: i % 3 === 0 ? (i % 10 === 0 ? null : `order${i}`) : null,
          total_order_value: i % 3 === 0 ? (i % 20 === 0 ? 0 : Math.random() * 100) : null
        })),
        rowCount: 1000,
        fileSize: 50000
      };
      
      const engine = new DataAnalysisEngine(mockData);
      const results = engine.analyzeRowCounts();
      
      const totalRowsResult = results.find(r => r.id === 'total-rows');
      const purchaseCountResult = results.find(r => r.id === 'purchase-count');
      
      return {
        testName: 'Row Count Analysis Test',
        status: totalRowsResult?.value === 1000 && purchaseCountResult ? 'pass' : 'fail',
        message: `Row analysis: ${totalRowsResult?.value} total rows, ${purchaseCountResult?.value} purchases`,
        category: 'analytics'
      };
    } catch (error) {
      return {
        testName: 'Row Count Analysis Test',
        status: 'fail',
        message: `Row count analysis failed: ${error}`,
        category: 'analytics'
      };
    }
  }

  private async testActionBreakdownAnalysis(): Promise<QATestResult> {
    try {
      const mockData: ParsedData = {
        columns: [
          { name: 'action', type: 'string' },
          { name: 'user_id', type: 'string' }
        ],
        rows: [
          { action: 'view', user_id: 'user1' },
          { action: 'view', user_id: 'user2' },
          { action: 'purchase', user_id: 'user3' },
          { action: 'view', user_id: 'unknown' }
        ],
        rowCount: 4,
        fileSize: 200
      };
      
      const engine = new DataAnalysisEngine(mockData);
      const results = engine.analyzeActionBreakdown();
      
      const actionResult = results.find(r => r.id === 'action-breakdown');
      
      return {
        testName: 'Action Breakdown Analysis Test',
        status: actionResult && actionResult.chartData ? 'pass' : 'fail',
        message: `Action breakdown generated with ${actionResult?.chartData?.length || 0} action types`,
        category: 'analytics'
      };
    } catch (error) {
      return {
        testName: 'Action Breakdown Analysis Test',
        status: 'fail',
        message: `Action breakdown failed: ${error}`,
        category: 'analytics'
      };
    }
  }

  private async testTimeAnalysis(): Promise<QATestResult> {
    try {
      const mockData: ParsedData = {
        columns: [
          { name: 'action', type: 'string' },
          { name: 'user_id', type: 'string' },
          { name: 'timestamp', type: 'string' }
        ],
        rows: Array.from({ length: 50 }, (_, i) => ({
          action: 'purchase',
          user_id: `user${i}`,
          timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
        })),
        rowCount: 50,
        fileSize: 2500
      };
      
      const engine = new DataAnalysisEngine(mockData);
      const results = engine.analyzeTimeTrends();
      
      const timeResult = results.find(r => r.id === 'purchases-by-date');
      
      return {
        testName: 'Time Analysis Test',
        status: timeResult ? 'pass' : 'fail',
        message: `Time analysis generated ${results.length} time-based insights`,
        category: 'analytics'
      };
    } catch (error) {
      return {
        testName: 'Time Analysis Test',
        status: 'fail',
        message: `Time analysis failed: ${error}`,
        category: 'analytics'
      };
    }
  }

  private async testProductAnalysis(): Promise<QATestResult> {
    try {
      const mockData: ParsedData = {
        columns: [
          { name: 'action', type: 'string' },
          { name: 'user_id', type: 'string' },
          { name: 'product_name', type: 'string' },
          { name: 'total_order_value', type: 'number' },
          { name: 'cost', type: 'number' },
          { name: 'quantity', type: 'number' }
        ],
        rows: Array.from({ length: 100 }, (_, i) => ({
          action: i % 4 === 0 ? 'purchase' : 'view',
          user_id: `user${i % 20}`,
          product_name: `Product ${String.fromCharCode(65 + (i % 5))}`,
          total_order_value: i % 4 === 0 ? Math.random() * 200 + 50 : null,
          cost: i % 4 === 0 ? Math.random() * 50 + 10 : null,
          quantity: i % 4 === 0 ? Math.floor(Math.random() * 5) + 1 : null
        })),
        rowCount: 100,
        fileSize: 8000
      };
      
      const engine = new DataAnalysisEngine(mockData);
      const results = engine.analyzeProducts();
      
      const topViewsResult = results.find(r => r.id === 'top-viewed-products');
      const topPurchasesResult = results.find(r => r.id === 'top-purchased-products');
      
      return {
        testName: 'Product Analysis Test',
        status: topViewsResult && topPurchasesResult ? 'pass' : 'fail',
        message: `Product analysis: ${results.length} product insights generated`,
        category: 'analytics'
      };
    } catch (error) {
      return {
        testName: 'Product Analysis Test',
        status: 'fail',
        message: `Product analysis failed: ${error}`,
        category: 'analytics'
      };
    }
  }

  private async testDataQuality(): Promise<QATestResult> {
    try {
      const mockData: ParsedData = {
        columns: [
          { name: 'action', type: 'string' },
          { name: 'user_id', type: 'string' },
          { name: 'product_name', type: 'string' },
          { name: 'timestamp', type: 'string' },
          { name: 'total_order_value', type: 'number' },
          { name: 'cost', type: 'number' },
          { name: 'quantity', type: 'number' }
        ],
        rows: [
          // Good data
          { action: 'purchase', user_id: 'user1', product_name: 'Product A', timestamp: '2024-01-01T10:00:00Z', total_order_value: 100, cost: 30, quantity: 2 },
          // Data quality issues
          { action: 'purchase', user_id: 'user2', product_name: 'Product B', timestamp: '2024-01-01T11:00:00Z', total_order_value: 0, cost: 20, quantity: 1 },
          { action: 'purchase', user_id: 'user3', product_name: 'Product C', timestamp: '2024-01-01T12:00:00Z', total_order_value: 50, cost: null, quantity: 1 }
        ],
        rowCount: 3,
        fileSize: 300
      };
      
      const engine = new DataAnalysisEngine(mockData);
      const results = engine.analyzeRowCounts();
      
      const zeroValueResult = results.find(r => r.id === 'zero-value-purchases');
      
      return {
        testName: 'Data Quality Analysis Test',
        status: zeroValueResult ? 'pass' : 'fail',
        message: `Data quality check: ${zeroValueResult?.value || 0} zero-value purchases detected`,
        category: 'analytics'
      };
    } catch (error) {
      return {
        testName: 'Data Quality Analysis Test',
        status: 'fail',
        message: `Data quality analysis failed: ${error}`,
        category: 'analytics'
      };
    }
  }
}
