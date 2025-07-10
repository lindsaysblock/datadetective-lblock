
import { LoadTestingSystem, type LoadTestConfig } from '../loadTesting';
import { QATestSuites } from '../qa/qaTestSuites';

export class E2ELoadTest {
  private loadTestingSystem = new LoadTestingSystem();
  private qaTestSuites = new QATestSuites();

  async runComprehensiveLoadTest(): Promise<void> {
    console.log('🚀 Starting Enhanced End-to-End Load Management Test Suite...');
    
    const testConfigs: LoadTestConfig[] = [
      // Light load test - Basic functionality
      {
        concurrentUsers: 3,
        duration: 5,
        rampUpTime: 1,
        testType: 'component'
      },
      // Medium load test - Data processing
      {
        concurrentUsers: 8,
        duration: 10,
        rampUpTime: 2,
        testType: 'data-processing'
      },
      // Heavy load test - UI interactions
      {
        concurrentUsers: 15,
        duration: 15,
        rampUpTime: 3,
        testType: 'ui-interaction'
      },
      // API stress test - Network calls
      {
        concurrentUsers: 10,
        duration: 8,
        rampUpTime: 2,
        testType: 'api'
      }
    ];

    const results = [];
    let totalMemoryLeaks = 0;
    let totalPerformanceIssues = 0;
    
    for (const config of testConfigs) {
      console.log(`📊 Running ${config.testType} load test with ${config.concurrentUsers} users...`);
      
      try {
        const startMemory = this.getMemoryUsage();
        const result = await this.loadTestingSystem.runLoadTest(config);
        const endMemory = this.getMemoryUsage();
        const memoryGrowth = endMemory - startMemory;
        
        results.push(result);
        
        // Enhanced memory leak detection
        if (memoryGrowth > 50) { // MB
          totalMemoryLeaks++;
          console.warn(`⚠️ Potential memory leak detected: ${memoryGrowth.toFixed(1)}MB growth`);
        }
        
        // Performance degradation detection
        if (result.averageResponseTime > 1000) {
          totalPerformanceIssues++;
          console.warn(`⚠️ Performance degradation detected: ${result.averageResponseTime.toFixed(0)}ms avg response`);
        }
        
        // Log immediate results with enhanced metrics
        console.log(`✅ Test completed: ${result.totalRequests} requests, ${result.errorRate.toFixed(1)}% error rate`);
        console.log(`   Performance: ${result.averageResponseTime.toFixed(0)}ms avg, ${result.maxResponseTime.toFixed(0)}ms max`);
        console.log(`   Memory: ${result.memoryUsage.initial.toFixed(1)}MB → ${result.memoryUsage.peak.toFixed(1)}MB → ${result.memoryUsage.final.toFixed(1)}MB`);
        console.log(`   Memory Growth: ${memoryGrowth.toFixed(1)}MB`);
        
        // Add enhanced results to QA test suites
        this.qaTestSuites.addTestResult({
          testName: `Enhanced E2E Load Test - ${config.testType}`,
          status: this.determineTestStatus(result, memoryGrowth),
          message: `${config.concurrentUsers} users over ${config.duration}s: ${result.errorRate.toFixed(1)}% errors, ${result.averageResponseTime.toFixed(0)}ms avg response, ${memoryGrowth.toFixed(1)}MB memory growth`,
          performance: result.averageResponseTime,
          suggestions: this.generateEnhancedSuggestions(result, memoryGrowth)
        });

        // Component-specific tests
        await this.runComponentSpecificTests(config.testType);

        // Brief pause between tests to allow system recovery
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ Load test failed for ${config.testType}:`, error);
        this.qaTestSuites.addTestResult({
          testName: `Enhanced E2E Load Test - ${config.testType}`,
          status: 'fail',
          message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          suggestions: ['Check system resources', 'Verify component mounting', 'Review error logs']
        });
      }
    }

    // Generate comprehensive report with actionable insights
    this.generateEnhancedLoadTestReport(results, totalMemoryLeaks, totalPerformanceIssues);
    
    console.log('🏁 Enhanced End-to-End Load Management Test Suite completed!');
  }

  private async runComponentSpecificTests(testType: string): Promise<void> {
    switch (testType) {
      case 'component':
        await this.testComponentRendering();
        break;
      case 'data-processing':
        await this.testDataProcessingFlow();
        break;
      case 'ui-interaction':
        await this.testUIResponsiveness();
        break;
      case 'api':
        await this.testAPIResilience();
        break;
    }
  }

  private async testComponentRendering(): Promise<void> {
    console.log('🔍 Testing component rendering performance...');
    
    // Test React component mount/unmount cycles
    const mountCycles = 50;
    const startTime = performance.now();
    
    for (let i = 0; i < mountCycles; i++) {
      const testDiv = document.createElement('div');
      testDiv.innerHTML = '<div class="test-component">Test Content</div>';
      document.body.appendChild(testDiv);
      testDiv.getBoundingClientRect(); // Force layout
      document.body.removeChild(testDiv);
    }
    
    const mountTime = performance.now() - startTime;
    console.log(`📊 Component mount/unmount: ${(mountTime / mountCycles).toFixed(2)}ms per cycle`);
  }

  private async testDataProcessingFlow(): Promise<void> {
    console.log('🔍 Testing data processing pipeline...');
    
    // Simulate CSV parsing performance
    const csvData = Array.from({ length: 10000 }, (_, i) => 
      `${i},test_value_${i},${Math.random().toFixed(4)},${new Date().toISOString()}`
    ).join('\n');
    
    const startTime = performance.now();
    const lines = csvData.split('\n');
    const parsedData = lines.map(line => line.split(','));
    const processingTime = performance.now() - startTime;
    
    console.log(`📊 Data processing: ${parsedData.length} rows in ${processingTime.toFixed(2)}ms`);
  }

  private async testUIResponsiveness(): Promise<void> {
    console.log('🔍 Testing UI responsiveness...');
    
    // Test event handling performance
    const button = document.createElement('button');
    button.style.display = 'none';
    document.body.appendChild(button);
    
    const clickTimes: number[] = [];
    
    for (let i = 0; i < 100; i++) {
      const startTime = performance.now();
      button.click();
      clickTimes.push(performance.now() - startTime);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
    
    const avgClickTime = clickTimes.reduce((a, b) => a + b, 0) / clickTimes.length;
    console.log(`📊 UI responsiveness: ${avgClickTime.toFixed(3)}ms avg click response`);
    
    button.remove();
  }

  private async testAPIResilience(): Promise<void> {
    console.log('🔍 Testing API resilience...');
    
    const apiCalls = 20;
    const results = { success: 0, timeout: 0, error: 0 };
    
    const promises = Array.from({ length: apiCalls }, async () => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      
      try {
        const response = await fetch('/api/health-check', {
          signal: controller.signal,
          method: 'GET'
        });
        
        if (response.ok) {
          results.success++;
        } else {
          results.error++;
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          results.timeout++;
        } else {
          results.error++;
        }
      } finally {
        clearTimeout(timeout);
      }
    });
    
    await Promise.allSettled(promises);
    console.log(`📊 API resilience: ${results.success}/${apiCalls} successful, ${results.timeout} timeouts, ${results.error} errors`);
  }

  private determineTestStatus(result: any, memoryGrowth: number): 'pass' | 'warning' | 'fail' {
    if (result.errorRate > 15 || memoryGrowth > 100) return 'fail';
    if (result.errorRate > 5 || result.averageResponseTime > 1000 || memoryGrowth > 50) return 'warning';
    return 'pass';
  }

  private generateEnhancedSuggestions(result: any, memoryGrowth: number): string[] | undefined {
    const suggestions: string[] = [];
    
    if (result.errorRate > 10) {
      suggestions.push('High error rate detected - implement circuit breaker pattern');
      suggestions.push('Add retry logic with exponential backoff');
    }
    
    if (result.averageResponseTime > 1000) {
      suggestions.push('Slow response times - implement request debouncing');
      suggestions.push('Consider lazy loading for non-critical components');
    }
    
    if (result.memoryUsage.peak > 150) {
      suggestions.push('High memory usage - implement virtual scrolling for large lists');
      suggestions.push('Add cleanup functions to prevent memory leaks');
    }
    
    if (memoryGrowth > 50) {
      suggestions.push('Memory growth detected - audit event listeners and subscriptions');
      suggestions.push('Implement proper component cleanup in useEffect');
    }
    
    if (result.memoryUsage.final > result.memoryUsage.initial * 1.5) {
      suggestions.push('Memory not releasing - check for circular references');
      suggestions.push('Implement garbage collection optimizations');
    }
    
    return suggestions.length > 0 ? suggestions : undefined;
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024;
    }
    return 0;
  }

  private generateEnhancedLoadTestReport(results: any[], memoryLeaks: number, performanceIssues: number): void {
    console.log('\n📈 ENHANCED LOAD TEST REPORT SUMMARY');
    console.log('=' .repeat(60));
    
    const totalRequests = results.reduce((sum, r) => sum + r.totalRequests, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.failedRequests, 0);
    const avgResponseTime = results.reduce((sum, r) => sum + r.averageResponseTime, 0) / results.length;
    const maxMemoryUsage = Math.max(...results.map(r => r.memoryUsage.peak));
    const totalMemoryGrowth = results.reduce((sum, r) => 
      sum + (r.memoryUsage.final - r.memoryUsage.initial), 0
    );
    
    console.log(`Total Requests: ${totalRequests}`);
    console.log(`Total Errors: ${totalErrors} (${((totalErrors / totalRequests) * 100).toFixed(1)}%)`);
    console.log(`Average Response Time: ${avgResponseTime.toFixed(0)}ms`);
    console.log(`Peak Memory Usage: ${maxMemoryUsage.toFixed(1)}MB`);
    console.log(`Total Memory Growth: ${totalMemoryGrowth.toFixed(1)}MB`);
    console.log(`Memory Leaks Detected: ${memoryLeaks}`);
    console.log(`Performance Issues: ${performanceIssues}`);
    
    console.log('\n🔍 Detailed Test Results:');
    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.config.testType}:`);
      console.log(`   Users: ${result.config.concurrentUsers}, Duration: ${result.config.duration}s`);
      console.log(`   Requests: ${result.totalRequests} (${result.successfulRequests} success, ${result.failedRequests} failed)`);
      console.log(`   Performance: ${result.averageResponseTime.toFixed(0)}ms avg (${result.minResponseTime.toFixed(0)}ms - ${result.maxResponseTime.toFixed(0)}ms)`);
      console.log(`   Throughput: ${result.throughput.toFixed(1)} req/s`);
      console.log(`   Memory: ${result.memoryUsage.initial.toFixed(1)}MB → ${result.memoryUsage.peak.toFixed(1)}MB → ${result.memoryUsage.final.toFixed(1)}MB`);
    });
    
