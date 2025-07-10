
import { LoadTestingSystem } from './loadTesting/loadTestingSystem';
import { UnitTestingSystem } from '../unitTesting';
import { QATestSuites } from '../qa/qaTestSuites';

export class E2ELoadTest {
  private loadTestingSystem = new LoadTestingSystem();
  private unitTestingSystem = new UnitTestingSystem();
  private qaTestSuites = new QATestSuites();

  async runComprehensiveLoadTest(): Promise<void> {
    console.log('🚀 Starting comprehensive E2E load test...');
    
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

      console.log('✅ Comprehensive E2E load test completed successfully');
    } catch (error) {
      console.error('❌ Comprehensive E2E load test failed:', error);
      throw error;
    }
  }

  async runQuickLoadCheck(): Promise<void> {
    console.log('⚡ Starting quick load check...');
    
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

      console.log('✅ Quick load check completed successfully');
    } catch (error) {
      console.error('❌ Quick load check failed:', error);
      throw error;
    }
  }
}
