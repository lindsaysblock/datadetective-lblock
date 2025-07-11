
import { ParsedData } from '../../dataParser';
import { DataAnalysisEngine } from '../../analysis/dataAnalysisEngine';
import { DataValidator } from '../../analytics/dataValidator';
import { AnalyticsPipelineManager } from '../../analytics/pipelineManager';
import { TestResult } from '../types';

export class AnalyticsIntegrationTestSuite {
  async runTests(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    results.push(...await this.testEndToEndAnalytics());
    results.push(...await this.testDataValidationPipeline());
    results.push(...await this.testErrorRecovery());
    results.push(...await this.testPerformanceUnderLoad());
    results.push(...await this.testDataQualityScenarios());
    
    return results;
  }

  private async testEndToEndAnalytics(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    try {
      const mockData = this.createComprehensiveTestData();
      const pipelineManager = new AnalyticsPipelineManager(mockData);
      const pipeline = await pipelineManager.runPipeline();
      
      results.push({
        testName: 'End-to-End Analytics Pipeline',
        status: pipeline.status === 'completed' ? 'pass' : 'fail',
        message: `Pipeline ${pipeline.status} with ${pipeline.stages.length} stages`,
        category: 'integration',
        executionTime: pipeline.stages.reduce((sum, stage) => sum + (stage.duration || 0), 0)
      });

      // Test individual stages
      pipeline.stages.forEach(stage => {
        results.push({
          testName: `Pipeline Stage: ${stage.name}`,
          status: stage.status === 'completed' ? 'pass' : 'fail',
          message: stage.error || `Stage completed in ${stage.duration?.toFixed(0)}ms`,
          category: 'integration'
        });
      });

    } catch (error) {
      results.push({
        testName: 'End-to-End Analytics Pipeline',
        status: 'fail',
        message: `Pipeline failed: ${error}`,
        category: 'integration'
      });
    }
    
    return results;
  }

  private async testDataValidationPipeline(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    // Test various data quality scenarios
    const scenarios = [
      { name: 'High Quality Data', data: this.createHighQualityData() },
      { name: 'Low Quality Data', data: this.createLowQualityData() },
      { name: 'Missing Columns', data: this.createMissingColumnsData() },
      { name: 'Empty Dataset', data: this.createEmptyData() }
    ];

    for (const scenario of scenarios) {
      try {
        const validator = new DataValidator(scenario.data);
        const result = validator.validate();
        
        results.push({
          testName: `Data Validation: ${scenario.name}`,
          status: 'pass',
          message: `Validation result: ${result.isValid ? 'valid' : 'invalid'}, confidence: ${result.confidence}`,
          category: 'validation'
        });
      } catch (error) {
        results.push({
          testName: `Data Validation: ${scenario.name}`,
          status: 'fail',
          message: `Validation failed: ${error}`,
          category: 'validation'
        });
      }
    }
    
    return results;
  }

  private async testErrorRecovery(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    try {
      // Test with corrupted data that should trigger error recovery
      const corruptedData = this.createCorruptedData();
      const pipelineManager = new AnalyticsPipelineManager(corruptedData, {
        enableErrorRecovery: true,
        maxRetries: 2
      });
      
      const pipeline = await pipelineManager.runPipeline();
      
      results.push({
        testName: 'Error Recovery System',
        status: pipeline.stages.some(s => s.status === 'completed') ? 'pass' : 'fail',
        message: `Pipeline handled errors and recovered: ${pipeline.stages.filter(s => s.status === 'completed').length}/${pipeline.stages.length} stages completed`,
        category: 'error-handling'
      });
      
    } catch (error) {
      results.push({
        testName: 'Error Recovery System',
        status: 'fail',
        message: `Error recovery failed: ${error}`,
        category: 'error-handling'
      });
    }
    
    return results;
  }

  private async testPerformanceUnderLoad(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    try {
      const largeDataset = this.createLargeDataset(10000);
      const startTime = performance.now();
      
      const engine = new DataAnalysisEngine(largeDataset, { enableLogging: false });
      const analysisResults = engine.runCompleteAnalysis();
      
      const duration = performance.now() - startTime;
      const throughput = largeDataset.rows.length / (duration / 1000);
      
      results.push({
        testName: 'Large Dataset Performance',
        status: duration < 5000 && analysisResults.length > 0 ? 'pass' : 'warning',
        message: `Processed ${largeDataset.rows.length} rows in ${duration.toFixed(0)}ms (${throughput.toFixed(0)} rows/sec)`,
        category: 'performance',
        executionTime: duration
      });
      
    } catch (error) {
      results.push({
        testName: 'Large Dataset Performance',
        status: 'fail',
        message: `Performance test failed: ${error}`,
        category: 'performance'
      });
    }
    
    return results;
  }

