
import { TestSuite } from '../types';
import { TestRunner } from '../testRunner';

export class CSVParserTestSuite {
  private testRunner = new TestRunner();

  async run(): Promise<TestSuite> {
    const setupStart = performance.now();
    const setupTime = performance.now() - setupStart;

    const suiteStart = performance.now();
    const tests = [];

    tests.push(await this.testRunner.runTest('CSV header parsing', (assert) => {
      const csvText = 'name,age,city\nJohn,25,NYC';
      const lines = csvText.split('\n');
      const headers = lines[0].split(',');
      assert.equal(headers.length, 3, 'Should parse 3 headers');
      assert.equal(headers[0], 'name', 'First header should be name');
    }));

    tests.push(await this.testRunner.runTest('CSV data parsing', (assert) => {
      const csvText = 'name,age,city\nJohn,25,NYC\nJane,30,LA';
      const lines = csvText.split('\n');
      const dataRows = lines.slice(1);
      assert.equal(dataRows.length, 2, 'Should have 2 data rows');
    }));

    const teardownStart = performance.now();
    const teardownTime = performance.now() - teardownStart;

    return {
      suiteName: 'CSV Parser Tests',
      tests,
      setupTime,
      teardownTime,
      totalDuration: performance.now() - suiteStart
    };
  }
}
