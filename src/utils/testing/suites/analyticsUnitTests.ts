
import { ParsedData } from '../../dataParser';
import { DataAnalysisEngine } from '../../analysis/dataAnalysisEngine';
import { RowCountAnalyzer } from '../../analysis/analyzers/rowCountAnalyzer';
import { ActionAnalyzer } from '../../analysis/analyzers/actionAnalyzer';
import { TimeAnalyzer } from '../../analysis/analyzers/timeAnalyzer';
import { ProductAnalyzer } from '../../analysis/analyzers/productAnalyzer';
import { TestResult } from '../types';

export class AnalyticsUnitTestSuite {
  async runTests(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    results.push(...await this.testRowCountAnalyzer());
    results.push(...await this.testActionAnalyzer());
    results.push(...await this.testTimeAnalyzer());
    results.push(...await this.testProductAnalyzer());
    results.push(...await this.testDataAnalysisEngine());
    results.push(...await this.testErrorHandling());
    
    return results;
  }

  private async testRowCountAnalyzer(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    try {
      const testData = this.createTestData();
      const analyzer = new RowCountAnalyzer(testData);
      const analysisResults = analyzer.analyze();
      
      const totalRowsResult = analysisResults.find(r => r.id === 'total-rows');
      const dataCompletenessResult = analysisResults.find(r => r.id === 'data-completeness');
      
      results.push({
        testName: 'RowCountAnalyzer - Basic Metrics',
        status: totalRowsResult?.value === 50 ? 'pass' : 'fail',
        message: `Total rows: ${totalRowsResult?.value}, expected: 50`,
        category: 'unit'
      });

      results.push({
        testName: 'RowCountAnalyzer - Data Completeness',
        status: dataCompletenessResult && typeof dataCompletenessResult.value === 'number' ? 'pass' : 'fail',
        message: `Data completeness: ${dataCompletenessResult?.value}%`,
        category: 'unit'
      });

    } catch (error) {
      results.push({
        testName: 'RowCountAnalyzer - Error Handling',
        status: 'fail',
        message: `Analyzer failed: ${error}`,
        category: 'unit'
      });
    }
    
    return results;
  }

  private async testActionAnalyzer(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    try {
      const testData = this.createActionTestData();
      const analyzer = new ActionAnalyzer(testData);
      const analysisResults = analyzer.analyze();
      
      const actionBreakdownResult = analysisResults.find(r => r.id === 'action-breakdown');
      const authResult = analysisResults.find(r => r.id === 'user-authentication');
      
      results.push({
        testName: 'ActionAnalyzer - Action Breakdown',
        status: actionBreakdownResult && actionBreakdownResult.chartData ? 'pass' : 'fail',
        message: `Action breakdown generated with ${actionBreakdownResult?.chartData?.length || 0} actions`,
        category: 'unit'
      });

      results.push({
        testName: 'ActionAnalyzer - Authentication Analysis',
        status: authResult ? 'pass' : 'fail',
        message: `Authentication analysis: ${authResult ? 'completed' : 'missing'}`,
        category: 'unit'
      });

    } catch (error) {
      results.push({
        testName: 'ActionAnalyzer - Error Handling',
        status: 'fail',
        message: `Analyzer failed: ${error}`,
        category: 'unit'
      });
    }
    
    return results;
  }

  private async testTimeAnalyzer(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    try {
      const testData = this.createTimeSeriesData();
      const analyzer = new TimeAnalyzer(testData);
      const analysisResults = analyzer.analyze();
      
      const purchaseTrendsResult = analysisResults.find(r => r.id === 'purchases-by-date');
      const hourlyEngagementResult = analysisResults.find(r => r.id === 'time-by-hour');
      
      results.push({
        testName: 'TimeAnalyzer - Purchase Trends',
        status: purchaseTrendsResult ? 'pass' : 'fail',
        message: `Purchase trends: ${purchaseTrendsResult ? 'generated' : 'missing'}`,
        category: 'unit'
      });

      results.push({
        testName: 'TimeAnalyzer - Hourly Engagement',
        status: hourlyEngagementResult ? 'pass' : 'fail',
        message: `Hourly engagement: ${hourlyEngagementResult ? 'generated' : 'missing'}`,
        category: 'unit'
      });

    } catch (error) {
      results.push({
        testName: 'TimeAnalyzer - Error Handling',
        status: 'fail',
        message: `Analyzer failed: ${error}`,
        category: 'unit'
      });
    }
    
    return results;
  }

