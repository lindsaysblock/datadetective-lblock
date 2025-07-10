
export interface LoadTestConfig {
  concurrentUsers: number;
  duration: number; // in seconds
  rampUpTime: number; // in seconds
  testType: 'component' | 'data-processing' | 'ui-interaction' | 'api';
}

export interface LoadTestResult {
  testId: string;
  config: LoadTestConfig;
  startTime: Date;
  endTime: Date;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  maxResponseTime: number;
  minResponseTime: number;
  throughput: number; // requests per second
  errorRate: number;
  memoryUsage: {
    initial: number;
    peak: number;
    final: number;
  };
  cpuUtilization: number[];
}

export class LoadTestingSystem {
  private testResults: LoadTestResult[] = [];
  private activeTests: Map<string, AbortController> = new Map();

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
      // Initial memory reading
      const initialMemory = this.getMemoryUsage();
      memoryReadings.push(initialMemory);

      // Create user simulation promises
      const userPromises: Promise<void>[] = [];
      
      for (let user = 0; user < config.concurrentUsers; user++) {
        const userDelay = (config.rampUpTime * 1000 * user) / config.concurrentUsers;
        
        userPromises.push(
          this.simulateUser(
            testId,
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

      // Wait for all users to complete or timeout
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
    testId: string,
    config: LoadTestConfig,
    delay: number,
    signal: AbortSignal,
    onRequest: (success: boolean, responseTime: number) => void,
    onMetrics: () => void
  ): Promise<void> {
    // Wait for ramp-up delay
    await new Promise(resolve => setTimeout(resolve, delay));

    const endTime = Date.now() + (config.duration * 1000);

    while (Date.now() < endTime && !signal.aborted) {
      const requestStart = performance.now();
      
      try {
        // Simulate different types of load based on test type
        switch (config.testType) {
          case 'component':
            await this.simulateComponentLoad();
            break;
          case 'data-processing':
            await this.simulateDataProcessing();
            break;
          case 'ui-interaction':
            await this.simulateUIInteraction();
            break;
          case 'api':
            await this.simulateAPICall();
            break;
        }

        const responseTime = performance.now() - requestStart;
        onRequest(true, responseTime);
        
      } catch (error) {
        const responseTime = performance.now() - requestStart;
        onRequest(false, responseTime);
      }

      onMetrics();

      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
    }
  }

  private async simulateComponentLoad(): Promise<void> {
    // Simulate component rendering load
    const elements = Array.from({ length: 100 }, (_, i) => {
      const div = document.createElement('div');
      div.textContent = `Load test element ${i}`;
      div.style.display = 'none';
      return div;
    });

    elements.forEach(el => document.body.appendChild(el));
    
    // Force reflow
    elements.forEach(el => el.getBoundingClientRect());
    
    // Cleanup
    elements.forEach(el => el.remove());
  }

  private async simulateDataProcessing(): Promise<void> {
    // Simulate data processing load
    const data = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      value: Math.random(),
      timestamp: new Date().toISOString()
    }));

    // Process data (sorting, filtering, mapping)
    data
      .filter(item => item.value > 0.5)
      .sort((a, b) => b.value - a.value)
      .map(item => ({ ...item, processed: true }));
  }

  private async simulateUIInteraction(): Promise<void> {
    // Simulate UI interactions
    const button = document.createElement('button');
    button.style.display = 'none';
    document.body.appendChild(button);

    // Simulate click events
    for (let i = 0; i < 10; i++) {
      button.click();
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    button.remove();
  }

  private async simulateAPICall(): Promise<void> {
    // Simulate API call with fetch
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch('/api/health-check', {
        signal: controller.signal,
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        throw error;
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  }

  private getCPUUsage(): number {
    // Simplified CPU usage estimation based on performance timing
    const start = performance.now();
    for (let i = 0; i < 100000; i++) {
      Math.random();
    }
    const duration = performance.now() - start;
    return Math.min(duration / 10, 100); // Normalize to 0-100%
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
