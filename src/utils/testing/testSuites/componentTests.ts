
import { TestSuite } from '../types';
import { TestRunner } from '../testRunner';

export class ComponentTestSuite {
  private testRunner = new TestRunner();

  async run(): Promise<TestSuite> {
    const setupStart = performance.now();
    const setupTime = performance.now() - setupStart;

    const suiteStart = performance.now();
    const tests = [];

    tests.push(await this.testRunner.runTest('Component rendering', (assert) => {
      const element = document.createElement('div');
      element.innerHTML = '<button>Click me</button>';
      const button = element.querySelector('button');
      assert.truthy(button, 'Button should be rendered');
      assert.equal(button?.textContent, 'Click me', 'Button text should be correct');
    }));

    tests.push(await this.testRunner.runTest('Event handling', (assert) => {
      const button = document.createElement('button');
      let clicked = false;
      button.onclick = () => { clicked = true; };
      button.click();
      assert.truthy(clicked, 'Click event should be handled');
    }));

    tests.push(await this.testRunner.runTest('DOM manipulation', (assert) => {
      const container = document.createElement('div');
      const child = document.createElement('span');
      container.appendChild(child);
      assert.equal(container.children.length, 1, 'Should have one child');
    }));

    const teardownStart = performance.now();
    const teardownTime = performance.now() - teardownStart;

    return {
      suiteName: 'Component Tests',
      tests,
      setupTime,
      teardownTime,
      totalDuration: performance.now() - suiteStart
    };
  }
}