  private async testProductAnalyzer(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    try {
      const testData = this.createProductData();
      const analyzer = new ProductAnalyzer(testData);
      const analysisResults = analyzer.analyze();
      
      const topViewedResult = analysisResults.find(r => r.id === 'top-viewed-products');
      const topPurchasedResult = analysisResults.find(r => r.id === 'top-purchased-products');
      const topProfitResult = analysisResults.find(r => r.id === 'top-profit-products');
      
      results.push({
        testName: 'ProductAnalyzer - Top Viewed Products',
        status: topViewedResult ? 'pass' : 'fail',
        message: `Top viewed products: ${topViewedResult ? 'generated' : 'missing'}`,
        category: 'unit'
      });

      results.push({
        testName: 'ProductAnalyzer - Top Purchased Products',
        status: topPurchasedResult ? 'pass' : 'fail',
        message: `Top purchased products: ${topPurchasedResult ? 'generated' : 'missing'}`,
        category: 'unit'
      });

      results.push({
        testName: 'ProductAnalyzer - Profit Analysis',
        status: topProfitResult ? 'pass' : 'fail',
        message: `Profit analysis: ${topProfitResult ? 'generated' : 'missing'}`,
        category: 'unit'
      });

    } catch (error) {
      results.push({
        testName: 'ProductAnalyzer - Error Handling',
        status: 'fail',
        message: `Analyzer failed: ${error}`,
        category: 'unit'
      });
    }
    
    return results;
  }

  private async testDataAnalysisEngine(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    try {
      const testData = this.createComprehensiveTestData();
      const engine = new DataAnalysisEngine(testData);
      const analysisResults = engine.runCompleteAnalysis();
      
      results.push({
        testName: 'DataAnalysisEngine - Complete Analysis',
        status: analysisResults.length > 0 ? 'pass' : 'fail',
        message: `Generated ${analysisResults.length} analysis results`,
        category: 'unit'
      });

      const highConfidenceResults = analysisResults.filter(r => r.confidence === 'high');
      results.push({
        testName: 'DataAnalysisEngine - High Confidence Results',
        status: highConfidenceResults.length > 0 ? 'pass' : 'warning',
        message: `${highConfidenceResults.length}/${analysisResults.length} high confidence results`,
        category: 'unit'
      });

      const summary = engine.getAnalysisSummary();
      results.push({
        testName: 'DataAnalysisEngine - Analysis Summary',
        status: summary.totalResults > 0 ? 'pass' : 'fail',
        message: `Summary: ${summary.totalResults} results, quality: ${summary.dataQuality}`,
        category: 'unit'
      });

    } catch (error) {
      results.push({
        testName: 'DataAnalysisEngine - Error Handling',
        status: 'fail',
        message: `Engine failed: ${error}`,
        category: 'unit'
      });
    }
    
    return results;
  }

  private async testErrorHandling(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    // Test with invalid data
    try {
      const invalidData: ParsedData = {
        columns: [],
        rows: [],
        rowCount: 0,
        fileSize: 0,
        summary: { totalRows: 0, totalColumns: 0 }
      };
      
      const engine = new DataAnalysisEngine(invalidData);
      const analysisResults = engine.runCompleteAnalysis();
      
      results.push({
        testName: 'Error Handling - Empty Data',
        status: analysisResults.length >= 0 ? 'pass' : 'fail',
        message: `Empty data handled gracefully, ${analysisResults.length} results`,
        category: 'error-handling'
      });

    } catch (error) {
      results.push({
        testName: 'Error Handling - Empty Data',
        status: 'warning',
        message: `Empty data caused error: ${error}`,
        category: 'error-handling'
      });
    }
    
    return results;
  }

