
export interface LoadTestConfig {
  concurrentUsers: number;
  duration: number;
  rampUpTime: number;
  testType: 'component' | 'data-processing' | 'ui-interaction' | 'api' | 'research-question' | 'context-processing' | 'analytics-processing' | 'analytics-concurrent';
}

export interface LoadTestResult {
  testType: string;
  duration: number;
  concurrentUsers: number;
  averageResponseTime: number;
  errorRate: number;
  throughput: number;
  memoryUsage: {
    initial: number;
    peak: number;
    final: number;
  };
  cpuUsage: number;
  successfulRequests: number;
  failedRequests: number;
  config: LoadTestConfig;
  results: TestExecutionResult[];
  success: boolean;
  error?: string;
  timestamp: Date;
}

export interface TestExecutionResult {
  success: boolean;
  responseTime: number;
  error?: string;
}

export interface LoadTestMetrics {
  timestamp: number;
  responseTime: number;
  success: boolean;
  memoryUsage: number;
  cpuUsage: number;
}
