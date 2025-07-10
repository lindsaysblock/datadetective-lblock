
import { TestSuite } from '../types';
import { TestRunner } from '../testRunner';

export class DataParserTestSuite {
  private testRunner = new TestRunner();

  async run(): Promise<TestSuite> {
    const setupStart = performance.now();
    const setupTime = performance.now() - setupStart;

    const suiteStart = performance.now();
    const tests = [];

    tests.push(await this.testRunner.runTest('CSV parsing with valid data', (assert) => {
      const csvData = 'name,age,city\nJohn,25,NYC\nJane,30,LA';
      const lines = csvData.split('\n');
      assert.equal(lines.length, 3, 'Should parse 3 lines');
      assert.equal(lines[0], 'name,age,city', 'Header should be correct');
    }));

    tests.push(await this.testRunner.runTest('JSON parsing with valid data', (assert) => {
      const jsonData = '{"users": [{"name": "John", "age": 25}]}';
      const parsed = JSON.parse(jsonData);
      assert.truthy(parsed.users, 'Should have users array');
      assert.equal(parsed.users.length, 1, 'Should have one user');
    }));

    tests.push(await this.testRunner.runTest('Empty data handling', (assert) => {
      const emptyData = '';
      assert.falsy(emptyData, 'Empty string should be falsy');
    }));

    const teardownStart = performance.now();
    const teardownTime = performance.now() - teardownStart;

    return {
      suiteName: 'Data Parser Tests',
      tests,
      setupTime,
      teardownTime,
      totalDuration: performance.now() - suiteStart
    };
  }
}
