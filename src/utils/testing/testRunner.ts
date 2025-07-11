
export interface UnitTestResult {
  testName: string;
  status: 'pass' | 'fail' | 'skip' | 'warning';
  duration: number;
  error?: string;
  message?: string;
  assertions: number;
  passedAssertions: number;
}

export interface AssertionHelper {
  equal: (actual: any, expected: any, message?: string) => void;
  truthy: (value: any, message?: string) => void;
  falsy: (value: any, message?: string) => void;
}

export class TestRunner {
  async runTest(testName: string, testFunction: (assert: AssertionHelper) => void): Promise<UnitTestResult> {
    const startTime = performance.now();
    let assertions = 0;
    let passedAssertions = 0;
    let status: 'pass' | 'fail' | 'skip' | 'warning' = 'pass';
    let error: string | undefined;

    const assert: AssertionHelper = {
      equal: (actual: any, expected: any, message?: string) => {
        assertions++;
        if (actual === expected) {
          passedAssertions++;
        } else {
          status = 'fail';
          error = message || `Expected ${expected}, but got ${actual}`;
        }
      },
      truthy: (value: any, message?: string) => {
        assertions++;
        if (value) {
          passedAssertions++;
        } else {
          status = 'fail';
          error = message || `Expected truthy value, but got ${value}`;
        }
      },
      falsy: (value: any, message?: string) => {
        assertions++;
        if (!value) {
          passedAssertions++;
        } else {
          status = 'fail';
          error = message || `Expected falsy value, but got ${value}`;
        }
      }
    };

    try {
      testFunction(assert);
    } catch (err) {
      status = 'fail';
      error = err instanceof Error ? err.message : String(err);
    }

    const duration = performance.now() - startTime;

    return {
      testName,
      status,
      duration,
      error,
      assertions,
      passedAssertions
    };
  }
}
