import { LoadTestingSystem } from './loadTesting/loadTestingSystem';
import { UnitTestingSystem } from '../unitTesting';
import { QATestSuites } from '../qa/qaTestSuites';
import { TestRunner } from '../qa/testRunner';

export class E2ELoadTest {
  private loadTestingSystem = new LoadTestingSystem();
  private unitTestingSystem = new UnitTestingSystem();
  private qaTestSuites: QATestSuites;

  constructor() {
    const testRunner = new TestRunner();
    this.qaTestSuites = new QATestSuites(testRunner);
  }

  async runComprehensiveLoadTest(): Promise<void> {
    console.log('🚀 Starting comprehensive E2E load test with analytics...');
    
    try {
      // Run component load tests
      await this.loadTestingSystem.runLoadTest({
        concurrentUsers: 10,
        duration: 30,
        rampUpTime: 5,
        testType: 'component'
      });

      // Run data processing tests
      await this.loadTestingSystem.runLoadTest({
        concurrentUsers: 5,
        duration: 20,
        rampUpTime: 3,
        testType: 'data-processing'
      });

      // Add analytics-specific load tests
      await this.loadTestingSystem.runLoadTest({
        concurrentUsers: 12,
        duration: 35,
        rampUpTime: 5,
        testType: 'analytics-processing'
      });

      // Test analytics under concurrent load
      await this.loadTestingSystem.runLoadTest({
        concurrentUsers: 8,
        duration: 25,
        rampUpTime: 3,
        testType: 'analytics-concurrent'
      });

      // Run UI interaction tests
      await this.loadTestingSystem.runLoadTest({
        concurrentUsers: 8,
        duration: 25,
        rampUpTime: 4,
        testType: 'ui-interaction'
      });

      // Run API tests
      await this.loadTestingSystem.runLoadTest({
        concurrentUsers: 15,
        duration: 40,
        rampUpTime: 6,
        testType: 'api'
      });

      console.log('✅ Comprehensive E2E load test with analytics completed successfully');
    } catch (error) {
      console.error('❌ Comprehensive E2E load test failed:', error);
      throw error;
    }
  }

  async runQuickLoadCheck(): Promise<void> {
    console.log('⚡ Starting quick load check with analytics...');
    
    try {
      // Quick component test
      await this.loadTestingSystem.runLoadTest({
        concurrentUsers: 3,
        duration: 10,
        rampUpTime: 2,
        testType: 'component'
      });

      // Quick UI interaction test
      await this.loadTestingSystem.runLoadTest({
        concurrentUsers: 2,
        duration: 8,
        rampUpTime: 1,
        testType: 'ui-interaction'
      });

      // Quick analytics load test
      await this.loadTestingSystem.runLoadTest({
        concurrentUsers: 3,
        duration: 8,
        rampUpTime: 1,
        testType: 'analytics-processing'
      });

      console.log('✅ Quick load check with analytics completed successfully');
    } catch (error) {
      console.error('❌ Quick load check failed:', error);
      throw error;
    }
  }
}
