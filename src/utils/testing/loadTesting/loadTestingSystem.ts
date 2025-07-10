
import { LoadTestConfig, LoadTestResult } from './types';
import { LoadTestSimulators } from './simulators';

export class LoadTestingSystem {
  private testResults: LoadTestResult[] = [];
  private activeTests: Map<string, AbortController> = new Map();
  private simulators = new LoadTestSimulators();

  async runLoadTest(config: LoadTestConfig): Promise<LoadTestResult> {
    const testId = `load-test-${Date.now()}`;
    const controller = new AbortController();
    this.activeTests.set(testId, controller);

    const startTime = new Date();
    let totalRequests = 0;
    let successfulRequests = 0;
    let failedRequests = 0;
    const responseTimes: number[] = [];
    const memoryReadings: number[] = [];
    const cpuReadings: number[] = [];

    console.log(`🚀 Starting load test: ${testId}`, config);

    try {
      const initialMemory = this.getMemoryUsage();
      memoryReadings.push(initialMemory);

      const userPromises: Promise<void>[] = [];
      
      for (let user = 0; user < config.concurrentUsers; user++) {
        const userDelay = (config.rampUpTime * 1000 * user) / config.concurrentUsers;
        
        userPromises.push(
          this.simulateUser(
            config,
            userDelay,
            controller.signal,
            (success, responseTime) => {
              totalRequests++;
              if (success) {
                successfulRequests++;
              } else {
                failedRequests++;
              }
              responseTimes.push(responseTime);
            },
            () => {
              memoryReadings.push(this.getMemoryUsage());
              cpuReadings.push(this.getCPUUsage());
            }
          )
        );
      }

      await Promise.allSettled(userPromises);

    } catch (error) {
      console.error('Load test error:', error);
    } finally {
      this.activeTests.delete(testId);
    }

    const endTime = new Date();
    const duration = (endTime.getTime() - startTime.getTime()) / 1000;

    const result: LoadTestResult = {
      testId,
      config,
      startTime,
      endTime,
      totalRequests,
      successfulRequests,
      failedRequests,
      averageResponseTime: responseTimes.length > 0 ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length : 0,
      maxResponseTime: responseTimes.length > 0 ? Math.max(...responseTimes) : 0,
      minResponseTime: responseTimes.length > 0 ? Math.min(...responseTimes) : 0,
      throughput: totalRequests / duration,
      errorRate: totalRequests > 0 ? (failedRequests / totalRequests) * 100 : 0,
      memoryUsage: {
        initial: memoryReadings[0] || 0,
        peak: memoryReadings.length > 0 ? Math.max(...memoryReadings) : 0,
        final: memoryReadings[memoryReadings.length - 1] || 0
      },
      cpuUtilization: cpuReadings
    };

    this.testResults.push(result);
    console.log('📊 Load test completed:', result);
    
    return result;
  }

  private async simulateUser(
    config: LoadTestConfig,
    delay: number,
    signal: AbortSignal,
    onRequest: (success: boolean, responseTime: number) => void,
    onMetrics: () => void
  ): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, delay));

    const endTime = Date.now() + (config.duration * 1000);

    while (Date.now() < endTime && !signal.aborted) {
      const requestStart = performance.now();
      
      try {
        switch (config.testType) {
          case 'component':
            await this.simulators.simulateComponentLoad();
            break;
          case 'data-processing':
            await this.simulators.simulateDataProcessing();
            break;
          case 'ui-interaction':
            await this.simulators.simulateUIInteraction();
            break;
          case 'api':
            await this.simulators.simulateAPICall();
            break;
        }

        const responseTime = performance.now() - requestStart;
        onRequest(true, responseTime);
        
      } catch (error) {
        const responseTime = performance.now() - requestStart;
        onRequest(false, responseTime);
      }

      onMetrics();
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
    }
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024;
    }
    return 0;
  }

  private getCPUUsage(): number {
    const start = performance.now();
    for (let i = 0; i < 100000; i++) {
      Math.random();
    }
    const duration = performance.now() - start;
    return Math.min(duration / 10, 100);
  }

  stopTest(testId: string): void {
    const controller = this.activeTests.get(testId);
    if (controller) {
      controller.abort();
      this.activeTests.delete(testId);
      console.log(`🛑 Stopped load test: ${testId}`);
    }
  }

  getTestResults(): LoadTestResult[] {
    return [...this.testResults];
  }

  clearResults(): void {
    this.testResults = [];
  }
}