    // Enhanced performance assessment with actionable recommendations
    const overallStatus = this.calculateOverallStatus(totalErrors, totalRequests, avgResponseTime, memoryLeaks, performanceIssues);
    
    console.log(`\n🎯 Overall System Performance: ${overallStatus.status}`);
    console.log(`📋 Recommendations:`);
    overallStatus.recommendations.forEach(rec => console.log(`   • ${rec}`));
    console.log('=' .repeat(60));
  }

  private calculateOverallStatus(errors: number, requests: number, avgTime: number, leaks: number, issues: number) {
    const errorRate = errors / requests;
    const recommendations: string[] = [];
    
    let status = 'EXCELLENT';
    
    if (errorRate > 0.30 || leaks > 3 || issues > 3) {
      status = 'CRITICAL';
      recommendations.push('Immediate optimization required');
      recommendations.push('Implement error boundaries and cleanup functions');
    } else if (errorRate > 0.15 || avgTime > 1000 || leaks > 1 || issues > 1) {
      status = 'NEEDS IMPROVEMENT';
      recommendations.push('Optimize component rendering and memory usage');
      recommendations.push('Implement performance monitoring');
    } else if (errorRate > 0.05 || avgTime > 500) {
      status = 'GOOD';
      recommendations.push('Minor optimizations recommended');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('System performing optimally');
      recommendations.push('Continue monitoring for regression');
    }
    
    return { status, recommendations };
  }

  async runQuickLoadCheck(): Promise<void> {
    console.log('⚡ Running Enhanced Quick Load Check...');
    
    const quickConfig: LoadTestConfig = {
      concurrentUsers: 5,
      duration: 3,
      rampUpTime: 1,
      testType: 'component'
    };
    
    try {
      const startMemory = this.getMemoryUsage();
      const result = await this.loadTestingSystem.runLoadTest(quickConfig);
      const endMemory = this.getMemoryUsage();
      const memoryGrowth = endMemory - startMemory;
      
      console.log(`Enhanced Quick Load Check Results:`);
      console.log(`- Requests: ${result.totalRequests} (${result.errorRate.toFixed(1)}% error rate)`);
      console.log(`- Response Time: ${result.averageResponseTime.toFixed(0)}ms average`);
      console.log(`- Memory Usage: ${result.memoryUsage.peak.toFixed(1)}MB peak`);
      console.log(`- Memory Growth: ${memoryGrowth.toFixed(1)}MB`);
      
      const status = this.determineQuickCheckStatus(result, memoryGrowth);
      console.log(`System Status: ${status.icon} ${status.message}`);
      
      if (status.suggestions.length > 0) {
        console.log('Suggestions:');
        status.suggestions.forEach(suggestion => console.log(`  • ${suggestion}`));
      }
      
    } catch (error) {
      console.error('❌ Enhanced quick load check failed:', error);
    }
  }

  private determineQuickCheckStatus(result: any, memoryGrowth: number) {
    if (result.errorRate < 2 && result.averageResponseTime < 300 && memoryGrowth < 20) {
      return {
        icon: '✅',
        message: 'EXCELLENT - System performing optimally',
        suggestions: []
      };
    } else if (result.errorRate < 5 && result.averageResponseTime < 500 && memoryGrowth < 50) {
      return {
        icon: '✅',
        message: 'HEALTHY - Minor optimizations possible',
        suggestions: ['Monitor for potential improvements']
      };
    } else {
      return {
        icon: '⚠️',
        message: 'NEEDS ATTENTION - Performance issues detected',
        suggestions: [
          'Review component lifecycle methods',
          'Optimize heavy operations',
          'Check for memory leaks'
        ]
      };
    }
  }
}
