
/**
 * Test execution and management system
 * Coordinates load testing and unit testing with QA suites
 */

import { LoadTestingSystem, type LoadTestConfig } from '../loadTesting';
import { UnitTestingSystem } from '../unitTesting';
import { QATestSuites } from './qaTestSuites';

/** Test runner configuration constants */
const TEST_RUNNER_CONFIG = {
  ERROR_RATES: {
    PASS_THRESHOLD: 5,
    WARNING_THRESHOLD: 15
  },
  MEMORY_THRESHOLDS: {
    PASS: 100,
    WARNING: 200
  },
  COVERAGE_THRESHOLDS: {
    PASS: 80,
    WARNING: 60
  },
  LOAD_CONFIGS: {
    RESEARCH_QUESTION: {
      concurrentUsers: 5,
      duration: 8,
      rampUpTime: 2,
      testType: 'research-question'
    },
    DATA_PROCESSING: {
      concurrentUsers: 8,
      duration: 12,
      rampUpTime: 3,
      testType: 'data-processing'
    },
    CONTEXT_PROCESSING: {
      concurrentUsers: 4,
      duration: 6,
      rampUpTime: 1,
      testType: 'context-processing'
    },
    UI_INTERACTION: {
      concurrentUsers: 12,
      duration: 15,
      rampUpTime: 4,
      testType: 'ui-interaction'
    }
  }
} as const;

/** Step display names for test output */
const STEP_NAMES = {
  'research-question': 'Step 1: Research Question',
  'data-processing': 'Step 2: Connect Your Data',
  'context-processing': 'Step 3: Additional Context',
  'ui-interaction': 'Step 4: Ready to Investigate'
} as const;

/**
 * Test execution manager
 * Coordinates load testing and unit testing execution
 */
export class TestRunner {
  private loadTestingSystem = new LoadTestingSystem();
  private unitTestingSystem = new UnitTestingSystem();
  private qaTestSuites?: QATestSuites;

  constructor(qaTestSuites?: QATestSuites) {
    this.qaTestSuites = qaTestSuites;
  }

  setQATestSuites(qaTestSuites: QATestSuites): void {
    this.qaTestSuites = qaTestSuites;
  }

