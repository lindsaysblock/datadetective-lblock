
import { TestSuite, TestResult } from '../types';
import { TestRunner } from '../testRunner';
import { ParsedData } from '../../dataParser';
import { AnalyticsValidator } from '../../analytics/analyticsValidator';

export class CoreAnalyticsTestSuite {
  private testRunner = new TestRunner();

  async run(): Promise<TestSuite> {
    const suiteStart = performance.now();
    const tests: TestResult[] = [];

    // Core validation tests
    tests.push(await this.testRunner.runTest('Data validation logic', (assert) => {
      const validData = this.createValidTestData();
      const invalidData = this.createInvalidTestData();
      
      assert.truthy(AnalyticsValidator.validateParsedData(validData), 'Valid data should pass validation');
      assert.falsy(AnalyticsValidator.validateParsedData(invalidData), 'Invalid data should fail validation');
    }));

    tests.push(await this.testRunner.runTest('Data quality calculation', (assert) => {
      const highQualityData = this.createHighQualityData();
      const lowQualityData = this.createLowQualityData();
      
      const highQuality = AnalyticsValidator.calculateDataQuality(highQualityData);
      const lowQuality = AnalyticsValidator.calculateDataQuality(lowQualityData);
      
      assert.equal(highQuality, 'high', 'High quality data should be rated as high');
      assert.equal(lowQuality, 'low', 'Low quality data should be rated as low');
    }));

    tests.push(await this.testRunner.runTest('Result sanitization', (assert) => {
      const mixedResults = this.createMixedQualityResults();
      const sanitized = AnalyticsValidator.sanitizeResults(mixedResults);
      
      assert.truthy(sanitized.length < mixedResults.length, 'Invalid results should be filtered out');
      assert.truthy(sanitized.every(r => AnalyticsValidator.validateAnalysisResult(r)), 'All sanitized results should be valid');
    }));

    return {
      suiteName: 'Core Analytics Tests',
      tests,
      setupTime: 0,
      teardownTime: 0,
      totalDuration: performance.now() - suiteStart
    };
  }

  private createValidTestData(): ParsedData {
    return {
      columns: [
        { name: 'id', type: 'string' },
        { name: 'value', type: 'number' }
      ],
      rows: [
        { id: '1', value: 100 },
        { id: '2', value: 200 }
      ],
      rowCount: 2,
      fileSize: 100,
      summary: { totalRows: 2, totalColumns: 2 }
    };
  }

  private createInvalidTestData(): ParsedData {
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      fileSize: 0,
      summary: { totalRows: 0, totalColumns: 0 }
    };
  }

  private createHighQualityData(): ParsedData {
    return {
      columns: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'value', type: 'number' }
      ],
      rows: [
        { id: '1', name: 'Item 1', value: 100 },
        { id: '2', name: 'Item 2', value: 200 },
        { id: '3', name: 'Item 3', value: 300 }
      ],
      rowCount: 3,
      fileSize: 200,
      summary: { totalRows: 3, totalColumns: 3 }
    };
  }

  private createLowQualityData(): ParsedData {
    return {
      columns: [
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'value', type: 'number' }
      ],
      rows: [
        { id: '1', name: null, value: null },
        { id: null, name: '', value: undefined },
        { id: '3', name: 'Item 3', value: 300 }
      ],
      rowCount: 3,
      fileSize: 150,
      summary: { totalRows: 3, totalColumns: 3 }
    };
  }

  private createMixedQualityResults() {
    return [
      {
        id: 'valid-result',
        title: 'Valid Result',
        description: 'A valid analysis result',
        value: 100,
        insight: 'This is a valid insight',
        confidence: 'high' as const
      },
      {
        id: 'invalid-result',
        title: '',
        description: '',
        value: 0,
        insight: '',
        confidence: 'invalid' as any
      },
      {
        id: 'another-valid',
        title: 'Another Valid',
        description: 'Another valid result',
        value: 50,
        insight: 'Another insight',
        confidence: 'medium' as const
      }
    ];
  }
}
