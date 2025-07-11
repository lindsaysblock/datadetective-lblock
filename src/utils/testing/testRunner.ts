
import { TestResult, TestSuite, UnitTestResult } from './types';
import { AnalyticsUnitTestSuite } from './suites/analyticsUnitTests';
import { AnalyticsIntegrationTestSuite } from './suites/analyticsIntegrationTests';

export class TestRunner {
  private readonly enableLogging: boolean;

  constructor(enableLogging = true) {
    this.enableLogging = enableLogging;
  }

  async runAllTests(): Promise<TestSuite[]> {
    const testSuites: TestSuite[] = [];
    
    if (this.enableLogging) {
      console.log('🧪 Running comprehensive analytics test suite...');
    }

    try {
      // Run unit tests
      const unitTests = new AnalyticsUnitTestSuite();
      const unitResults = await unitTests.runTests();
      testSuites.push({
        suiteName: 'Analytics Unit Tests',
        tests: this.convertTestResultsToUnitTestResults(unitResults),
        setupTime: 0,
        teardownTime: 0,
        totalDuration: unitResults.reduce((sum, test) => sum + (test.executionTime || 0), 0)
      });

      // Run integration tests
      const integrationTests = new AnalyticsIntegrationTestSuite();
      const integrationResults = await integrationTests.runTests();
      testSuites.push({
        suiteName: 'Analytics Integration Tests',
        tests: this.convertTestResultsToUnitTestResults(integrationResults),
        setupTime: 0,
        teardownTime: 0,
        totalDuration: integrationResults.reduce((sum, test) => sum + (test.executionTime || 0), 0)
      });

      if (this.enableLogging) {
        this.logTestSummary(testSuites);
      }

    } catch (error) {
      console.error('❌ Test suite execution failed:', error);
      testSuites.push({
        suiteName: 'Test Execution Error',
        tests: [{
          testName: 'Test Suite Execution',
          status: 'fail',
          duration: 0,
          error: `Test execution failed: ${error}`,
          assertions: 0,
          passedAssertions: 0,
          message: `Test execution failed: ${error}`,
          category: 'system'
        }],
        setupTime: 0,
        teardownTime: 0,
        totalDuration: 0
      });
    }

    return testSuites;
  }

  private convertTestResultsToUnitTestResults(testResults: TestResult[]): UnitTestResult[] {
    return testResults.map(result => ({
      testName: result.testName,
      status: result.status,
      duration: result.executionTime || 0,
      error: result.status === 'fail' ? result.message : undefined,
      assertions: 1,
      passedAssertions: result.status === 'pass' ? 1 : 0,
      message: result.message,
      category: result.category,
      executionTime: result.executionTime
    }));
  }

  async runTest<T>(name: string, testFn: (assert: AssertFunctions) => T): Promise<TestResult> {
    const startTime = performance.now();
    
    try {
      const assert = this.createAssertFunctions();
      await testFn(assert);
      
      return {
        testName: name,
        status: 'pass',
        message: 'Test passed',
        category: 'unit',
        executionTime: performance.now() - startTime
      };
    } catch (error) {
      return {
        testName: name,
        status: 'fail',
        message: error instanceof Error ? error.message : String(error),
        category: 'unit',
        executionTime: performance.now() - startTime
      };
    }
  }

  private createAssertFunctions(): AssertFunctions {
    return {
      equal: (actual: any, expected: any, message?: string) => {
        if (actual !== expected) {
          throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
      },
      truthy: (value: any, message?: string) => {
        if (!value) {
          throw new Error(message || `Expected truthy value, got ${value}`);
        }
      },
      falsy: (value: any, message?: string) => {
        if (value) {
          throw new Error(message || `Expected falsy value, got ${value}`);
        }
      },
      throws: (fn: () => any, message?: string) => {
        try {
          fn();
          throw new Error(message || 'Expected function to throw');
        } catch (error) {
          // Expected behavior
        }
      }
    };
  }

  private logTestSummary(testSuites: TestSuite[]): void {
    const totalTests = testSuites.reduce((sum, suite) => sum + suite.tests.length, 0);
    const passedTests = testSuites.reduce((sum, suite) => 
      sum + suite.tests.filter(test => test.status === 'pass').length, 0
    );
    const failedTests = testSuites.reduce((sum, suite) => 
      sum + suite.tests.filter(test => test.status === 'fail').length, 0
    );
    const warningTests = testSuites.reduce((sum, suite) => 
      sum + suite.tests.filter(test => test.status === 'warning').length, 0
    );

    console.log(`\n📊 Test Summary:`);
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(`⚠️ Warnings: ${warningTests}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

    testSuites.forEach(suite => {
      console.log(`\n📋 ${suite.suiteName}:`);
      console.log(`  Duration: ${suite.totalDuration.toFixed(0)}ms`);
      console.log(`  Tests: ${suite.tests.length}`);
      
      const suitePassed = suite.tests.filter(t => t.status === 'pass').length;
      const suiteFailed = suite.tests.filter(t => t.status === 'fail').length;
      console.log(`  Passed: ${suitePassed}, Failed: ${suiteFailed}`);
    });
  }
}

interface AssertFunctions {
  equal: (actual: any, expected: any, message?: string) => void;
  truthy: (value: any, message?: string) => void;
  falsy: (value: any, message?: string) => void;
  throws: (fn: () => any, message?: string) => void;
}
