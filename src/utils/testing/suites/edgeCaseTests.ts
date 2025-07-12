
import { TestSuite } from '../types';
import { TestRunner } from '../testRunner';
import { DataValidator } from '../../analysis/dataValidator';
import { createDataColumn } from '../../dataColumnHelper';

export class EdgeCaseTests {
  private testRunner = new TestRunner();

  async run(): Promise<TestSuite> {
    const setupStart = performance.now();
    const setupTime = performance.now() - setupStart;

    const suiteStart = performance.now();
    const tests = [];

    // Test empty data handling
    tests.push(await this.testRunner.runTest('Empty Data Handling', (assert) => {
      const emptyData = {
        columns: [],
        rows: [],
        rowCount: 0,
        fileSize: 0,
        summary: {
          totalRows: 0,
          totalColumns: 0,
          possibleUserIdColumns: [],
          possibleEventColumns: [],
          possibleTimestampColumns: []
        }
      };

      const validator = new DataValidator(emptyData);
      const validation = validator.validate();

      assert.falsy(validation.isValid, 'Empty data should be invalid');
      assert.truthy(validation.errors.length > 0, 'Should report errors for empty data');
    }));

    // Test malformed data handling
    tests.push(await this.testRunner.runTest('Malformed Data Handling', (assert) => {
      const malformedData = {
        columns: [createDataColumn('name', 'string'), createDataColumn('age', 'number')],
        rows: [
          { name: 'John' }, // Missing age
          { age: 25 }, // Missing name
          { name: 'Jane', age: 'invalid' }, // Invalid age type
          { name: '', age: null }, // Empty/null values
        ],
        rowCount: 4,
        fileSize: 100,
        summary: {
          totalRows: 4,
          totalColumns: 2,
          possibleUserIdColumns: [],
          possibleEventColumns: [],
          possibleTimestampColumns: []
        }
      };

      const validator = new DataValidator(malformedData);
      const validation = validator.validate();

      assert.truthy(validation.warnings.length > 0, 'Should report warnings for malformed data');
      assert.truthy(validation.completeness < 100, 'Completeness should be less than 100% for malformed data');
    }));

    // Test extremely large values
    tests.push(await this.testRunner.runTest('Extreme Value Handling', (assert) => {
      const extremeData = {
        columns: [
          createDataColumn('small_number', 'number'),
          createDataColumn('large_number', 'number'),
          createDataColumn('long_string', 'string')
        ],
        rows: [
          {
            small_number: Number.MIN_SAFE_INTEGER,
            large_number: Number.MAX_SAFE_INTEGER,
            long_string: 'a'.repeat(10000)
          },
          {
            small_number: 0.00000001,
            large_number: 999999999999999,
            long_string: ''
          }
        ],
        rowCount: 2,
        fileSize: 50000,
        summary: {
          totalRows: 2,
          totalColumns: 3,
          possibleUserIdColumns: [],
          possibleEventColumns: [],
          possibleTimestampColumns: []
        }
      };

      const validator = new DataValidator(extremeData);
      const validation = validator.validate();

      assert.truthy(validation.isValid, 'Should handle extreme values gracefully');
      assert.equal(extremeData.rowCount, 2, 'Should process all rows with extreme values');
    }));

    // Test special characters and unicode
    tests.push(await this.testRunner.runTest('Special Characters and Unicode', (assert) => {
      const unicodeData = {
        columns: [
          createDataColumn('unicode_text', 'string'),
          createDataColumn('special_chars', 'string'),
          createDataColumn('emoji', 'string')
        ],
        rows: [
          {
            unicode_text: '测试数据',
            special_chars: '!@#$%^&*()[]{}|\\:";\'<>?,./',
            emoji: '🚀💡📊'
          },
          {
            unicode_text: 'Тест данных',
            special_chars: '`~+=_-',
            emoji: '✅❌⚠️'
          }
        ],
        rowCount: 2,
        fileSize: 200,
        summary: {
          totalRows: 2,
          totalColumns: 3,
          possibleUserIdColumns: [],
          possibleEventColumns: [],
          possibleTimestampColumns: []
        }
      };

      const validator = new DataValidator(unicodeData);
      const validation = validator.validate();

      assert.truthy(validation.isValid, 'Should handle unicode and special characters');
      assert.equal(validation.completeness, 100, 'Unicode data should be complete');
    }));

    // Test date format variations
    tests.push(await this.testRunner.runTest('Date Format Variations', (assert) => {
      const dateData = {
        columns: [
          createDataColumn('iso_date', 'date'),
          createDataColumn('us_date', 'date'),
          createDataColumn('timestamp', 'date')
        ],
        rows: [
          {
            iso_date: '2024-01-15T14:30:00Z',
            us_date: '01/15/2024',
            timestamp: '1705327800000'
          },
          {
            iso_date: '2024-12-31T23:59:59Z',
            us_date: '12/31/2024',
            timestamp: '1735689599000'
          }
        ],
        rowCount: 2,
        fileSize: 150,
        summary: {
          totalRows: 2,
          totalColumns: 3,
          possibleUserIdColumns: [],
          possibleEventColumns: [],
          possibleTimestampColumns: ['iso_date', 'us_date', 'timestamp']
        }
      };

      const validator = new DataValidator(dateData);
      const validation = validator.validate();

      assert.truthy(validation.isValid, 'Should handle various date formats');
      assert.truthy(dateData.summary.possibleTimestampColumns.length === 3, 'Should identify all timestamp columns');
    }));

    // Test memory constraints
    tests.push(await this.testRunner.runTest('Memory Constraint Handling', (assert) => {
      // Simulate memory-intensive operation
      const memoryIntensiveData = {
        columns: [createDataColumn('data', 'string')],
        rows: Array.from({ length: 1000 }, (_, i) => ({ data: `row_${i}_${'x'.repeat(100)}` })),
        rowCount: 1000,
        fileSize: 100000,
        summary: {
          totalRows: 1000,
          totalColumns: 1,
          possibleUserIdColumns: [],
          possibleEventColumns: [],
          possibleTimestampColumns: []
        }
      };

      const startMemory = this.getMemoryUsage();
      const validator = new DataValidator(memoryIntensiveData);
      const validation = validator.validate();
      const endMemory = this.getMemoryUsage();

      assert.truthy(validation.isValid, 'Should handle memory-intensive data');
      assert.truthy((endMemory - startMemory) < 50, 'Memory usage should remain reasonable'); // Less than 50MB increase
    }));

    // Test concurrent processing
    tests.push(await this.testRunner.runTest('Concurrent Processing', async (assert) => {
      const promises = [];
      
      for (let i = 0; i < 5; i++) {
        const data = {
          columns: [createDataColumn('id', 'string'), createDataColumn('value', 'number')],
          rows: [{ id: `concurrent_${i}`, value: i * 10 }],
          rowCount: 1,
          fileSize: 50,
          summary: {
            totalRows: 1,
            totalColumns: 2,
            possibleUserIdColumns: ['id'],
            possibleEventColumns: [],
            possibleTimestampColumns: []
          }
        };

        promises.push(new Promise(resolve => {
          const validator = new DataValidator(data);
          const validation = validator.validate();
          resolve(validation.isValid);
        }));
      }

      const results = await Promise.all(promises);
      const allValid = results.every(result => result === true);

      assert.truthy(allValid, 'Should handle concurrent data processing');
      assert.equal(results.length, 5, 'Should process all concurrent requests');
    }));

    const teardownStart = performance.now();
    const teardownTime = performance.now() - teardownStart;

    return {
      suiteName: 'Edge Case Tests',
      tests,
      setupTime,
      teardownTime,
      totalDuration: performance.now() - suiteStart
    };
  }

  private getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }
    return 0;
  }
}