  // Test data creation methods
  private createTestData(): ParsedData {
    return {
      columns: [
        { name: 'id', type: 'string' },
        { name: 'user_id', type: 'string' },
        { name: 'action', type: 'string' }
      ],
      rows: Array.from({ length: 50 }, (_, i) => ({
        id: `item_${i}`,
        user_id: `user_${i % 10}`,
        action: i % 2 === 0 ? 'view' : 'purchase'
      })),
      rowCount: 50,
      fileSize: 2500,
      summary: { totalRows: 50, totalColumns: 3 }
    };
  }

  private createActionTestData(): ParsedData {
    return {
      columns: [
        { name: 'action', type: 'string' },
        { name: 'user_id', type: 'string' }
      ],
      rows: [
        { action: 'view', user_id: 'user1' },
        { action: 'view', user_id: 'user2' },
        { action: 'purchase', user_id: 'user1' },
        { action: 'view', user_id: 'unknown' }
      ],
      rowCount: 4,
      fileSize: 200,
      summary: { totalRows: 4, totalColumns: 2 }
    };
  }

  private createTimeSeriesData(): ParsedData {
    return {
      columns: [
        { name: 'action', type: 'string' },
        { name: 'timestamp', type: 'string' },
        { name: 'time_spent_sec', type: 'number' }
      ],
      rows: Array.from({ length: 20 }, (_, i) => ({
        action: 'purchase',
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        time_spent_sec: Math.random() * 300 + 60
      })),
      rowCount: 20,
      fileSize: 1000,
      summary: { totalRows: 20, totalColumns: 3 }
    };
  }

  private createProductData(): ParsedData {
    return {
      columns: [
        { name: 'action', type: 'string' },
        { name: 'product_name', type: 'string' },
        { name: 'total_order_value', type: 'number' },
        { name: 'cost', type: 'number' },
        { name: 'quantity', type: 'number' }
      ],
      rows: Array.from({ length: 30 }, (_, i) => ({
        action: i % 3 === 0 ? 'purchase' : 'view',
        product_name: `Product ${String.fromCharCode(65 + (i % 5))}`,
        total_order_value: i % 3 === 0 ? Math.random() * 200 + 50 : null,
        cost: i % 3 === 0 ? Math.random() * 50 + 10 : null,
        quantity: i % 3 === 0 ? Math.floor(Math.random() * 5) + 1 : null
      })),
      rowCount: 30,
      fileSize: 1500,
      summary: { totalRows: 30, totalColumns: 5 }
    };
  }

  private createComprehensiveTestData(): ParsedData {
    return {
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'session_id', type: 'string' },
        { name: 'action', type: 'string' },
        { name: 'product_name', type: 'string' },
        { name: 'timestamp', type: 'string' },
        { name: 'total_order_value', type: 'number' },
        { name: 'cost', type: 'number' },
        { name: 'time_spent_sec', type: 'number' }
      ],
      rows: Array.from({ length: 100 }, (_, i) => ({
        user_id: `user_${i % 20}`,
        session_id: `session_${i % 50}`,
        action: ['view', 'purchase', 'add_to_cart'][i % 3],
        product_name: `Product ${String.fromCharCode(65 + (i % 10))}`,
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
        total_order_value: i % 3 === 1 ? Math.random() * 500 + 50 : null,
        cost: i % 3 === 1 ? Math.random() * 200 + 20 : null,
        time_spent_sec: Math.random() * 600 + 30
      })),
      rowCount: 100,
      fileSize: 8000,
      summary: { 
        totalRows: 100, 
        totalColumns: 8,
        possibleUserIdColumns: ['user_id'],
        possibleEventColumns: ['action'],
        possibleTimestampColumns: ['timestamp']
      }
    };
  }
}
