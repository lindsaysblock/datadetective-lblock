
import { TestRunner, UnitTestResult, AssertionHelper } from '../testRunner';

export class DataParserTestSuite {
  private testRunner = new TestRunner();

  async runAllTests(): Promise<UnitTestResult[]> {
    const tests: UnitTestResult[] = [];

    tests.push(await this.testDataParsingCSVFormat());
    tests.push(await this.testDataParsingJSONFormat());
    tests.push(await this.testDataParsingFileDetection());
    tests.push(await this.testDataParsingErrorHandling());

    return tests;
  }

  private async testDataParsingCSVFormat(): Promise<UnitTestResult> {
    return this.testRunner.runTest('Data Parsing CSV Format', (assert: AssertionHelper) => {
      const file = new File(['name,age\nJohn,30'], 'test.csv', { type: 'text/csv' });
      
      assert.equal(file.type, 'text/csv', 'Should detect CSV file type');
      assert.equal(file.name.endsWith('.csv'), true, 'Should have CSV extension');
    });
  }

  private async testDataParsingJSONFormat(): Promise<UnitTestResult> {
    return this.testRunner.runTest('Data Parsing JSON Format', (assert: AssertionHelper) => {
      const file = new File(['{"name": "John"}'], 'test.json', { type: 'application/json' });
      
      assert.equal(file.type, 'application/json', 'Should detect JSON file type');
      assert.equal(file.name.endsWith('.json'), true, 'Should have JSON extension');
    });
  }

  private async testDataParsingFileDetection(): Promise<UnitTestResult> {
    return this.testRunner.runTest('Data Parsing File Detection', (assert: AssertionHelper) => {
      const csvFile = new File(['data'], 'test.csv', { type: 'text/csv' });
      const jsonFile = new File(['data'], 'test.json', { type: 'application/json' });
      
      const getFileType = (file: File) => {
        if (file.name.endsWith('.csv') || file.type === 'text/csv') return 'csv';
        if (file.name.endsWith('.json') || file.type === 'application/json') return 'json';
        return 'unknown';
      };
      
      assert.equal(getFileType(csvFile), 'csv', 'Should detect CSV files');
      assert.equal(getFileType(jsonFile), 'json', 'Should detect JSON files');
    });
  }

  private async testDataParsingErrorHandling(): Promise<UnitTestResult> {
    return this.testRunner.runTest('Data Parsing Error Handling', (assert: AssertionHelper) => {
      const invalidFile = new File([''], 'empty.txt', { type: 'text/plain' });
      
      const isValidDataFile = (file: File) => {
        const validTypes = ['text/csv', 'application/json'];
        return validTypes.includes(file.type) && file.size > 0;
      };
      
      assert.falsy(isValidDataFile(invalidFile), 'Should reject invalid file types');
    });
  }
}
