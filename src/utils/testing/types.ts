
export interface UnitTestResult {
  testName: string;
  status: 'pass' | 'fail' | 'skip' | 'warning';
  duration: number;
  error?: string;
  message?: string;
  assertions: number;
  passedAssertions: number;
  category?: string;
  executionTime?: number;
}

export interface TestResult {
  testName: string;
  status: 'pass' | 'fail' | 'skip' | 'warning';
  message: string;
  category?: string;
  executionTime?: number;
  performance?: number;
  suggestions?: string[];
  isDataRelated?: boolean;
}

export interface TestSuite {
  suiteName: string;
  tests: UnitTestResult[];
  setupTime: number;
  teardownTime: number;
  totalDuration: number;
}

export interface UnitTestReport {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  testResults: UnitTestResult[];
  overall: 'pass' | 'warning' | 'fail';
  timestamp?: Date;
  skippedTests?: number;
  testSuites?: TestSuite[];
  coverage?: {
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
