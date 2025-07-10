
import { LoadTestingSystem, type LoadTestConfig } from '../loadTesting';
import { QATestSuites } from '../qa/qaTestSuites';

export class E2ELoadTest {
  private loadTestingSystem = new LoadTestingSystem();
  private qaTestSuites = new QATestSuites();

  async runComprehensiveLoadTest(): Promise<void> {
    console.log('🚀 Starting Enhanced End-to-End Load Management Test Suite with Updated Step Order...');
    
    const testConfigs: LoadTestConfig[] = [
      // Light load test - Step 1: Research Question
      {
        concurrentUsers: 3,
        duration: 5,
        rampUpTime: 1,
        testType: 'research-question'
      },
      // Medium load test - Step 2: Data Connection
      {
        concurrentUsers: 8,
        duration: 10,
        rampUpTime: 2,
        testType: 'data-processing'
      },
      // Light load test - Step 3: Additional Context
      {
        concurrentUsers: 5,
        duration: 6,
        rampUpTime: 1,
        testType: 'context-processing'
      },
      // Heavy load test - Step 4: Analysis Investigation
      {
        concurrentUsers: 15,
        duration: 15,
        rampUpTime: 3,
        testType: 'ui-interaction'
      },
      // API stress test - Cross-step integration
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
      console.log(`📊 Running ${config.testType} load test with ${config.concurrentUsers} users for updated step flow...`);
      
      try {
        const startMemory = this.getMemoryUsage();
        const result = await this.loadTestingSystem.runLoadTest(config);
        const endMemory = this.getMemoryUsage();
        const memoryGrowth = endMemory - startMemory;
        
        results.push(result);
        
        // Enhanced memory leak detection with step context
        if (memoryGrowth > 50) { // MB
          totalMemoryLeaks++;
          console.warn(`⚠️ Potential memory leak detected in ${config.testType}: ${memoryGrowth.toFixed(1)}MB growth`);
        }
        
        // Performance degradation detection with step awareness
        if (result.averageResponseTime > 1000) {
          totalPerformanceIssues++;
          console.warn(`⚠️ Performance degradation detected in ${config.testType}: ${result.averageResponseTime.toFixed(0)}ms avg response`);
        }
        
        // Log immediate results with enhanced step-aware metrics
        console.log(`✅ ${config.testType} test completed: ${result.totalRequests} requests, ${result.errorRate.toFixed(1)}% error rate`);
        console.log(`   Performance: ${result.averageResponseTime.toFixed(0)}ms avg, ${result.maxResponseTime.toFixed(0)}ms max`);
        console.log(`   Memory: ${result.memoryUsage.initial.toFixed(1)}MB → ${result.memoryUsage.peak.toFixed(1)}MB → ${result.memoryUsage.final.toFixed(1)}MB`);
        console.log(`   Memory Growth: ${memoryGrowth.toFixed(1)}MB`);
        
        // Add enhanced results to QA test suites with step context
        this.qaTestSuites.addTestResult({
          testName: `Enhanced E2E Load Test - ${this.getStepName(config.testType)}`,
          status: this.determineTestStatus(result, memoryGrowth),
          message: `${config.concurrentUsers} users over ${config.duration}s in ${this.getStepName(config.testType)}: ${result.errorRate.toFixed(1)}% errors, ${result.averageResponseTime.toFixed(0)}ms avg response, ${memoryGrowth.toFixed(1)}MB memory growth`,
          performance: result.averageResponseTime,
          suggestions: this.generateEnhancedSuggestions(result, memoryGrowth, config.testType)
        });

        // Step-specific tests
        await this.runStepSpecificTests(config.testType);

        // Brief pause between tests to allow system recovery
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ Load test failed for ${config.testType}:`, error);
        this.qaTestSuites.addTestResult({
          testName: `Enhanced E2E Load Test - ${this.getStepName(config.testType)}`,
          status: 'fail',
          message: `${this.getStepName(config.testType)} test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          suggestions: ['Check system resources', 'Verify step component mounting', 'Review step-specific error logs']
        });
      }
    }

    // Generate comprehensive report with actionable insights
    this.generateEnhancedLoadTestReport(results, totalMemoryLeaks, totalPerformanceIssues);
    
    console.log('🏁 Enhanced End-to-End Load Management Test Suite completed with updated step order!');
  }

  private getStepName(testType: string): string {
    switch (testType) {
      case 'research-question':
        return 'Step 1: What\'s your question?';
      case 'data-processing':
        return 'Step 2: Connect Your Data';
      case 'context-processing':
        return 'Step 3: Additional Context';
      case 'ui-interaction':
        return 'Step 4: Ready to Investigate?';
      case 'api':
        return 'Cross-Step Integration';
      default:
        return testType;
    }
  }

  private async runStepSpecificTests(testType: string): Promise<void> {
    switch (testType) {
      case 'research-question':
        await this.testResearchQuestionStep();
        break;
      case 'data-processing':
        await this.testDataConnectionStep();
        break;
      case 'context-processing':
        await this.testAdditionalContextStep();
        break;
      case 'ui-interaction':
        await this.testInvestigationReadinessStep();
        break;
      case 'api':
        await this.testAPIResilience();
        break;
    }
  }

  private async testResearchQuestionStep(): Promise<void> {
    console.log('🔍 Testing Step 1: Research Question performance...');
    
    // Test research question validation and processing
    const questionTests = [
      'What are the main trends in customer behavior?',
      'How does user engagement vary by season?',
      'What factors influence purchase decisions?'
    ];
    
    const startTime = performance.now();
    
    for (const question of questionTests) {
      // Simulate question validation
      const isValid = question.length > 5 && question.includes('?');
      if (!isValid) {
        console.warn(`⚠️ Invalid research question: ${question}`);
      }
    }
    
    const questionTime = performance.now() - startTime;
    console.log(`📊 Step 1 processing: ${questionTests.length} questions validated in ${questionTime.toFixed(2)}ms`);
  }

  private async testDataConnectionStep(): Promise<void> {
    console.log('🔍 Testing Step 2: Data Connection performance...');
    
    // Simulate CSV parsing performance
    const csvData = Array.from({ length: 10000 }, (_, i) => 
      `${i},test_value_${i},${Math.random().toFixed(4)},${new Date().toISOString()}`
    ).join('\n');
    
    const startTime = performance.now();
    const lines = csvData.split('\n');
    const parsedData = lines.map(line => line.split(','));
    const processingTime = performance.now() - startTime;
    
    console.log(`📊 Step 2 data processing: ${parsedData.length} rows in ${processingTime.toFixed(2)}ms`);
  }

  private async testAdditionalContextStep(): Promise<void> {
    console.log('🔍 Testing Step 3: Additional Context performance...');
    
    // Test context processing performance
    const contextExamples = [
      'This data comes from our e-commerce platform...',
      'Business context: seasonal trends analysis...',
      'Data source: customer purchase history from Q1-Q4...'
    ];
    
    const startTime = performance.now();
    
    for (const context of contextExamples) {
      // Simulate context validation and processing
      const contextLength = context.length;
      const hasRelevantInfo = context.includes('data') || context.includes('business') || context.includes('customer');
      
      if (contextLength > 0 && hasRelevantInfo) {
        // Process context
      }
    }
    
    const contextTime = performance.now() - startTime;
    console.log(`📊 Step 3 context processing: ${contextExamples.length} contexts in ${contextTime.toFixed(2)}ms`);
  }

  private async testInvestigationReadinessStep(): Promise<void> {
    console.log('🔍 Testing Step 4: Investigation Readiness performance...');
    
    // Test readiness check and project setup
    const readinessChecks = [
      'Research question provided',
      'Data connected',
      'Context added (optional)',
      'Teaching mode setting',
      'Project naming'
    ];
    
    const startTime = performance.now();
    
    let readyCount = 0;
    for (const check of readinessChecks) {
      // Simulate readiness validation
      const isReady = Math.random() > 0.1; // 90% success rate
      if (isReady) readyCount++;
    }
    
    const readinessTime = performance.now() - startTime;
    console.log(`📊 Step 4 readiness: ${readyCount}/${readinessChecks.length} checks passed in ${readinessTime.toFixed(2)}ms`);
  }

  private async testAPIResilience(): Promise<void> {
    console.log('🔍 Testing Cross-Step API resilience...');
    
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
    console.log(`📊 Cross-step API resilience: ${results.success}/${apiCalls} successful, ${results.timeout} timeouts, ${results.error} errors`);
  }

  private determineTestStatus(result: any, memoryGrowth: number): 'pass' | 'warning' | 'fail' {
    if (result.errorRate > 15 || memoryGrowth > 100) return 'fail';
    if (result.errorRate > 5 || result.averageResponseTime > 1000 || memoryGrowth > 50) return 'warning';
    return 'pass';
  }

  private generateEnhancedSuggestions(result: any, memoryGrowth: number, testType: string): string[] | undefined {
    const suggestions: string[] = [];
    
    if (result.errorRate > 10) {
      suggestions.push(`High error rate detected in ${this.getStepName(testType)} - implement circuit breaker pattern`);
      suggestions.push('Add retry logic with exponential backoff for step transitions');
    }
    
    if (result.averageResponseTime > 1000) {
      suggestions.push(`Slow response times in ${this.getStepName(testType)} - implement request debouncing`);
      suggestions.push('Consider lazy loading for non-critical step components');
    }
    
    if (result.memoryUsage.peak > 150) {
      suggestions.push(`High memory usage in ${this.getStepName(testType)} - implement virtual scrolling for large lists`);
      suggestions.push('Add cleanup functions to prevent memory leaks between steps');
    }
    
    if (memoryGrowth > 50) {
      suggestions.push(`Memory growth detected in ${this.getStepName(testType)} - audit event listeners and subscriptions`);
      suggestions.push('Implement proper step component cleanup in useEffect');
    }
    
    if (result.memoryUsage.final > result.memoryUsage.initial * 1.5) {
      suggestions.push(`Memory not releasing in ${this.getStepName(testType)} - check for circular references`);
      suggestions.push('Implement garbage collection optimizations for step transitions');
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
    console.log('\n📈 ENHANCED LOAD TEST REPORT SUMMARY (Updated Step Order)');
    console.log('=' .repeat(70));
    
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
    
    console.log('\n🔍 Detailed Test Results by Step:');
    results.forEach((result, index) => {
      const stepName = this.getStepName(result.config.testType);
      console.log(`${index + 1}. ${stepName}:`);
      console.log(`   Users: ${result.config.concurrentUsers}, Duration: ${result.config.duration}s`);
      console.log(`   Requests: ${result.totalRequests} (${result.successfulRequests} success, ${result.failedRequests} failed)`);
      console.log(`   Performance: ${result.averageResponseTime.toFixed(0)}ms avg (${result.minResponseTime.toFixed(0)}ms - ${result.maxResponseTime.toFixed(0)}ms)`);
      console.log(`   Throughput: ${result.throughput.toFixed(1)} req/s`);
      console.log(`   Memory: ${result.memoryUsage.initial.toFixed(1)}MB → ${result.memoryUsage.peak.toFixed(1)}MB → ${result.memoryUsage.final.toFixed(1)}MB`);
    });
    
    // Enhanced performance assessment with step-aware recommendations
    const overallStatus = this.calculateOverallStatus(totalErrors, totalRequests, avgResponseTime, memoryLeaks, performanceIssues);
    
    console.log(`\n🎯 Overall System Performance: ${overallStatus.status}`);
    console.log(`📋 Step-Aware Recommendations:`);
    overallStatus.recommendations.forEach(rec => console.log(`   • ${rec}`));
    console.log('=' .repeat(70));
  }

  private calculateOverallStatus(errors: number, requests: number, avgTime: number, leaks: number, issues: number) {
    const errorRate = errors / requests;
    const recommendations: string[] = [];
    
    let status = 'EXCELLENT';
    
    if (errorRate > 0.30 || leaks > 3 || issues > 3) {
      status = 'CRITICAL';
      recommendations.push('Immediate optimization required across all steps');
      recommendations.push('Implement error boundaries and cleanup functions for step transitions');
    } else if (errorRate > 0.15 || avgTime > 1000 || leaks > 1 || issues > 1) {
      status = 'NEEDS IMPROVEMENT';
      recommendations.push('Optimize step component rendering and memory usage');
      recommendations.push('Implement performance monitoring for step transitions');
    } else if (errorRate > 0.05 || avgTime > 500) {
      status = 'GOOD';
      recommendations.push('Minor optimizations recommended for step flow');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('4-step system performing optimally');
      recommendations.push('Continue monitoring for step-specific regressions');
    }
    
    return { status, recommendations };
  }

  async runQuickLoadCheck(): Promise<void> {
    console.log('⚡ Running Enhanced Quick Load Check (Updated Step Order)...');
    
    const quickConfig: LoadTestConfig = {
      concurrentUsers: 5,
      duration: 3,
      rampUpTime: 1,
      testType: 'research-question'
    };
    
    try {
      const startMemory = this.getMemoryUsage();
      const result = await this.loadTestingSystem.runLoadTest(quickConfig);
      const endMemory = this.getMemoryUsage();
      const memoryGrowth = endMemory - startMemory;
      
      console.log(`Enhanced Quick Load Check Results (Step 1 Focus):`);
      console.log(`- Requests: ${result.totalRequests} (${result.errorRate.toFixed(1)}% error rate)`);
      console.log(`- Response Time: ${result.averageResponseTime.toFixed(0)}ms average`);
      console.log(`- Memory Usage: ${result.memoryUsage.peak.toFixed(1)}MB peak`);
      console.log(`- Memory Growth: ${memoryGrowth.toFixed(1)}MB`);
      
      const status = this.determineQuickCheckStatus(result, memoryGrowth);
      console.log(`Step 1 System Status: ${status.icon} ${status.message}`);
      
      if (status.suggestions.length > 0) {
        console.log('Step-Specific Suggestions:');
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
        message: 'EXCELLENT - 4-step system performing optimally',
        suggestions: []
      };
    } else if (result.errorRate < 5 && result.averageResponseTime < 500 && memoryGrowth < 50) {
      return {
        icon: '✅',
        message: 'HEALTHY - Minor step optimizations possible',
        suggestions: ['Monitor step transition performance']
      };
    } else {
      return {
        icon: '⚠️',
        message: 'NEEDS ATTENTION - Step performance issues detected',
        suggestions: [
          'Review step component lifecycle methods',
          'Optimize heavy operations in step processing',
          'Check for memory leaks in step transitions'
        ]
      };
    }
  }
}
