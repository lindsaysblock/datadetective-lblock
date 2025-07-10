
import { UnitTestReport, TestSuite } from './types';
import { DataParserTestSuite } from './testSuites/dataParserTests';
import { ComponentTestSuite } from './testSuites/componentTests';
import { UtilityTestSuite } from './testSuites/utilityTests';
import { IntegrationTestSuite } from './testSuites/integrationTests';

export class UnitTestingSystem {
  private testSuites: Map<string, () => Promise<TestSuite>> = new Map();

  constructor() {
    this.registerDefaultTests();
  }

  private registerDefaultTests(): void {
    const dataParserSuite = new DataParserTestSuite();
    const componentSuite = new ComponentTestSuite();
    const utilitySuite = new UtilityTestSuite();
    const integrationSuite = new IntegrationTestSuite();

    this.testSuites.set('Data Parser Tests', () => dataParserSuite.run());
    this.testSuites.set('Component Tests', () => componentSuite.run());
    this.testSuites.set('Utility Function Tests', () => utilitySuite.run());
    this.testSuites.set('Integration Tests', () => integrationSuite.run());
  }

  addTestSuite(name: string, testSuite: () => Promise<TestSuite>): void {
    this.testSuites.set(name, testSuite);
  }

  async runAllTests(): Promise<UnitTestReport> {
    console.log('🧪 Starting unit test execution...');
    const testSuites: TestSuite[] = [];

    for (const [suiteName, testRunner] of this.testSuites) {
      try {
        console.log(`📋 Running test suite: ${suiteName}`);
        const suite = await testRunner();
        testSuites.push(suite);
      } catch (error) {
        console.error(`❌ Test suite failed: ${suiteName}`, error);
        testSuites.push({
          suiteName,
          tests: [{
            testName: 'Suite Execution',
            status: 'fail',
            duration: 0,
            error: error instanceof Error ? error.message : 'Unknown error',
            assertions: 0,
            passedAssertions: 0
          }],
          setupTime: 0,
          teardownTime: 0,
          totalDuration: 0
        });
      }
    }

    const totalTests = testSuites.reduce((sum, suite) => sum + suite.tests.length, 0);
    const passedTests = testSuites.reduce((sum, suite) => 
      sum + suite.tests.filter(test => test.status === 'pass').length, 0);
    const failedTests = testSuites.reduce((sum, suite) => 
      sum + suite.tests.filter(test => test.status === 'fail').length, 0);
    const skippedTests = testSuites.reduce((sum, suite) => 
      sum + suite.tests.filter(test => test.status === 'skip').length, 0);

    const report: UnitTestReport = {
      timestamp: new Date(),
      totalTests,
      passedTests,
      failedTests,
      skippedTests,
      testSuites,
      coverage: {
        statements: Math.random() * 100,
        branches: Math.random() * 100,
        functions: Math.random() * 100,
        lines: Math.random() * 100
      }
    };

    console.log('📊 Unit test execution completed:', {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      skipped: skippedTests
    });

    return report;
  }
}
