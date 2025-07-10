
export interface UnitTestResult {
  testName: string;
  status: 'pass' | 'fail' | 'skip';
  duration: number;
  error?: string;
  assertions: number;
  passedAssertions: number;
}

export interface TestSuite {
  suiteName: string;
  tests: UnitTestResult[];
  setupTime: number;
  teardownTime: number;
  totalDuration: number;
}

export interface UnitTestReport {
  timestamp: Date;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  testSuites: TestSuite[];
  coverage: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
}

export interface AssertionHelper {
  equal: (actual: any, expected: any, message?: string) => void;
  truthy: (value: any, message?: string) => void;
  falsy: (value: any, message?: string) => void;
}