  private async testDataQualityScenarios(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    const qualityScenarios = [
      { name: 'Complete Data', completeness: 100 },
      { name: 'Mostly Complete', completeness: 85 },
      { name: 'Partial Data', completeness: 60 },
      { name: 'Sparse Data', completeness: 30 }
    ];

    for (const scenario of qualityScenarios) {
      try {
        const data = this.createDataWithCompleteness(scenario.completeness);
        const engine = new DataAnalysisEngine(data);
        const results_analysis = engine.runCompleteAnalysis();
        
        const dataCompletenessResult = results_analysis.find(r => r.id === 'data-completeness');
        const actualCompleteness = dataCompletenessResult?.value || 0;
        
        results.push({
          testName: `Data Quality: ${scenario.name}`,
          status: Math.abs(actualCompleteness - scenario.completeness) < 5 ? 'pass' : 'warning',
          message: `Expected ${scenario.completeness}% completeness, got ${actualCompleteness}%`,
          category: 'data-quality'
        });
        
      } catch (error) {
        results.push({
          testName: `Data Quality: ${scenario.name}`,
          status: 'fail',
          message: `Quality test failed: ${error}`,
          category: 'data-quality'
        });
      }
    }
    
    return results;
  }

  // Test data creation methods
  private createComprehensiveTestData(): ParsedData {
    return {
      columns: [
        { name: 'user_id', type: 'string', samples: ['user1', 'user2'] },
        { name: 'action', type: 'string', samples: ['view', 'purchase'] },
        { name: 'product_name', type: 'string', samples: ['Product A', 'Product B'] },
        { name: 'timestamp', type: 'string', samples: ['2024-01-01T10:00:00Z'] },
        { name: 'total_order_value', type: 'number', samples: [100, 50] },
        { name: 'cost', type: 'number', samples: [30, 20] }
      ],
      rows: Array.from({ length: 100 }, (_, i) => ({
        user_id: `user${i % 10}`,
        action: i % 3 === 0 ? 'purchase' : 'view',
        product_name: `Product ${String.fromCharCode(65 + (i % 5))}`,
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
        total_order_value: i % 3 === 0 ? Math.random() * 200 + 50 : null,
        cost: i % 3 === 0 ? Math.random() * 50 + 10 : null
      })),
      rowCount: 100,
      fileSize: 10000,
      summary: { totalRows: 100, totalColumns: 6 }
    };
  }

  private createHighQualityData(): ParsedData {
    return this.createDataWithCompleteness(95);
  }

  private createLowQualityData(): ParsedData {
    return this.createDataWithCompleteness(40);
  }

  private createMissingColumnsData(): ParsedData {
    return {
      columns: [],
      rows: [{ data: 'test' }],
      rowCount: 1,
      fileSize: 100,
      summary: { totalRows: 1, totalColumns: 0 }
    };
  }

  private createEmptyData(): ParsedData {
    return {
      columns: [{ name: 'empty', type: 'string' }],
      rows: [],
      rowCount: 0,
      fileSize: 0,
      summary: { totalRows: 0, totalColumns: 1 }
    };
  }

  private createCorruptedData(): ParsedData {
    return {
      columns: [
        { name: 'id', type: 'string' },
        { name: 'value', type: 'number' }
      ],
      rows: [
        { id: 'valid', value: 100 },
        { id: null, value: 'invalid_number' },
        { id: 'another', value: NaN }
      ],
      rowCount: 3,
      fileSize: 100,
      summary: { totalRows: 3, totalColumns: 2 }
    };
  }

  private createLargeDataset(size: number): ParsedData {
    return {
      columns: [
        { name: 'id', type: 'string' },
        { name: 'action', type: 'string' },
        { name: 'timestamp', type: 'string' },
        { name: 'value', type: 'number' }
      ],
      rows: Array.from({ length: size }, (_, i) => ({
        id: `item_${i}`,
        action: i % 2 === 0 ? 'view' : 'purchase',
        timestamp: new Date(Date.now() - i * 1000).toISOString(),
        value: Math.random() * 1000
      })),
      rowCount: size,
      fileSize: size * 100,
      summary: { totalRows: size, totalColumns: 4 }
    };
  }

  private createDataWithCompleteness(targetCompleteness: number): ParsedData {
    const size = 100;
    const emptyRate = (100 - targetCompleteness) / 100;
    
    return {
      columns: [
        { name: 'user_id', type: 'string' },
        { name: 'action', type: 'string' },
        { name: 'value', type: 'number' }
      ],
      rows: Array.from({ length: size }, (_, i) => ({
        user_id: Math.random() < emptyRate ? null : `user${i}`,
        action: Math.random() < emptyRate ? null : 'test_action',
        value: Math.random() < emptyRate ? null : Math.random() * 100
      })),
      rowCount: size,
      fileSize: size * 50,
      summary: { totalRows: size, totalColumns: 3 }
    };
  }
}
