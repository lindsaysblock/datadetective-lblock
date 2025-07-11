
import { LoadTestConfig, LoadTestResult, LoadTestMetrics } from './types';

export class LoadTestingSystem {
  async runLoadTest(config: LoadTestConfig): Promise<LoadTestResult> {
    console.log(`🚀 Starting load test: ${config.testType} with ${config.concurrentUsers} users`);
    
    const metrics: LoadTestMetrics = {
      responseTime: [],
      errors: 0,
      successCount: 0,
      startTime: performance.now(),
      endTime: 0,
      memorySnapshots: []
    };

    const initialMemory = this.getMemoryUsage();
    metrics.memorySnapshots.push(initialMemory);

    try {
      // Simulate concurrent users with ramp-up
      await this.simulateRampUp(config, metrics);
      
      // Run main load test
      await this.runMainLoadTest(config, metrics);
      
      metrics.endTime = performance.now();
      const finalMemory = this.getMemoryUsage();
      metrics.memorySnapshots.push(finalMemory);

      return this.calculateResults(metrics, config, initialMemory, finalMemory);
      
    } catch (error) {
      console.error(`❌ Load test failed for ${config.testType}:`, error);
      throw error;
    }
  }

  private async simulateRampUp(config: LoadTestConfig, metrics: LoadTestMetrics): Promise<void> {
    const rampUpInterval = (config.rampUpTime * 1000) / config.concurrentUsers;
    
    for (let i = 0; i < config.concurrentUsers; i++) {
      setTimeout(() => {
        this.simulateUserActivity(config.testType, metrics);
      }, i * rampUpInterval);
    }
    
    // Wait for ramp-up to complete
    await new Promise(resolve => setTimeout(resolve, config.rampUpTime * 1000));
  }

  private async runMainLoadTest(config: LoadTestConfig, metrics: LoadTestMetrics): Promise<void> {
    const testDuration = config.duration * 1000;
    const startTime = performance.now();
    
    const testPromises: Promise<void>[] = [];
    
    // Create concurrent user sessions
    for (let i = 0; i < config.concurrentUsers; i++) {
      testPromises.push(this.simulateUserSession(config, metrics, testDuration));
    }
    
    await Promise.all(testPromises);
  }

  private async simulateUserSession(
    config: LoadTestConfig, 
    metrics: LoadTestMetrics, 
    duration: number
  ): Promise<void> {
    const sessionStart = performance.now();
    
    while (performance.now() - sessionStart < duration) {
      await this.simulateUserActivity(config.testType, metrics);
      
      // Random delay between activities (100-500ms)
      const delay = Math.random() * 400 + 100;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  private async simulateUserActivity(testType: string, metrics: LoadTestMetrics): Promise<void> {
    const activityStart = performance.now();
    
    try {
      // Simulate different types of activities based on test type
      switch (testType) {
        case 'component':
          await this.simulateComponentLoad();
          break;
        case 'data-processing':
          await this.simulateDataProcessing();
          break;
        case 'analytics-processing':
          await this.simulateAnalyticsProcessing();
          break;
        case 'analytics-concurrent':
          await this.simulateAnalyticsConcurrent();
          break;
        case 'ui-interaction':
          await this.simulateUIInteraction();
          break;
        case 'api':
          await this.simulateAPICall();
          break;
        case 'research-question':
          await this.simulateResearchQuestion();
          break;
        case 'context-processing':
          await this.simulateContextProcessing();
          break;
        default:
          await this.simulateGenericActivity();
      }
      
      const responseTime = performance.now() - activityStart;
      metrics.responseTime.push(responseTime);
      metrics.successCount++;
      
      // Take memory snapshot occasionally
      if (Math.random() < 0.1) {
        metrics.memorySnapshots.push(this.getMemoryUsage());
      }
      
    } catch (error) {
      metrics.errors++;
      const responseTime = performance.now() - activityStart;
      metrics.responseTime.push(responseTime);
    }
  }

  private async simulateComponentLoad(): Promise<void> {
    // Simulate React component mounting and rendering
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 10));
  }

  private async simulateDataProcessing(): Promise<void> {
    // Simulate data parsing and processing
    const dataSize = Math.floor(Math.random() * 1000) + 100;
    const processingTime = dataSize * 0.1; // Simulate processing time based on data size
    await new Promise(resolve => setTimeout(resolve, processingTime));
  }

  private async simulateAnalyticsProcessing(): Promise<void> {
    // Simulate analytics calculations
    const complexityFactor = Math.random() * 100 + 50;
    await new Promise(resolve => setTimeout(resolve, complexityFactor));
  }

  private async simulateAnalyticsConcurrent(): Promise<void> {
    // Simulate concurrent analytics processing
    const concurrentTasks = Math.floor(Math.random() * 3) + 2;
    const taskPromises = Array.from({ length: concurrentTasks }, () =>
      new Promise(resolve => setTimeout(resolve, Math.random() * 30 + 10))
    );
    await Promise.all(taskPromises);
  }

  private async simulateUIInteraction(): Promise<void> {
    // Simulate user interface interactions
    await new Promise(resolve => setTimeout(resolve, Math.random() * 30 + 5));
  }

  private async simulateAPICall(): Promise<void> {
    // Simulate API request/response
    await new Promise(resolve => setTimeout(resolve, Math.random() * 200 + 50));
  }

  private async simulateResearchQuestion(): Promise<void> {
    // Simulate research question processing
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 20));
  }

  private async simulateContextProcessing(): Promise<void> {
    // Simulate context processing
    await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 10));
  }

  private async simulateGenericActivity(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 10));
  }

  private calculateResults(
    metrics: LoadTestMetrics, 
    config: LoadTestConfig,
    initialMemory: number,
    finalMemory: number
  ): LoadTestResult {
    const totalRequests = metrics.successCount + metrics.errors;
    const duration = metrics.endTime - metrics.startTime;
    const averageResponseTime = metrics.responseTime.length > 0 
      ? metrics.responseTime.reduce((sum, time) => sum + time, 0) / metrics.responseTime.length 
      : 0;
    const errorRate = totalRequests > 0 ? (metrics.errors / totalRequests) * 100 : 0;
    const throughput = totalRequests / (duration / 1000); // requests per second
    const peakMemory = Math.max(...metrics.memorySnapshots);

    return {
      totalRequests,
      successfulRequests: metrics.successCount,
      failedRequests: metrics.errors,
      averageResponseTime,
      errorRate,
      throughput,
      memoryUsage: {
        initial: initialMemory,
        peak: peakMemory,
        final: finalMemory
      },
      duration
    };
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  }
}