  async runTest(testName: string, testFn: (assert: any) => void): Promise<any> {
    const startTime = performance.now();
    
    const assert = {
      truthy: (value: any, message: string) => {
        if (!value) throw new Error(message);
      },
      equal: (actual: any, expected: any, message: string) => {
        if (actual !== expected) throw new Error(`${message}: expected ${expected}, got ${actual}`);
      }
    };

    try {
      testFn(assert);
      const duration = performance.now() - startTime;
      
      return {
        name: testName,
        status: 'pass',
        duration,
        error: null
      };
    } catch (error) {
      const duration = performance.now() - startTime;
      
      return {
        name: testName,
        status: 'fail',
        duration,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async runLoadTests(): Promise<void> {
    if (!this.qaTestSuites) {
      console.error('QATestSuites not set for TestRunner');
      return;
    }

    console.log('🚀 Running optimized load testing suite...');
    
    const loadTestConfigs: LoadTestConfig[] = [
      TEST_RUNNER_CONFIG.LOAD_CONFIGS.RESEARCH_QUESTION,
      TEST_RUNNER_CONFIG.LOAD_CONFIGS.DATA_PROCESSING,
      TEST_RUNNER_CONFIG.LOAD_CONFIGS.CONTEXT_PROCESSING,
      TEST_RUNNER_CONFIG.LOAD_CONFIGS.UI_INTERACTION
    ];

    for (const config of loadTestConfigs) {
      try {
        const result = await this.loadTestingSystem.runLoadTest(config);
        const stepName = this.getStepDisplayName(config.testType);
        
        this.qaTestSuites.addTestResult({
          testName: `Load Test - ${stepName}`,
          status: result.errorRate < TEST_RUNNER_CONFIG.ERROR_RATES.PASS_THRESHOLD ? 'pass' : 
                  result.errorRate < TEST_RUNNER_CONFIG.ERROR_RATES.WARNING_THRESHOLD ? 'warning' : 'fail',
          message: `${stepName}: ${config.concurrentUsers} users, ${result.errorRate.toFixed(1)}% error rate, ${result.averageResponseTime.toFixed(0)}ms avg response`,
          performance: result.averageResponseTime,
          suggestions: result.errorRate > 10 ? [
            `Optimize ${stepName.toLowerCase()} component rendering`,
            `Review memory usage patterns in ${stepName.toLowerCase()}`
          ] : undefined
        });

        this.qaTestSuites.addTestResult({
          testName: `Memory Usage - ${stepName}`,
          status: result.memoryUsage.peak < TEST_RUNNER_CONFIG.MEMORY_THRESHOLDS.PASS ? 'pass' : 
                  result.memoryUsage.peak < TEST_RUNNER_CONFIG.MEMORY_THRESHOLDS.WARNING ? 'warning' : 'fail',
          message: `${stepName} - Peak memory: ${result.memoryUsage.peak.toFixed(1)}MB, Growth: ${(result.memoryUsage.final - result.memoryUsage.initial).toFixed(1)}MB`,
          suggestions: result.memoryUsage.peak > 150 ? [
            `Monitor for memory leaks in ${stepName.toLowerCase()}`,
            `Consider component cleanup for ${stepName.toLowerCase()}`
          ] : undefined
        });

      } catch (error) {
        const stepName = this.getStepDisplayName(config.testType);
        this.qaTestSuites.addTestResult({
          testName: `Load Test - ${stepName}`,
          status: 'fail',
          message: `${stepName} load test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }
  }

  async runUnitTests(): Promise<void> {
    if (!this.qaTestSuites) {
      console.error('QATestSuites not set for TestRunner');
      return;
    }

    console.log('🧪 Running optimized unit test suite...');
    
    try {
      const unitTestReport = await this.unitTestingSystem.runAllTests();
      
      this.qaTestSuites.addTestResult({
        testName: 'Unit Test Suite (All Steps)',
        status: unitTestReport.failedTests === 0 ? 'pass' : unitTestReport.failedTests < 3 ? 'warning' : 'fail',
        message: `${unitTestReport.passedTests}/${unitTestReport.totalTests} tests passed, ${unitTestReport.failedTests} failed across 4-step flow`,
        suggestions: unitTestReport.failedTests > 0 ? [
          'Review failed unit tests and fix underlying step-specific issues',
          'Ensure all critical step functionality is covered by tests',
          'Add integration tests for step transitions'
        ] : undefined
      });

      // Check if coverage exists before accessing it
      if (unitTestReport.coverage) {
        const avgCoverage = (
          unitTestReport.coverage.statements + 
          unitTestReport.coverage.branches + 
          unitTestReport.coverage.functions + 
          unitTestReport.coverage.lines
        ) / 4;

        this.qaTestSuites.addTestResult({
          testName: 'Code Coverage (Step-Aware)',
          status: avgCoverage > TEST_RUNNER_CONFIG.COVERAGE_THRESHOLDS.PASS ? 'pass' : 
                  avgCoverage > TEST_RUNNER_CONFIG.COVERAGE_THRESHOLDS.WARNING ? 'warning' : 'fail',
          message: `${avgCoverage.toFixed(1)}% average coverage across step components (Statements: ${unitTestReport.coverage.statements.toFixed(1)}%, Functions: ${unitTestReport.coverage.functions.toFixed(1)}%)`,
          suggestions: avgCoverage < 70 ? [
            'Increase test coverage for critical step functions',
            'Add integration tests for step-to-step workflows',
            'Cover edge cases in step validation logic'
          ] : undefined
        });
      }

      // Check if testSuites exists before accessing it
      if (unitTestReport.testSuites) {
        unitTestReport.testSuites.forEach(suite => {
          const failedTests = suite.tests.filter(test => test.status === 'fail').length;
          this.qaTestSuites!.addTestResult({
            testName: `${suite.suiteName} Suite`,
            status: failedTests === 0 ? 'pass' : failedTests < 2 ? 'warning' : 'fail',
            message: `${suite.tests.length - failedTests}/${suite.tests.length} tests passed in ${suite.totalDuration.toFixed(0)}ms`
          });
        });
      }

    } catch (error) {
      this.qaTestSuites.addTestResult({
        testName: 'Unit Test Suite (All Steps)',
        status: 'fail',
        message: `Unit test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  private getStepDisplayName(testType: string): string {
    return STEP_NAMES[testType as keyof typeof STEP_NAMES] || testType;
  }
}
