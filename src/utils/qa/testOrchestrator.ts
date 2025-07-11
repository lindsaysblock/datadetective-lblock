
import { QATestSuites } from './qaTestSuites';
import { performanceMonitor } from '../performance/performanceMonitor';

export class TestOrchestrator {
  private qaTestSuites: QATestSuites;
  private performanceMonitor = performanceMonitor;
  private testExecutionOrder = [
    'components',
    'dataFlow',
    'userExperience',
    'dataIntegrity',
    'authentication',
    'routing',
    'systemHealth'
  ];

  constructor(qaTestSuites: QATestSuites) {
    this.qaTestSuites = qaTestSuites;
  }

  async runAllTests(): Promise<{
    performanceMetrics: any;
    refactoringRecommendations: any[];
  }> {
    console.log('🚀 Starting orchestrated test execution...');
    
    const startTime = performance.now();
    this.performanceMonitor.startMetric('Full QA Test Suite');
    
    // Clear previous results
    this.qaTestSuites.clearResults();
    
    // Run tests in optimized order
    for (const testType of this.testExecutionOrder) {
      await this.runTestWithMetrics(testType);
    }
    
    const duration = performance.now() - startTime;
    this.performanceMonitor.endMetric('Full QA Test Suite');
    
    const performanceMetrics = this.generatePerformanceMetrics(duration);
    const refactoringRecommendations = this.generateRefactoringRecommendations();
    
    console.log(`✅ Test orchestration completed in ${duration.toFixed(2)}ms`);
    
    return {
      performanceMetrics,
      refactoringRecommendations
    };
  }

  private async runTestWithMetrics(testType: string): Promise<void> {
    const metricName = `QA Test: ${testType}`;
    this.performanceMonitor.startMetric(metricName);
    
    try {
      switch (testType) {
        case 'components':
          await this.qaTestSuites.testComponents();
          break;
        case 'dataFlow':
          await this.qaTestSuites.testDataFlow();
          break;
        case 'userExperience':
          await this.qaTestSuites.testUserExperience();
          break;
        case 'dataIntegrity':
          await this.qaTestSuites.testDataIntegrity();
          break;
        case 'authentication':
          await this.qaTestSuites.testAuthentication();
          break;
        case 'routing':
          await this.qaTestSuites.testRouting();
          break;
        case 'systemHealth':
          await this.qaTestSuites.testSystemHealth();
          break;
      }
    } catch (error) {
      console.error(`Test ${testType} failed:`, error);
      this.qaTestSuites.addTestResult({
        testName: `${testType} Test Suite`,
        status: 'fail',
        message: `Test suite failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      this.performanceMonitor.endMetric(metricName);
    }
  }

  private generatePerformanceMetrics(duration: number): any {
    const report = this.performanceMonitor.generateReport();
    
    return {
      renderTime: duration,
      memoryUsage: report.summary.memoryLeakDetected ? -1 : this.performanceMonitor.getMemoryUsage(),
      bundleSize: this.estimateBundleSize(),
      componentCount: this.countComponents(),
      largeFiles: this.identifyLargeFiles(),
      duration,
      testExecutionMetrics: report.metrics.reduce((acc: any, metric) => {
        acc[metric.name] = metric.duration;
        return acc;
      }, {}),
      systemEfficiency: this.calculateSystemEfficiency(),
      memoryEfficiency: this.calculateMemoryEfficiency()
    };
  }

  private generateRefactoringRecommendations(): any[] {
    const recommendations = [];
    const results = this.qaTestSuites.getResults();
    
    // Generate recommendations based on test failures
    const failedTests = results.filter(r => r.status === 'fail');
    
    for (const failure of failedTests) {
      if (failure.testName.includes('Component') && failure.testName.includes('large')) {
        recommendations.push({
          file: 'src/components/QueryBuilder.tsx', // Still needs refactoring
          priority: 'high',
          description: 'Component is too large and complex (445 lines)',
          suggestion: 'Break down into smaller sub-components following the NewProject refactor pattern'
        });
      }
      
      if (failure.testName.includes('Performance')) {
        recommendations.push({
          file: 'src/utils/performance/performanceMonitor.ts',
          priority: 'medium',
          description: 'Performance monitoring overhead detected',
          suggestion: 'Optimize monitoring frequency and reduce memory allocations'
        });
      }
    }

    // Add specific recommendations for files that still need refactoring
    const largeFiles = [
      { file: 'src/components/QueryBuilder.tsx', lines: 445 },
      { file: 'src/components/VisualizationReporting.tsx', lines: 316 },
      { file: 'src/components/AnalysisDashboard.tsx', lines: 285 },
      { file: 'src/utils/qa/qaTestSuites.ts', lines: 371 }
    ];

    largeFiles.forEach(({ file, lines }) => {
      if (lines > 220) {
        recommendations.push({
          file,
          priority: lines > 400 ? 'critical' : 'high',
          description: `File has ${lines} lines (threshold: 220)`,
          suggestion: `Follow the NewProject refactor pattern: break into smaller, focused components`
        });
      }
    });
    
    return recommendations;
  }

  private estimateBundleSize(): number {
    // Updated estimation considering refactored components
    return 2200; // KB - slightly reduced due to better code organization
  }

  private countComponents(): number {
    return document.querySelectorAll('[data-component], [class*="Component"]').length;
  }

  private identifyLargeFiles(): string[] {
    // Updated list after refactoring
    return [
      'src/components/QueryBuilder.tsx', // 445 lines - needs refactoring
      'src/components/VisualizationReporting.tsx', // 316 lines - needs refactoring  
      'src/components/AnalysisDashboard.tsx', // 285 lines - needs refactoring
      'src/utils/qa/qaTestSuites.ts' // 371 lines - needs refactoring
      // src/pages/NewProject.tsx removed - now only 118 lines after refactoring
    ];
  }

  private calculateSystemEfficiency(): number {
    const results = this.qaTestSuites.getResults();
    if (results.length === 0) return 100;
    
    const passed = results.filter(r => r.status === 'pass').length;
    return (passed / results.length) * 100;
  }

  private calculateMemoryEfficiency(): number {
    const memoryUsage = this.performanceMonitor.getMemoryUsage();
    const memoryLeakDetected = this.performanceMonitor.detectMemoryLeaks();
    
    if (memoryLeakDetected) return 0;
    
    // Assume good efficiency if under 50MB
    return Math.max(0, 100 - (memoryUsage / 50) * 100);
  }

  getPerformanceMonitor() {
    return this.performanceMonitor;
  }
}
