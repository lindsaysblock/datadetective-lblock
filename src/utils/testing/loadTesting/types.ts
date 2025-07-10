
export interface LoadTestConfig {
  concurrentUsers: number;
  duration: number;
  rampUpTime: number;
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
  throughput: number;
  errorRate: number;
  memoryUsage: {
    initial: number;
    peak: number;
    final: number;
  };
  cpuUtilization: number[];
}
