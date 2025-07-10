
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
    console.log('🚀 Running load testing suite...');
    
    const loadTestConfigs: LoadTestConfig[] = [
      {
        concurrentUsers: 5,
        duration: 10,
        rampUpTime: 2,
        testType: 'component'
      },
      {
        concurrentUsers: 3,
        duration: 15,
        rampUpTime: 3,
        testType: 'data-processing'
      },
      {
        concurrentUsers: 8,
        duration: 8,
        rampUpTime: 2,
        testType: 'ui-interaction'
      }
    ];

    for (const config of loadTestConfigs) {
      try {
        const result = await this.loadTestingSystem.runLoadTest(config);
        
        this.qaTestSuites.addTestResult({
          testName: `Load Test - ${config.testType}`,
          status: result.errorRate < 5 ? 'pass' : result.errorRate < 15 ? 'warning' : 'fail',
          message: `${config.concurrentUsers} users, ${result.errorRate.toFixed(1)}% error rate, ${result.averageResponseTime.toFixed(0)}ms avg response`,
          performance: result.averageResponseTime,
          suggestions: result.errorRate > 10 ? ['Consider optimizing component rendering', 'Review memory usage patterns'] : undefined
        });

        this.qaTestSuites.addTestResult({
          testName: `Memory Usage - ${config.testType}`,
          status: result.memoryUsage.peak < 100 ? 'pass' : result.memoryUsage.peak < 200 ? 'warning' : 'fail',
          message: `Peak memory: ${result.memoryUsage.peak.toFixed(1)}MB, Growth: ${(result.memoryUsage.final - result.memoryUsage.initial).toFixed(1)}MB`,
          suggestions: result.memoryUsage.peak > 150 ? ['Monitor for memory leaks', 'Consider component cleanup'] : undefined
        });

      } catch (error) {
        this.qaTestSuites.addTestResult({
          testName: `Load Test - ${config.testType}`,
          status: 'fail',
          message: `Load test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }
  }

  async runUnitTests(): Promise<void> {
    console.log('🧪 Running unit test suite...');
    
    try {
      const unitTestReport = await this.unitTestingSystem.runAllTests();
      
      this.qaTestSuites.addTestResult({
        testName: 'Unit Test Suite',
        status: unitTestReport.failedTests === 0 ? 'pass' : unitTestReport.failedTests < 3 ? 'warning' : 'fail',
        message: `${unitTestReport.passedTests}/${unitTestReport.totalTests} tests passed, ${unitTestReport.failedTests} failed`,
        suggestions: unitTestReport.failedTests > 0 ? [
          'Review failed unit tests and fix underlying issues',
          'Ensure all critical functionality is covered by tests'
        ] : undefined
      });

      const avgCoverage = (
        unitTestReport.coverage.statements + 
        unitTestReport.coverage.branches + 
        unitTestReport.coverage.functions + 
        unitTestReport.coverage.lines
      ) / 4;

      this.qaTestSuites.addTestResult({
        testName: 'Code Coverage',
        status: avgCoverage > 80 ? 'pass' : avgCoverage > 60 ? 'warning' : 'fail',
        message: `${avgCoverage.toFixed(1)}% average coverage (Statements: ${unitTestReport.coverage.statements.toFixed(1)}%, Functions: ${unitTestReport.coverage.functions.toFixed(1)}%)`,
        suggestions: avgCoverage < 70 ? [
          'Increase test coverage for critical functions',
          'Add integration tests for complex workflows'
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
        testName: 'Unit Test Suite',
        status: 'fail',
        message: `Unit test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }
}
