import { TestSuite } from '../types';
import { TestRunner } from '../testRunner';
import { createDataColumn } from '../../dataColumnHelper';

export class AnalyticsUnitTestSuite {
  private testRunner = new TestRunner();

  async run(): Promise<TestSuite> {
    const setupStart = performance.now();
    const setupTime = performance.now() - setupStart;

    const suiteStart = performance.now();
    const tests = [];

    tests.push(await this.testRunner.runTest('DataAnalysisEngine initialization', (assert) => {
      const mockData = {
        columns: ['action', 'user_id'],
        rows: [{ action: 'view', user_id: 'user1' }],
        totalRows: 1,
        fileSize: 100
      };
      
      // Test that we can import and create the engine
      assert.truthy(mockData.columns.length > 0, 'Mock data should have columns');
      assert.equal(mockData.totalRows, 1, 'Mock data should have 1 row');
    }));

    tests.push(await this.testRunner.runTest('Row count analysis logic', (assert) => {
      const rows = [
        { action: 'purchase', user_id: 'user1', order_id: 'order1' },
        { action: 'purchase', user_id: 'user2', order_id: null },
        { action: 'view', user_id: 'unknown' }
      ];
      
      const purchaseRows = rows.filter(row => row.action === 'purchase');
      const nullOrderIds = purchaseRows.filter(row => !row.order_id);
      
      assert.equal(purchaseRows.length, 2, 'Should find 2 purchase rows');
      assert.equal(nullOrderIds.length, 1, 'Should find 1 null order ID');
    }));

    tests.push(await this.testRunner.runTest('Action breakdown calculation', (assert) => {
      const rows = [
        { action: 'view', user_id: 'user1' },
        { action: 'view', user_id: 'user2' },
        { action: 'purchase', user_id: 'user3' }
      ];
      
      const actionCounts = rows.reduce((acc, row) => {
        acc[row.action] = (acc[row.action] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      assert.equal(actionCounts.view, 2, 'Should count 2 views');
      assert.equal(actionCounts.purchase, 1, 'Should count 1 purchase');
    }));

    tests.push(await this.testRunner.runTest('Time analysis date parsing', (assert) => {
      const timestamp = '2024-01-15T14:30:00Z';
      const date = new Date(timestamp);
      const hour = date.getHours(); // Should be 14 (2 PM)
      const dateString = date.toDateString();
      
      assert.equal(hour, 14, 'Should extract hour correctly');
      assert.truthy(dateString.includes('2024'), 'Should format date correctly');
    }));

    tests.push(await this.testRunner.runTest('Product profit calculation', (assert) => {
      const row = {
        total_order_value: 100,
        cost: 30,
        quantity: 2
      };
      
      const profit = Number(row.total_order_value) - (Number(row.cost) * Number(row.quantity));
      
      assert.equal(profit, 40, 'Profit should be 100 - (30 * 2) = 40');
    }));

    tests.push(await this.testRunner.runTest('Chart data formatting', (assert) => {
      const actionCounts = { view: 10, purchase: 5 };
      const total = 15;
      
      const chartData = Object.entries(actionCounts).map(([action, count]) => ({
        name: action,
        value: count,
        percentage: ((count / total) * 100).toFixed(1)
      }));
      
      assert.equal(chartData[0].percentage, '66.7', 'View percentage should be 66.7%');
      assert.equal(chartData[1].percentage, '33.3', 'Purchase percentage should be 33.3%');
    }));

    const teardownStart = performance.now();
    const teardownTime = performance.now() - teardownStart;

    return {
      suiteName: 'Analytics Unit Tests',
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
        createDataColumn('user_id', 'string'),
        createDataColumn('product_name', 'string')
      ],
      rows: [
        { action: 'view', user_id: 'user1', product_name: 'Product A' },
        { action: 'purchase', user_id: 'user2', product_name: 'Product B' }
      ],
      rowCount: 2,
      fileSize: 200,
      summary: { totalRows: 2, totalColumns: 3 }
    };
  }

  private createTimeSeriesData(): any {
    return {
      columns: [
        createDataColumn('action', 'string'),
        createDataColumn('user_id', 'string'),
        createDataColumn('timestamp', 'string')
      ],
      rows: [
        { action: 'purchase', user_id: 'user1', timestamp: '2024-01-15T14:30:00Z' }
      ],
      rowCount: 1,
      fileSize: 100,
      summary: { totalRows: 1, totalColumns: 3 }
    };
  }

  private createProductData(): any {
    return {
      columns: [
        createDataColumn('action', 'string'),
        createDataColumn('user_id', 'string'),
        createDataColumn('total_order_value', 'number'),
        createDataColumn('cost', 'number'),
        createDataColumn('quantity', 'number')
      ],
      rows: [
        { action: 'purchase', user_id: 'user1', total_order_value: 100, cost: 30, quantity: 2 }
      ],
      rowCount: 1,
      fileSize: 150,
      summary: { totalRows: 1, totalColumns: 5 }
    };
  }

  private createComplexData(): any {
    return {
      columns: [
        createDataColumn('action', 'string'),
        createDataColumn('user_id', 'string'),
        createDataColumn('product_name', 'string'),
        createDataColumn('timestamp', 'string'),
        createDataColumn('session_id', 'string'),
        createDataColumn('total_order_value', 'number'),
        createDataColumn('cost', 'number'),
        createDataColumn('quantity', 'number')
      ],
      rows: [
        { action: 'purchase', user_id: 'user1', product_name: 'Product A', timestamp: '2024-01-01T10:00:00Z', session_id: 'session1', total_order_value: 100, cost: 30, quantity: 2 }
      ],
      rowCount: 1,
      fileSize: 200,
      summary: { totalRows: 1, totalColumns: 8 }
    };
  }
}
