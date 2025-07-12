import { TestSuite } from '../types';
import { TestRunner } from '../testRunner';
import { DataAnalysisEngine } from '../../analysis/dataAnalysisEngine';
import { createDataColumn } from '../../dataColumnHelper';

export class AnalyticsIntegrationTests {
  private testRunner = new TestRunner();

  async run(): Promise<TestSuite> {
    const setupStart = performance.now();
    const setupTime = performance.now() - setupStart;

    const suiteStart = performance.now();
    const tests = [];

    tests.push(await this.testRunner.runTest('Basic analysis integration', (assert) => {
      const mockData = this.createBasicTestData();
      const engine = new DataAnalysisEngine(mockData);
      const results = engine.runCompleteAnalysis();

      assert.truthy(results.length > 0, 'Should generate analysis results');
    }));

    tests.push(await this.testRunner.runTest('Complex analysis integration', (assert) => {
      const mockData = this.createComplexTestData();
      const engine = new DataAnalysisEngine(mockData);
      const results = engine.runCompleteAnalysis();

      assert.truthy(results.length > 0, 'Should generate complex analysis results');
    }));

    tests.push(await this.testRunner.runTest('Time-based analysis integration', (assert) => {
      const mockData = this.createTimeBasedTestData();
      const engine = new DataAnalysisEngine(mockData);
      const results = engine.analyzeTimeTrends();

      assert.truthy(results.length > 0, 'Should generate time-based analysis results');
    }));

    const teardownStart = performance.now();
    const teardownTime = performance.now() - teardownStart;

    return {
      suiteName: 'Analytics Integration Tests',
      tests,
      setupTime,
      teardownTime,
      totalDuration: performance.now() - suiteStart
    };
  }

  private createBasicTestData(): any {
    return {
      columns: [
        createDataColumn('action', 'string'),
        createDataColumn('total_order_value', 'number')
      ],
      rows: [
        { action: 'purchase', total_order_value: 100 },
        { action: 'view', total_order_value: null }
      ],
      rowCount: 2,
      fileSize: 150,
      summary: { totalRows: 2, totalColumns: 2 }
    };
  }

  private createComplexTestData(): any {
    return {
      columns: [
        createDataColumn('action', 'string'),
        createDataColumn('user_id', 'string'),
        createDataColumn('product_name', 'string'),
        createDataColumn('total_order_value', 'number')
      ],
      rows: [
        { action: 'purchase', user_id: 'user1', product_name: 'Product A', total_order_value: 100 },
        { action: 'view', user_id: 'user2', product_name: 'Product B', total_order_value: null }
      ],
      rowCount: 2,
      fileSize: 200,
      summary: { totalRows: 2, totalColumns: 4 }
    };
  }

  private createTimeBasedTestData(): any {
    return {
      columns: [
        createDataColumn('action', 'string'),
        createDataColumn('user_id', 'string'),
        createDataColumn('timestamp', 'string')
      ],
      rows: [
        { action: 'purchase', user_id: 'user1', timestamp: '2024-01-01T10:00:00Z' },
        { action: 'view', user_id: 'user2', timestamp: '2024-01-02T11:00:00Z' }
      ],
      rowCount: 2,
      fileSize: 180,
      summary: { totalRows: 2, totalColumns: 3 }
    };
  }
}
