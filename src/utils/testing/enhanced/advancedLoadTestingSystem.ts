/**
 * Advanced Load Testing Infrastructure
 * Comprehensive stress testing for large datasets and concurrent users
 */

import { UnitTestResult } from '../../testing/types';

export interface LoadTestScenario {
  name: string;
  type: 'data-volume' | 'concurrent-users' | 'stress' | 'endurance' | 'spike';
  duration: number; // seconds
  parameters: {
    users?: number;
    dataSize?: number; // MB
    requestsPerSecond?: number;
    complexity?: 'low' | 'medium' | 'high';
  };
  successCriteria: {
    maxResponseTime: number; // ms
    minSuccessRate: number; // percentage
    maxMemoryUsage: number; // MB
    maxCPUUsage: number; // percentage
  };
}

export interface LoadTestResult {
  scenario: string;
  status: 'pass' | 'fail' | 'warning';
  duration: number;
  metrics: {
    averageResponseTime: number;
    maxResponseTime: number;
    minResponseTime: number;
    successRate: number;
    errorRate: number;
    memoryUsage: number;
    cpuUsage: number;
    throughput: number; // operations per second
  };
  errors: string[];
  recommendations: string[];
}

export class AdvancedLoadTestingSystem {
  private readonly testScenarios: LoadTestScenario[] = [
    // Data Volume Tests
    {
      name: 'Large CSV Processing (10MB)',
      type: 'data-volume',
      duration: 30,
      parameters: {
        dataSize: 10,
        complexity: 'medium'
      },
      successCriteria: {
        maxResponseTime: 5000,
        minSuccessRate: 95,
        maxMemoryUsage: 100,
        maxCPUUsage: 80
      }
    },
    {
      name: 'Massive Dataset Analysis (50MB)',
      type: 'data-volume',
      duration: 60,
      parameters: {
        dataSize: 50,
        complexity: 'high'
      },
      successCriteria: {
        maxResponseTime: 15000,
        minSuccessRate: 90,
        maxMemoryUsage: 200,
        maxCPUUsage: 90
      }
    },
    
    // Concurrent User Tests
    {
      name: '10 Concurrent Users Analysis',
      type: 'concurrent-users',
      duration: 45,
      parameters: {
        users: 10,
        requestsPerSecond: 5,
        complexity: 'medium'
      },
      successCriteria: {
        maxResponseTime: 3000,
        minSuccessRate: 95,
        maxMemoryUsage: 150,
        maxCPUUsage: 85
      }
    },
    {
      name: '50 Concurrent Users Stress Test',
      type: 'concurrent-users',
      duration: 60,
      parameters: {
        users: 50,
        requestsPerSecond: 20,
        complexity: 'high'
      },
      successCriteria: {
        maxResponseTime: 8000,
        minSuccessRate: 85,
        maxMemoryUsage: 300,
        maxCPUUsage: 95
      }
    },

    // Stress Tests
    {
      name: 'Memory Stress Test',
      type: 'stress',
      duration: 30,
      parameters: {
        dataSize: 25,
        users: 5,
        complexity: 'high'
      },
      successCriteria: {
        maxResponseTime: 10000,
        minSuccessRate: 80,
        maxMemoryUsage: 250,
        maxCPUUsage: 90
      }
    },
    {
      name: 'CPU Intensive Operations',
      type: 'stress',
      duration: 40,
      parameters: {
        requestsPerSecond: 50,
        complexity: 'high'
      },
      successCriteria: {
        maxResponseTime: 5000,
        minSuccessRate: 85,
        maxMemoryUsage: 150,
        maxCPUUsage: 95
      }
    },

    // Endurance Tests
    {
      name: 'Extended Analysis Session (5 minutes)',
      type: 'endurance',
      duration: 300,
      parameters: {
        users: 3,
        requestsPerSecond: 2,
        complexity: 'medium'
      },
      successCriteria: {
        maxResponseTime: 4000,
        minSuccessRate: 90,
        maxMemoryUsage: 200,
        maxCPUUsage: 80
      }
    },

    // Spike Tests
    {
      name: 'Traffic Spike Simulation',
      type: 'spike',
      duration: 45,
      parameters: {
        users: 25,
        requestsPerSecond: 30,
        complexity: 'medium'
      },
      successCriteria: {
        maxResponseTime: 6000,
        minSuccessRate: 80,
        maxMemoryUsage: 200,
        maxCPUUsage: 90
      }
    }
  ];

  async runAllLoadTests(): Promise<LoadTestResult[]> {
    console.log('🚀 Starting comprehensive load testing suite');
    
    const results: LoadTestResult[] = [];
    
    for (const scenario of this.testScenarios) {
      console.log(`⚡ Running load test: ${scenario.name}`);
      const result = await this.executeLoadTest(scenario);
      results.push(result);
      
      // Brief pause between tests to prevent system overload
      await this.waitForSystemStabilization();
    }

    return results;
  }

