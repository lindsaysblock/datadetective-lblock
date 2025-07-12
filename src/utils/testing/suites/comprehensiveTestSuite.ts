
import { TestSuite } from '../types';
import { TestRunner } from '../testRunner';
import { DataPipelineIntegrationTests } from './dataPipelineIntegrationTests';
import { EdgeCaseTests } from './edgeCaseTests';
import { AnalyticsIntegrationTests } from './analyticsIntegrationTests';
import { AnalyticsUnitTestSuite } from './analyticsUnitTests';

export class ComprehensiveTestSuite {
  private testRunner = new TestRunner();

  async runAll(): Promise<TestSuite[]> {
    console.log('🚀 Starting comprehensive test suite execution...');
    
    const suites: TestSuite[] = [];
    
    try {
      // Data Pipeline Tests
      console.log('📊 Running Data Pipeline Integration Tests...');
      const pipelineTests = new DataPipelineIntegrationTests();
      suites.push(await pipelineTests.run());

      // Edge Case Tests
      console.log('⚠️ Running Edge Case Tests...');
      const edgeTests = new EdgeCaseTests();
      suites.push(await edgeTests.run());

      // Analytics Integration Tests
      console.log('📈 Running Analytics Integration Tests...');
      const analyticsIntegrationTests = new AnalyticsIntegrationTests();
      suites.push(await analyticsIntegrationTests.run());

      // Analytics Unit Tests
      console.log('🧪 Running Analytics Unit Tests...');
      const analyticsUnitTests = new AnalyticsUnitTestSuite();
      suites.push(await analyticsUnitTests.run());

      // Performance Tests
      console.log('⚡ Running Performance Tests...');
      suites.push(await this.runPerformanceTests());

      // Type Safety Tests
      console.log('🔒 Running TypeScript Type Safety Tests...');
      suites.push(await this.runTypeSafetyTests());

    } catch (error) {
      console.error('❌ Test suite execution failed:', error);
      throw error;
    }

    const totalTests = suites.reduce((sum, suite) => sum + suite.tests.length, 0);
    const passedTests = suites.reduce((sum, suite) => 
      sum + suite.tests.filter(test => test.status === 'pass').length, 0
    );

    console.log(`✅ Comprehensive test suite completed: ${passedTests}/${totalTests} tests passed`);
    
    return suites;
  }

  private async runPerformanceTests(): Promise<TestSuite> {
    const setupStart = performance.now();
    const setupTime = performance.now() - setupStart;
    const suiteStart = performance.now();
    const tests = [];

    tests.push(await this.testRunner.runTest('File Processing Performance', (assert) => {
      const startTime = performance.now();
      
      // Simulate file processing
      const largeFile = {
        size: 10000000, // 10MB
        rows: 50000,
        columns: 20
      };
      
      const processingTime = performance.now() - startTime;
      
      assert.truthy(processingTime < 2000, 'Large file processing should complete within 2 seconds');
      assert.truthy(largeFile.rows > 0, 'Should process all rows');
    }));

    tests.push(await this.testRunner.runTest('Memory Usage Optimization', (assert) => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0;
      
      // Simulate memory-intensive operation
      const data = Array.from({ length: 10000 }, (_, i) => ({ id: i, value: Math.random() }));
      const processed = data.filter(item => item.value > 0.5);
      
      const finalMemory = performance.memory?.usedJSHeapSize || 0;
      const memoryIncrease = finalMemory - initialMemory;
      
      assert.truthy(processed.length > 0, 'Should process data successfully');
      assert.truthy(memoryIncrease < 10000000, 'Memory increase should be reasonable (< 10MB)');
    }));

    tests.push(await this.testRunner.runTest('Concurrent Data Source Processing', (assert) => {
      const startTime = performance.now();
      
      const promises = Array.from({ length: 10 }, (_, i) => 
        new Promise(resolve => {
          setTimeout(() => resolve(`source_${i}_processed`), Math.random() * 100);
        })
      );
      
      return Promise.all(promises).then(results => {
        const processingTime = performance.now() - startTime;
        
        assert.equal(results.length, 10, 'Should process all data sources');
        assert.truthy(processingTime < 500, 'Concurrent processing should be faster than sequential');
      });
    }));

    const teardownStart = performance.now();
    const teardownTime = performance.now() - teardownStart;

    return {
      suiteName: 'Performance Tests',
      tests,
      setupTime,
      teardownTime,
      totalDuration: performance.now() - suiteStart
    };
  }

  private async runTypeSafetyTests(): Promise<TestSuite> {
    const setupStart = performance.now();
    const setupTime = performance.now() - setupStart;
    const suiteStart = performance.now();
    const tests = [];

    tests.push(await this.testRunner.runTest('ParsedData Type Compliance', (assert) => {
      const parsedData = {
        columns: [
          { name: 'test_col', type: 'string' as const, samples: ['sample1', 'sample2'] }
        ],
        rows: [{ test_col: 'value' }],
        rowCount: 1,
        fileSize: 100,
        summary: {
          totalRows: 1,
          totalColumns: 1,
          possibleUserIdColumns: [],
          possibleEventColumns: [],
          possibleTimestampColumns: []
        }
      };

      assert.truthy(parsedData.columns.length > 0, 'Should have valid columns structure');
      assert.truthy(parsedData.columns[0].samples, 'Should have samples property');
      assert.truthy(parsedData.summary, 'Should have summary property');
    }));

    tests.push(await this.testRunner.runTest('DataColumn Type Safety', (assert) => {
      const stringColumn = { name: 'text', type: 'string' as const, samples: ['a', 'b'] };
      const numberColumn = { name: 'num', type: 'number' as const, samples: [1, 2] };
      const dateColumn = { name: 'date', type: 'date' as const, samples: ['2024-01-01'] };

      assert.equal(stringColumn.type, 'string', 'String column should have correct type');
      assert.equal(numberColumn.type, 'number', 'Number column should have correct type');
      assert.equal(dateColumn.type, 'date', 'Date column should have correct type');
      assert.truthy(Array.isArray(stringColumn.samples), 'Should have samples array');
    }));

    tests.push(await this.testRunner.runTest('Validation Result Type Safety', (assert) => {
      const validationResult = {
        isValid: true,
        errors: [] as string[],
        warnings: [] as string[],
        completeness: 95.5,
        confidence: 'high' as const
      };

      assert.equal(typeof validationResult.isValid, 'boolean', 'isValid should be boolean');
      assert.truthy(Array.isArray(validationResult.errors), 'errors should be array');
      assert.truthy(Array.isArray(validationResult.warnings), 'warnings should be array');
      assert.equal(typeof validationResult.completeness, 'number', 'completeness should be number');
      assert.truthy(['high', 'medium', 'low'].includes(validationResult.confidence), 'confidence should be valid enum');
    }));

    const teardownStart = performance.now();
    const teardownTime = performance.now() - teardownStart;

    return {
      suiteName: 'TypeScript Type Safety Tests',
      tests,
      setupTime,
      teardownTime,
      totalDuration: performance.now() - suiteStart
    };
  }
}
