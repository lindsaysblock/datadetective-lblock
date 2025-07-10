
import { TestSuite } from '../types';
import { TestRunner } from '../testRunner';

export class UtilityTestSuite {
  private testRunner = new TestRunner();

  async run(): Promise<TestSuite> {
    const setupStart = performance.now();
    const setupTime = performance.now() - setupStart;

    const suiteStart = performance.now();
    const tests = [];

    tests.push(await this.testRunner.runTest('String utilities', (assert) => {
      const text = 'Hello World';
      assert.equal(text.toLowerCase(), 'hello world', 'Should convert to lowercase');
      assert.equal(text.length, 11, 'Should have correct length');
    }));

    tests.push(await this.testRunner.runTest('Array utilities', (assert) => {
      const arr = [1, 2, 3, 4, 5];
      const filtered = arr.filter(x => x > 3);
      assert.equal(filtered.length, 2, 'Should filter correctly');
      assert.equal(filtered[0], 4, 'First filtered item should be 4');
    }));

    tests.push(await this.testRunner.runTest('Date utilities', (assert) => {
      const now = new Date();
      const timestamp = now.getTime();
      assert.truthy(timestamp, 'Timestamp should be truthy');
      assert.equal(typeof timestamp, 'number', 'Timestamp should be a number');
    }));

    const teardownStart = performance.now();
    const teardownTime = performance.now() - teardownStart;

    return {
      suiteName: 'Utility Function Tests',
      tests,
      setupTime,
      teardownTime,
      totalDuration: performance.now() - suiteStart
    };
  }
}
