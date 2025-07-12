import { TestSuite } from '../types';
import { TestRunner } from '../testRunner';
import { createDataColumn } from '../../dataColumnHelper';

export class CoreAnalyticsTests {
  private testRunner = new TestRunner();

  async run(): Promise<TestSuite> {
    const setupStart = performance.now();
    const setupTime = performance.now() - setupStart;

    const suiteStart = performance.now();
    const tests = [];

    tests.push(await this.testRunner.runTest('Core Analytics Test - Data Validation', (assert) => {
      const mockData = this.createTestData();
      assert.truthy(mockData.columns.length > 0, 'Mock data should have columns');
      assert.equal(mockData.totalRows, 2, 'Mock data should have 2 rows');
    }));

    tests.push(await this.testRunner.runTest('Core Analytics Test - Basic Calculations', (assert) => {
      const mockData = this.createTestData();
      const purchaseRows = mockData.rows.filter(row => row.action === 'purchase');
      assert.equal(purchaseRows.length, 1, 'Should find 1 purchase row');
    }));

    const teardownStart = performance.now();
    const teardownTime = performance.now() - teardownStart;

    return {
      suiteName: 'Core Analytics Tests',
      tests,
      setupTime,
      teardownTime,
      totalDuration: performance.now() - suiteStart
    };
  }

  private createTestData(): any {
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
}
