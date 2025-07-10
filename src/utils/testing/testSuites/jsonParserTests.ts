
import { TestSuite } from '../types';
import { TestRunner } from '../testRunner';

export class JSONParserTestSuite {
  private testRunner = new TestRunner();

  async run(): Promise<TestSuite> {
    const setupStart = performance.now();
    const setupTime = performance.now() - setupStart;

    const suiteStart = performance.now();
    const tests = [];

    tests.push(await this.testRunner.runTest('JSON parsing', (assert) => {
      const jsonText = '{"name": "John", "age": 25}';
      const parsed = JSON.parse(jsonText);
      assert.equal(parsed.name, 'John', 'Should parse name correctly');
      assert.equal(parsed.age, 25, 'Should parse age correctly');
    }));

    tests.push(await this.testRunner.runTest('JSON array parsing', (assert) => {
      const jsonText = '[{"id": 1}, {"id": 2}]';
      const parsed = JSON.parse(jsonText);
      assert.equal(Array.isArray(parsed), true, 'Should be an array');
      assert.equal(parsed.length, 2, 'Should have 2 items');
    }));

    const teardownStart = performance.now();
    const teardownTime = performance.now() - teardownStart;

    return {
      suiteName: 'JSON Parser Tests',
      tests,
      setupTime,
      teardownTime,
      totalDuration: performance.now() - suiteStart
    };
  }
}
