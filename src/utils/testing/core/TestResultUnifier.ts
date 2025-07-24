/**
 * Unified test result types and utilities to eliminate duplication across testing modules
 */

export type TestStatus = 'pass' | 'fail' | 'skip' | 'warning';

export interface BaseTestResult {
  testName: string;
  status: TestStatus;
  duration: number;
  timestamp: Date;
  error?: string;
  message?: string;
  category?: string;
}

export interface UnitTestResult extends BaseTestResult {
  assertions: number;
  passedAssertions: number;
  executionTime?: number;
}

export interface LoadTestResult extends BaseTestResult {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  errorRate: number;
  throughput: number;
  memoryUsage: {
    initial: number;
    peak: number;
    final: number;
  };
}

export interface E2ETestResult extends BaseTestResult {
  success?: boolean;
  details?: any;
  optimizations?: string[];
}

// Legacy compatibility interface
export interface TestResult extends BaseTestResult {
  performance?: number;
  suggestions?: string[];
  isDataRelated?: boolean;
}

export interface TestSuite {
  suiteName: string;
  tests: BaseTestResult[];
  setupTime: number;
  teardownTime: number;
  totalDuration: number;
  coverage?: TestCoverage;
}

export interface TestCoverage {
  statements: number;
  branches: number;
  functions: number;
  lines: number;
}

export interface TestReport {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  warningTests: number;
  overall: TestStatus;
  timestamp: Date;
  duration: number;
  testSuites: TestSuite[];
  coverage?: TestCoverage;
  testResults?: BaseTestResult[]; // For compatibility
}

// Legacy compatibility interface
export interface UnitTestReport extends TestReport {}

export class TestResultUnifier {
  static createUnitTestResult(
    testName: string,
    status: TestStatus,
    duration: number,
    assertions: number = 1,
    passedAssertions: number = 1,
    error?: string,
    message?: string
  ): UnitTestResult {
    return {
      testName,
      status,
      duration,
      timestamp: new Date(),
      assertions,
      passedAssertions,
      error,
      message,
      category: 'unit'
    };
  }

  static createE2ETestResult(
    testName: string,
    status: TestStatus,
    duration: number,
    success?: boolean,
    details?: any,
    error?: string
  ): E2ETestResult {
    return {
      testName,
      status,
      duration,
      timestamp: new Date(),
      success,
      details,
      error,
      category: 'e2e'
    };
  }

  static calculateTestSuiteMetrics(tests: BaseTestResult[]): {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    warnings: number;
    overall: TestStatus;
    totalDuration: number;
  } {
    const total = tests.length;
    const passed = tests.filter(t => t.status === 'pass').length;
    const failed = tests.filter(t => t.status === 'fail').length;
    const skipped = tests.filter(t => t.status === 'skip').length;
    const warnings = tests.filter(t => t.status === 'warning').length;
    const totalDuration = tests.reduce((sum, test) => sum + test.duration, 0);

    let overall: TestStatus = 'pass';
    if (failed > 0) overall = 'fail';
    else if (warnings > 0) overall = 'warning';
    else if (skipped > 0 && passed === 0) overall = 'skip';

    return { total, passed, failed, skipped, warnings, overall, totalDuration };
  }

  static generateTestReport(testSuites: TestSuite[]): TestReport {
    const allTests = testSuites.flatMap(suite => suite.tests);
    const metrics = this.calculateTestSuiteMetrics(allTests);
    
    return {
      totalTests: metrics.total,
      passedTests: metrics.passed,
      failedTests: metrics.failed,
      skippedTests: metrics.skipped,
      warningTests: metrics.warnings,
      overall: metrics.overall,
      timestamp: new Date(),
      duration: metrics.totalDuration,
      testSuites,
      coverage: this.aggregateCoverage(testSuites)
    };
  }

  private static aggregateCoverage(testSuites: TestSuite[]): TestCoverage | undefined {
    const coverages = testSuites.map(suite => suite.coverage).filter(Boolean);
    if (coverages.length === 0) return undefined;

    return {
      statements: Math.round(coverages.reduce((sum, c) => sum + c!.statements, 0) / coverages.length),
      branches: Math.round(coverages.reduce((sum, c) => sum + c!.branches, 0) / coverages.length),
      functions: Math.round(coverages.reduce((sum, c) => sum + c!.functions, 0) / coverages.length),
      lines: Math.round(coverages.reduce((sum, c) => sum + c!.lines, 0) / coverages.length)
    };
  }
}