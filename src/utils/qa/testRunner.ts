
import { LoadTestingSystem, type LoadTestConfig } from '../loadTesting';
import { UnitTestingSystem } from '../unitTesting';
import { QATestSuites } from './qaTestSuites';

export class TestRunner {
  private loadTestingSystem = new LoadTestingSystem();
  private unitTestingSystem = new UnitTestingSystem();
  private qaTestSuites: QATestSuites;

  constructor(qaTestSuites: QATestSuites) {
    this.qaTestSuites = qaTestSuites;
  }

  async runLoadTests(): Promise<void> {
    console.log('🚀 Running load testing suite with updated step order...');
    
    const loadTestConfigs: LoadTestConfig[] = [
      // Step 1: Research Question - Light load
      {
        concurrentUsers: 5,
        duration: 8,
        rampUpTime: 2,
        testType: 'research-question'
      },
      // Step 2: Connect Your Data - Medium load
      {
        concurrentUsers: 8,
        duration: 12,
        rampUpTime: 3,
        testType: 'data-processing'
      },
      // Step 3: Additional Context - Light load (optional step)
      {
        concurrentUsers: 4,
        duration: 6,
        rampUpTime: 1,
        testType: 'context-processing'
      },
      // Step 4: Ready to Investigate - Heavy load
      {
        concurrentUsers: 12,
        duration: 15,
        rampUpTime: 4,
        testType: 'ui-interaction'
      }
    ];

    for (const config of loadTestConfigs) {
      try {
        const result = await this.loadTestingSystem.runLoadTest(config);
        const stepName = this.getStepDisplayName(config.testType);
        
        this.qaTestSuites.addTestResult({
          testName: `Load Test - ${stepName}`,
          status: result.errorRate < 5 ? 'pass' : result.errorRate < 15 ? 'warning' : 'fail',
          message: `${stepName}: ${config.concurrentUsers} users, ${result.errorRate.toFixed(1)}% error rate, ${result.averageResponseTime.toFixed(0)}ms avg response`,
          performance: result.averageResponseTime,
          suggestions: result.errorRate > 10 ? [
            `Optimize ${stepName.toLowerCase()} component rendering`,
            `Review memory usage patterns in ${stepName.toLowerCase()}`
          ] : undefined
        });

        this.qaTestSuites.addTestResult({
          testName: `Memory Usage - ${stepName}`,
          status: result.memoryUsage.peak < 100 ? 'pass' : result.memoryUsage.peak < 200 ? 'warning' : 'fail',
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

  private getStepDisplayName(testType: string): string {
    switch (testType) {
      case 'research-question':
        return 'Step 1: Research Question';
      case 'data-processing':
        return 'Step 2: Connect Your Data';
      case 'context-processing':
        return 'Step 3: Additional Context';
      case 'ui-interaction':
        return 'Step 4: Ready to Investigate';
      default:
        return testType;
    }
  }

  async runUnitTests(): Promise<void> {
    console.log('🧪 Running unit test suite with step-aware testing...');
    
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

      const avgCoverage = (
        unitTestReport.coverage.statements + 
        unitTestReport.coverage.branches + 
        unitTestReport.coverage.functions + 
        unitTestReport.coverage.lines
      ) / 4;

      this.qaTestSuites.addTestResult({
        testName: 'Code Coverage (Step-Aware)',
        status: avgCoverage > 80 ? 'pass' : avgCoverage > 60 ? 'warning' : 'fail',
        message: `${avgCoverage.toFixed(1)}% average coverage across step components (Statements: ${unitTestReport.coverage.statements.toFixed(1)}%, Functions: ${unitTestReport.coverage.functions.toFixed(1)}%)`,
        suggestions: avgCoverage < 70 ? [
          'Increase test coverage for critical step functions',
          'Add integration tests for step-to-step workflows',
          'Cover edge cases in step validation logic'
        ] : undefined
      });

      unitTestReport.testSuites.forEach(suite => {
        const failedTests = suite.tests.filter(test => test.status === 'fail').length;
        this.qaTestSuites.addTestResult({
          testName: `${suite.suiteName} Suite`,
          status: failedTests === 0 ? 'pass' : failedTests < 2 ? 'warning' : 'fail',
          message: `${suite.tests.length - failedTests}/${suite.tests.length} tests passed in ${suite.totalDuration.toFixed(0)}ms`
        });
      });

    } catch (error) {
      this.qaTestSuites.addTestResult({
        testName: 'Unit Test Suite (All Steps)',
        status: 'fail',
        message: `Unit test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }
}
