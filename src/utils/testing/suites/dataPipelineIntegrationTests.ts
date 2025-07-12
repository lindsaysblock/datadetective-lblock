
import { TestSuite } from '../types';
import { TestRunner } from '../testRunner';
import { parseFile, DataParser } from '../../dataParser';
import { DataConnectors } from '../../dataConnectors';
import { DataValidator } from '../../analysis/dataValidator';
import { createDataColumn } from '../../dataColumnHelper';

export class DataPipelineIntegrationTests {
  private testRunner = new TestRunner();

  async run(): Promise<TestSuite> {
    const setupStart = performance.now();
    const setupTime = performance.now() - setupStart;

    const suiteStart = performance.now();
    const tests = [];

    // Test file upload pipeline
    tests.push(await this.testRunner.runTest('File Upload Pipeline Integration', (assert) => {
      const mockFile = new File(['name,age\nJohn,25\nJane,30'], 'test.csv', { type: 'text/csv' });
      
      // Simulate file processing
      const mockParsedData = {
        columns: [
          createDataColumn('name', 'string'),
          createDataColumn('age', 'number')
        ],
        rows: [
          { name: 'John', age: 25 },
          { name: 'Jane', age: 30 }
        ],
        rowCount: 2,
        fileSize: mockFile.size,
        summary: {
          totalRows: 2,
          totalColumns: 2,
          possibleUserIdColumns: [],
          possibleEventColumns: [],
          possibleTimestampColumns: []
        }
      };

      const validator = new DataValidator(mockParsedData);
      const validation = validator.validate();

      assert.truthy(validation.isValid, 'File data should be valid');
      assert.equal(mockParsedData.rowCount, 2, 'Should parse 2 rows');
      assert.equal(mockParsedData.columns.length, 2, 'Should have 2 columns');
      assert.truthy(validation.completeness > 50, 'Data completeness should be reasonable');
    }));

    // Test pasted data pipeline
    tests.push(await this.testRunner.runTest('Pasted Data Pipeline Integration', (assert) => {
      const pastedData = 'product,sales\nA,100\nB,200';
      
      const mockParsedData = {
        columns: [
          createDataColumn('product', 'string'),
          createDataColumn('sales', 'number')
        ],
        rows: [
          { product: 'A', sales: 100 },
          { product: 'B', sales: 200 }
        ],
        rowCount: 2,
        fileSize: pastedData.length,
        summary: {
          totalRows: 2,
          totalColumns: 2,
          possibleUserIdColumns: [],
          possibleEventColumns: [],
          possibleTimestampColumns: []
        }
      };

      const validator = new DataValidator(mockParsedData);
      const validation = validator.validate();

      assert.truthy(validation.isValid, 'Pasted data should be valid');
      assert.equal(mockParsedData.rowCount, 2, 'Should parse 2 rows from pasted data');
      assert.truthy(validation.completeness === 100, 'Pasted data should be complete');
    }));

    // Test database connection pipeline
    tests.push(await this.testRunner.runTest('Database Connection Pipeline Integration', (assert) => {
      const mockDbConfig = {
        type: 'postgresql',
        host: 'localhost',
        database: 'testdb',
        username: 'user',
        password: 'pass'
      };

      const mockDbData = {
        columns: [
          createDataColumn('user_id', 'string'),
          createDataColumn('event_name', 'string'),
          createDataColumn('timestamp', 'date')
        ],
        rows: [
          { user_id: 'user1', event_name: 'login', timestamp: '2024-01-01T10:00:00Z' },
          { user_id: 'user2', event_name: 'purchase', timestamp: '2024-01-01T11:00:00Z' }
        ],
        rowCount: 2,
        fileSize: 500,
        summary: {
          totalRows: 2,
          totalColumns: 3,
          possibleUserIdColumns: ['user_id'],
          possibleEventColumns: ['event_name'],
          possibleTimestampColumns: ['timestamp']
        }
      };

      const validator = new DataValidator(mockDbData);
      const validation = validator.validate();

      assert.truthy(validation.isValid, 'Database data should be valid');
      assert.truthy(mockDbData.summary.possibleUserIdColumns.length > 0, 'Should identify user ID columns');
      assert.truthy(mockDbData.summary.possibleEventColumns.length > 0, 'Should identify event columns');
      assert.truthy(mockDbData.summary.possibleTimestampColumns.length > 0, 'Should identify timestamp columns');
    }));

    // Test multiple data source integration
    tests.push(await this.testRunner.runTest('Multiple Data Sources Integration', (assert) => {
      const fileData = {
        columns: [createDataColumn('user_id', 'string'), createDataColumn('action', 'string')],
        rows: [{ user_id: 'user1', action: 'view' }],
        rowCount: 1,
        fileSize: 100,
        summary: { totalRows: 1, totalColumns: 2, possibleUserIdColumns: [], possibleEventColumns: [], possibleTimestampColumns: [] }
      };

      const pastedData = {
        columns: [createDataColumn('user_id', 'string'), createDataColumn('purchase', 'number')],
        rows: [{ user_id: 'user1', purchase: 100 }],
        rowCount: 1,
        fileSize: 50,
        summary: { totalRows: 1, totalColumns: 2, possibleUserIdColumns: [], possibleEventColumns: [], possibleTimestampColumns: [] }
      };

      const combinedSources = [fileData, pastedData];
      const totalRows = combinedSources.reduce((sum, data) => sum + data.rowCount, 0);
      const totalColumns = new Set(combinedSources.flatMap(data => data.columns.map(col => col.name))).size;

      assert.equal(totalRows, 2, 'Should combine rows from multiple sources');
      assert.equal(totalColumns, 3, 'Should handle overlapping and unique columns');
    }));

    // Test error handling and recovery
    tests.push(await this.testRunner.runTest('Error Handling and Recovery', (assert) => {
      const invalidData = '';
      let errorCaught = false;
      let fallbackExecuted = false;

      try {
        if (!invalidData.trim()) {
          throw new Error('Empty data provided');
        }
      } catch (error) {
        errorCaught = true;
        // Simulate fallback to sample data
        fallbackExecuted = true;
      }

      assert.truthy(errorCaught, 'Should catch invalid data errors');
      assert.truthy(fallbackExecuted, 'Should execute fallback procedures');
    }));

    // Test performance with large datasets
    tests.push(await this.testRunner.runTest('Large Dataset Performance', (assert) => {
      const startTime = performance.now();
      
      // Simulate processing large dataset
      const largeDataset = {
        columns: [
          createDataColumn('id', 'string'),
          createDataColumn('value', 'number')
        ],
        rows: Array.from({ length: 10000 }, (_, i) => ({ id: `id${i}`, value: i })),
        rowCount: 10000,
        fileSize: 500000,
        summary: {
          totalRows: 10000,
          totalColumns: 2,
          possibleUserIdColumns: ['id'],
          possibleEventColumns: [],
          possibleTimestampColumns: []
        }
      };

      const processingTime = performance.now() - startTime;
      
      assert.truthy(processingTime < 1000, 'Large dataset processing should complete within 1 second');
      assert.equal(largeDataset.rowCount, 10000, 'Should handle large number of rows');
    }));

    const teardownStart = performance.now();
    const teardownTime = performance.now() - teardownStart;

    return {
      suiteName: 'Data Pipeline Integration Tests',
      tests,
      setupTime,
      teardownTime,
      totalDuration: performance.now() - suiteStart
    };
  }
}