  async runTestsByType(type: LoadTestScenario['type']): Promise<LoadTestResult[]> {
    const scenarios = this.testScenarios.filter(s => s.type === type);
    console.log(`🎯 Running ${scenarios.length} ${type} load tests`);

    const results: LoadTestResult[] = [];
    
    for (const scenario of scenarios) {
      const result = await this.executeLoadTest(scenario);
      results.push(result);
      await this.waitForSystemStabilization();
    }

    return results;
  }

  async runQuickLoadTest(): Promise<LoadTestResult[]> {
    // Run a subset of critical tests for quick validation
    const quickTests = this.testScenarios.filter(s => 
      s.duration <= 45 && s.type !== 'endurance'
    ).slice(0, 4);

    console.log(`⚡ Running quick load test suite (${quickTests.length} tests)`);

    const results: LoadTestResult[] = [];
    
    for (const scenario of quickTests) {
      const result = await this.executeLoadTest(scenario);
      results.push(result);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Short pause
    }

    return results;
  }

  private async executeLoadTest(scenario: LoadTestScenario): Promise<LoadTestResult> {
    const startTime = performance.now();
    const metrics = {
      responseTimes: [] as number[],
      errors: [] as string[],
      memoryUsages: [] as number[],
      cpuUsages: [] as number[],
      successCount: 0,
      totalRequests: 0
    };

    try {
      await this.simulateLoadTestScenario(scenario, metrics);
      
      const duration = performance.now() - startTime;
      const result = this.calculateLoadTestResult(scenario, metrics, duration);
      
      console.log(`${result.status === 'pass' ? '✅' : '❌'} ${scenario.name}: ${result.status}`);
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      return {
        scenario: scenario.name,
        status: 'fail',
        duration,
        metrics: {
          averageResponseTime: 0,
          maxResponseTime: 0,
          minResponseTime: 0,
          successRate: 0,
          errorRate: 100,
          memoryUsage: 0,
          cpuUsage: 0,
          throughput: 0
        },
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        recommendations: ['Fix critical errors before retesting']
      };
    }
  }

  private async simulateLoadTestScenario(
    scenario: LoadTestScenario, 
    metrics: any
  ): Promise<void> {
    const { duration, parameters } = scenario;
    const iterations = Math.ceil((parameters.requestsPerSecond || 1) * duration);
    
    // Simulate load based on scenario type
    switch (scenario.type) {
      case 'data-volume':
        await this.simulateDataVolumeTest(scenario, metrics, iterations);
        break;
      case 'concurrent-users':
        await this.simulateConcurrentUserTest(scenario, metrics, iterations);
        break;
      case 'stress':
        await this.simulateStressTest(scenario, metrics, iterations);
        break;
      case 'endurance':
        await this.simulateEnduranceTest(scenario, metrics, iterations);
        break;
      case 'spike':
        await this.simulateSpikeTest(scenario, metrics, iterations);
        break;
    }
  }

