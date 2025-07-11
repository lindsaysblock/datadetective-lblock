
export interface LoadTestConfig {
  concurrentUsers: number;
  duration: number; // seconds
  rampUpTime: number; // seconds
  testType: string;
}

export interface LoadTestResult {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  errorRate: number;
  throughput: number;
  memoryUsage: {
    initial: number;
    peak: number;
    final: number;
  };
  duration: number;
}

export interface LoadTestMetrics {
  responseTime: number[];
  errors: number;
  successCount: number;
  startTime: number;
  endTime: number;
  memorySnapshots: number[];
}
