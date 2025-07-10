
import { UnitTestResult, AssertionHelper } from './types';

export class TestRunner {
  async runTest(testName: string, testFn: (assert: AssertionHelper) => void | Promise<void>): Promise<UnitTestResult> {
    const startTime = performance.now();
    let assertions = 0;
    let passedAssertions = 0;

    const assert: AssertionHelper = {
      equal: (actual: any, expected: any, message?: string) => {
        assertions++;
        if (actual === expected) {
          passedAssertions++;
        } else {
          throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
      },
      truthy: (value: any, message?: string) => {
        assertions++;
        if (value) {
          passedAssertions++;
        } else {
          throw new Error(message || `Expected truthy value, got ${value}`);
        }
      },
      falsy: (value: any, message?: string) => {
        assertions++;
        if (!value) {
          passedAssertions++;
        } else {
          throw new Error(message || `Expected falsy value, got ${value}`);
        }
      }
    };

    try {
      await testFn(assert);
      
      return {
        testName,
        status: 'pass',
        duration: performance.now() - startTime,
        assertions,
        passedAssertions
      };
    } catch (error) {
      return {
        testName,
        status: 'fail',
        duration: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        assertions,
        passedAssertions
      };
    }
  }
}
