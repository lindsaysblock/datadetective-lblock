
import { LoadTestingSystem, type LoadTestConfig } from '../loadTesting';
import { QATestSuites } from '../qa/qaTestSuites';

export class E2ELoadTest {
  private loadTestingSystem = new LoadTestingSystem();
  private qaTestSuites = new QATestSuites();

  async runComprehensiveLoadTest(): Promise<void> {
    console.log('🚀 Starting End-to-End Load Management Test Suite...');
    
    const testConfigs: LoadTestConfig[] = [
      // Light load test
      {
        concurrentUsers: 3,
        duration: 5,
        rampUpTime: 1,
        testType: 'component'
      },
      // Medium load test
      {
        concurrentUsers: 8,
        duration: 10,
        rampUpTime: 2,
        testType: 'data-processing'
      },
      // Heavy load test
      {
        concurrentUsers: 15,
        duration: 15,
        rampUpTime: 3,
        testType: 'ui-interaction'
      },
      // API stress test
      {
        concurrentUsers: 10,
        duration: 8,
        rampUpTime: 2,
        testType: 'api'
      }
    ];

    const results = [];
    
    for (const config of testConfigs) {
      console.log(`📊 Running ${config.testType} load test with ${config.concurrentUsers} users...`);
      
      try {
        const result = await this.loadTestingSystem.runLoadTest(config);
        results.push(result);
        
        // Log immediate results
        console.log(`✅ Test completed: ${result.totalRequests} requests, ${result.errorRate.toFixed(1)}% error rate`);
        console.log(`   Performance: ${result.averageResponseTime.toFixed(0)}ms avg, ${result.maxResponseTime.toFixed(0)}ms max`);
        console.log(`   Memory: ${result.memoryUsage.initial.toFixed(1)}MB → ${result.memoryUsage.peak.toFixed(1)}MB → ${result.memoryUsage.final.toFixed(1)}MB`);
        
        // Add results to QA test suites for reporting
        this.qaTestSuites.addTestResult({
          testName: `E2E Load Test - ${config.testType}`,
          status: result.errorRate < 5 ? 'pass' : result.errorRate < 15 ? 'warning' : 'fail',
          message: `${config.concurrentUsers} users over ${config.duration}s: ${result.errorRate.toFixed(1)}% errors, ${result.averageResponseTime.toFixed(0)}ms avg response`,
          performance: result.averageResponseTime,
          suggestions: this.generateSuggestions(result)
        });

        // Brief pause between tests to allow system recovery
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ Load test failed for ${config.testType}:`, error);
        this.qaTestSuites.addTestResult({
          testName: `E2E Load Test - ${config.testType}`,
          status: 'fail',
          message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    }

    // Generate comprehensive report
    this.generateLoadTestReport(results);
    
    console.log('🏁 End-to-End Load Management Test Suite completed!');
  }

  private generateSuggestions(result: any): string[] | undefined {
    const suggestions: string[] = [];
    
    if (result.errorRate > 10) {
      suggestions.push('High error rate detected - review error handling and resource allocation');
    }
    
    if (result.averageResponseTime > 1000) {
      suggestions.push('Slow response times - consider optimizing critical paths');
    }
    
    if (result.memoryUsage.peak > 150) {
      suggestions.push('High memory usage - check for memory leaks and optimize data structures');
    }
    
    if (result.memoryUsage.final > result.memoryUsage.initial * 1.5) {
      suggestions.push('Memory growth detected - ensure proper cleanup after operations');
    }
    
    return suggestions.length > 0 ? suggestions : undefined;
  }

  private generateLoadTestReport(results: any[]): void {
    console.log('\n📈 LOAD TEST REPORT SUMMARY');
    console.log('=' .repeat(50));
    
    const totalRequests = results.reduce((sum, r) => sum + r.totalRequests, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.failedRequests, 0);
    const avgResponseTime = results.reduce((sum, r) => sum + r.averageResponseTime, 0) / results.length;
    const maxMemoryUsage = Math.max(...results.map(r => r.memoryUsage.peak));
    
    console.log(`Total Requests: ${totalRequests}`);
    console.log(`Total Errors: ${totalErrors} (${((totalErrors / totalRequests) * 100).toFixed(1)}%)`);
    console.log(`Average Response Time: ${avgResponseTime.toFixed(0)}ms`);
    console.log(`Peak Memory Usage: ${maxMemoryUsage.toFixed(1)}MB`);
    
    console.log('\nDetailed Results:');
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.config.testType}:`);
      console.log(`   Users: ${result.config.concurrentUsers}, Duration: ${result.config.duration}s`);
      console.log(`   Requests: ${result.totalRequests} (${result.successfulRequests} success, ${result.failedRequests} failed)`);
      console.log(`   Performance: ${result.averageResponseTime.toFixed(0)}ms avg (${result.minResponseTime.toFixed(0)}ms - ${result.maxResponseTime.toFixed(0)}ms)`);
      console.log(`   Throughput: ${result.throughput.toFixed(1)} req/s`);
      console.log(`   Memory: ${result.memoryUsage.initial.toFixed(1)}MB → ${result.memoryUsage.peak.toFixed(1)}MB`);
    });
    
    // Performance assessment
    const overallStatus = totalErrors / totalRequests < 0.05 ? 'EXCELLENT' : 
                         totalErrors / totalRequests < 0.15 ? 'GOOD' : 
                         totalErrors / totalRequests < 0.30 ? 'NEEDS IMPROVEMENT' : 'CRITICAL';
    
    console.log(`\nOverall System Performance: ${overallStatus}`);
    console.log('=' .repeat(50));
  }

  async runQuickLoadCheck(): Promise<void> {
    console.log('⚡ Running Quick Load Check...');
    
    const quickConfig: LoadTestConfig = {
      concurrentUsers: 5,
      duration: 3,
      rampUpTime: 1,
      testType: 'component'
    };
    
    try {
      const result = await this.loadTestingSystem.runLoadTest(quickConfig);
      
      console.log(`Quick Load Check Results:`);
      console.log(`- Requests: ${result.totalRequests} (${result.errorRate.toFixed(1)}% error rate)`);
      console.log(`- Response Time: ${result.averageResponseTime.toFixed(0)}ms average`);
      console.log(`- Memory Usage: ${result.memoryUsage.peak.toFixed(1)}MB peak`);
      
      const status = result.errorRate < 5 && result.averageResponseTime < 500 ? '✅ HEALTHY' : '⚠️ NEEDS ATTENTION';
      console.log(`System Status: ${status}`);
      
    } catch (error) {
      console.error('❌ Quick load check failed:', error);
    }
  }
}