  private async simulateDataVolumeTest(
    scenario: LoadTestScenario,
    metrics: any,
    iterations: number
  ): Promise<void> {
    const dataSize = scenario.parameters.dataSize || 1;
    
    for (let i = 0; i < iterations; i++) {
      const operationStart = performance.now();
      
      try {
        // Simulate large data processing
        await this.simulateDataProcessing(dataSize);
        
        const responseTime = performance.now() - operationStart;
        metrics.responseTimes.push(responseTime);
        metrics.successCount++;
        
        // Track memory and CPU
        metrics.memoryUsages.push(this.getCurrentMemoryUsage());
        metrics.cpuUsages.push(await this.estimateCPUUsage());
        
      } catch (error) {
        metrics.errors.push(error instanceof Error ? error.message : 'Data processing error');
      }
      
      metrics.totalRequests++;
      
      // Prevent browser freeze
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
  }

  private async simulateConcurrentUserTest(
    scenario: LoadTestScenario,
    metrics: any,
    iterations: number
  ): Promise<void> {
    const userCount = scenario.parameters.users || 1;
    const operationsPerUser = Math.ceil(iterations / userCount);
    
    // Simulate concurrent user operations
    const userPromises = Array.from({ length: userCount }, async (_, userIndex) => {
      for (let i = 0; i < operationsPerUser; i++) {
        const operationStart = performance.now();
        
        try {
          await this.simulateUserOperation(userIndex);
          
          const responseTime = performance.now() - operationStart;
          metrics.responseTimes.push(responseTime);
          metrics.successCount++;
          
        } catch (error) {
          metrics.errors.push(`User ${userIndex}: ${error instanceof Error ? error.message : 'Operation failed'}`);
        }
        
        metrics.totalRequests++;
        await new Promise(resolve => setTimeout(resolve, 50)); // Simulate user think time
      }
    });

    await Promise.all(userPromises);
  }

  private async simulateStressTest(
    scenario: LoadTestScenario,
    metrics: any,
    iterations: number
  ): Promise<void> {
    // Gradually increase load to stress the system
    const maxLoad = iterations;
    const loadIncrement = Math.ceil(maxLoad / 10);
    
    for (let load = loadIncrement; load <= maxLoad; load += loadIncrement) {
      const batchPromises = Array.from({ length: loadIncrement }, async () => {
        const operationStart = performance.now();
        
        try {
          await this.simulateStressOperation();
          
          const responseTime = performance.now() - operationStart;
          metrics.responseTimes.push(responseTime);
          metrics.successCount++;
          
        } catch (error) {
          metrics.errors.push(error instanceof Error ? error.message : 'Stress operation failed');
        }
        
        metrics.totalRequests++;
      });
      
      await Promise.all(batchPromises);
      
      // Monitor system health
      metrics.memoryUsages.push(this.getCurrentMemoryUsage());
      metrics.cpuUsages.push(await this.estimateCPUUsage());
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  private async simulateEnduranceTest(
    scenario: LoadTestScenario,
    metrics: any,
    iterations: number
  ): Promise<void> {
    const intervalMs = (scenario.duration * 1000) / iterations;
    
    for (let i = 0; i < iterations; i++) {
      const operationStart = performance.now();
      
      try {
        await this.simulateEnduranceOperation();
        
        const responseTime = performance.now() - operationStart;
        metrics.responseTimes.push(responseTime);
        metrics.successCount++;
        
        // Regular memory and CPU monitoring for endurance tests
        if (i % 10 === 0) {
          metrics.memoryUsages.push(this.getCurrentMemoryUsage());
          metrics.cpuUsages.push(await this.estimateCPUUsage());
        }
        
      } catch (error) {
        metrics.errors.push(error instanceof Error ? error.message : 'Endurance operation failed');
      }
      
      metrics.totalRequests++;
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }
  }

  private async simulateSpikeTest(
    scenario: LoadTestScenario,
    metrics: any,
    iterations: number
  ): Promise<void> {
    // Normal load for first 20%, spike for 40%, normal for remaining 40%
    const normalLoad = Math.ceil(iterations * 0.2);
    const spikeLoad = Math.ceil(iterations * 0.6);
    const finalLoad = iterations - normalLoad - spikeLoad;
    
    // Phase 1: Normal load
    await this.executeSpikePhase('normal', normalLoad, metrics);
    
    // Phase 2: Spike load
    await this.executeSpikePhase('spike', spikeLoad, metrics);
    
    // Phase 3: Return to normal
    await this.executeSpikePhase('normal', finalLoad, metrics);
  }

  private async executeSpikePhase(
    phase: 'normal' | 'spike',
    iterations: number,
    metrics: any
  ): Promise<void> {
    const concurrency = phase === 'spike' ? 10 : 2;
    const batchSize = Math.ceil(iterations / concurrency);
    
    for (let batch = 0; batch < concurrency; batch++) {
      const batchPromises = Array.from({ length: batchSize }, async () => {
        const operationStart = performance.now();
        
        try {
          await this.simulateSpikeOperation(phase);
          
          const responseTime = performance.now() - operationStart;
          metrics.responseTimes.push(responseTime);
          metrics.successCount++;
          
        } catch (error) {
          metrics.errors.push(error instanceof Error ? error.message : 'Spike operation failed');
        }
        
        metrics.totalRequests++;
      });
      
      await Promise.all(batchPromises);
      
      if (phase === 'spike') {
        metrics.memoryUsages.push(this.getCurrentMemoryUsage());
        metrics.cpuUsages.push(await this.estimateCPUUsage());
      }
    }
  }

  // Simulation methods for different operation types
  private async simulateDataProcessing(dataSizeMB: number): Promise<void> {
    // Simulate data processing based on size
    const processingTime = Math.max(100, dataSizeMB * 50);
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    // Simulate memory allocation
    const data = new Array(dataSizeMB * 1000).fill(0).map(() => Math.random());
    
    // Simulate processing
    data.forEach((value, index) => {
      if (index % 1000 === 0) {
        Math.sqrt(value * index);
      }
    });
  }

  private async simulateUserOperation(userIndex: number): Promise<void> {
    const operationTypes = ['analysis', 'upload', 'query', 'visualization'];
    const operation = operationTypes[userIndex % operationTypes.length];
    
    const baseTime = 200;
    const complexityMultiplier = Math.random() * 2 + 0.5;
    
    await new Promise(resolve => 
      setTimeout(resolve, baseTime * complexityMultiplier)
    );
  }

  private async simulateStressOperation(): Promise<void> {
    // Intensive computation to stress the system
    const iterations = 10000;
    let result = 0;
    
    for (let i = 0; i < iterations; i++) {
      result += Math.sqrt(i) * Math.sin(i) / Math.cos(i || 1);
    }
    
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  private async simulateEnduranceOperation(): Promise<void> {
    // Consistent moderate operation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Small memory allocation
    const data = new Array(1000).fill(0).map(() => Math.random());
    data.reduce((sum, val) => sum + val, 0);
  }

  private async simulateSpikeOperation(phase: 'normal' | 'spike'): Promise<void> {
    const intensity = phase === 'spike' ? 5 : 1;
    const processingTime = 50 * intensity;
    
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    if (phase === 'spike') {
      // More intensive computation during spike
      const data = new Array(5000).fill(0).map(() => Math.random());
      data.sort((a, b) => a - b);
    }
  }

  private calculateLoadTestResult(
    scenario: LoadTestScenario,
    metrics: any,
    duration: number
  ): LoadTestResult {
    const { responseTimes, errors, memoryUsages, cpuUsages, successCount, totalRequests } = metrics;
    
    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length 
      : 0;
    
    const maxResponseTime = Math.max(...responseTimes, 0);
    const minResponseTime = Math.min(...responseTimes, 0);
    const successRate = totalRequests > 0 ? (successCount / totalRequests) * 100 : 0;
    const errorRate = 100 - successRate;
    const averageMemoryUsage = memoryUsages.length > 0 
      ? memoryUsages.reduce((sum, usage) => sum + usage, 0) / memoryUsages.length 
      : 0;
    const averageCpuUsage = cpuUsages.length > 0 
      ? cpuUsages.reduce((sum, usage) => sum + usage, 0) / cpuUsages.length 
      : 0;
    const throughput = totalRequests / (duration / 1000);

    // Determine test status
    const criteria = scenario.successCriteria;
    const passed = 
      averageResponseTime <= criteria.maxResponseTime &&
      successRate >= criteria.minSuccessRate &&
      averageMemoryUsage <= criteria.maxMemoryUsage &&
      averageCpuUsage <= criteria.maxCPUUsage;

    const status = passed ? 'pass' : (successRate >= criteria.minSuccessRate * 0.8 ? 'warning' : 'fail');

    // Generate recommendations
    const recommendations: string[] = [];
    if (averageResponseTime > criteria.maxResponseTime) {
      recommendations.push('Optimize response time through caching and code optimization');
    }
    if (successRate < criteria.minSuccessRate) {
      recommendations.push('Improve error handling and system reliability');
    }
    if (averageMemoryUsage > criteria.maxMemoryUsage) {
      recommendations.push('Implement memory optimization and garbage collection');
    }
    if (averageCpuUsage > criteria.maxCPUUsage) {
      recommendations.push('Optimize CPU-intensive operations and use Web Workers');
    }

    return {
      scenario: scenario.name,
      status,
      duration,
      metrics: {
        averageResponseTime,
        maxResponseTime,
        minResponseTime,
        successRate,
        errorRate,
        memoryUsage: averageMemoryUsage,
        cpuUsage: averageCpuUsage,
        throughput
      },
      errors,
      recommendations
    };
  }

  private getCurrentMemoryUsage(): number {
    if ('memory' in performance && (performance as any).memory) {
      return (performance as any).memory.usedJSHeapSize / (1024 * 1024);
    }
    return 0;
  }

  private async estimateCPUUsage(): Promise<number> {
    // Simple CPU usage estimation
    const start = performance.now();
    let iterations = 0;
    
    while (performance.now() - start < 16.67) { // 60fps frame budget
      iterations++;
      Math.random();
    }
    
    const actualTime = performance.now() - start;
    return Math.min(100, (actualTime / 16.67) * 100);
  }

  private async waitForSystemStabilization(): Promise<void> {
    // Wait for system to stabilize between tests
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Force garbage collection if available
    if ('gc' in window && typeof (window as any).gc === 'function') {
      (window as any).gc();
    }
  }

  getTestScenarios(): LoadTestScenario[] {
    return [...this.testScenarios];
  }

  getTestStatistics(): {
    totalTests: number;
    byType: Record<string, number>;
    estimatedDuration: number;
  } {
    const byType = this.testScenarios.reduce((acc, test) => {
      acc[test.type] = (acc[test.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const estimatedDuration = this.testScenarios.reduce((total, test) => {
      return total + test.duration;
    }, 0);

    return {
      totalTests: this.testScenarios.length,
      byType,
      estimatedDuration
    };
  }
}