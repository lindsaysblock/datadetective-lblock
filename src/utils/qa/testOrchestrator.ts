import { QATestSuites } from './qaTestSuites';
import { performanceMonitor } from '../performance/performanceMonitor';

export class TestOrchestrator {
  private qaTestSuites: QATestSuites;
  private performanceMonitor = performanceMonitor;
  private testExecutionOrder = [
    'components',
    'dataFlow',
    'dataValidation',
    'columnIdentification',
    'analytics',
    'analyticsLoad',
    'analyticsPerformance',
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
    console.log('🚀 Starting enhanced orchestrated test execution...');
    
    const startTime = performance.now();
    this.performanceMonitor.startMetric('Full QA Test Suite');
    
    this.qaTestSuites.clearResults();
    
    for (const testType of this.testExecutionOrder) {
      await this.runTestWithMetrics(testType);
    }
    
    const duration = performance.now() - startTime;
    this.performanceMonitor.endMetric('Full QA Test Suite');
    
    const performanceMetrics = this.generatePerformanceMetrics(duration);
    const refactoringRecommendations = this.generateRefactoringRecommendations();
    
    console.log(`✅ Enhanced test orchestration completed in ${duration.toFixed(2)}ms`);
    
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
        case 'dataValidation':
          await this.qaTestSuites.testDataValidation();
          break;
        case 'columnIdentification':
          await this.qaTestSuites.testColumnIdentification();
          break;
        case 'analytics':
          await this.qaTestSuites.testAnalytics();
          break;
        case 'analyticsLoad':
          await this.qaTestSuites.testAnalyticsLoad();
          break;
        case 'analyticsPerformance':
          await this.qaTestSuites.testAnalyticsPerformance();
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
      memoryEfficiency: this.calculateMemoryEfficiency(),
      codeQualityScore: this.calculateCodeQualityScore()
    };
  }

  private generateRefactoringRecommendations(): any[] {
    const recommendations = [];
    const results = this.qaTestSuites.getResults();
    
    const failedTests = results.filter(r => r.status === 'fail');
    
    for (const failure of failedTests) {
      if (failure.testName.includes('Component') && failure.testName.includes('large')) {
        recommendations.push({
          file: 'src/components/QueryBuilder.tsx',
          priority: 'high',
          description: 'Component is too large and complex (445 lines)',
          suggestion: 'Break down into smaller sub-components following the refactor pattern'
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

    // Updated list after recent refactoring
    const largeFiles = [
      { file: 'src/components/QueryBuilder.tsx', lines: 445 },
      { file: 'src/components/VisualizationReporting.tsx', lines: 316 },
      { file: 'src/components/AnalysisDashboard.tsx', lines: 285 }
    ];

    largeFiles.forEach(({ file, lines }) => {
      if (lines > 220) {
        recommendations.push({
          file,
          priority: lines > 400 ? 'critical' : 'high',
          description: `File has ${lines} lines (threshold: 220)`,
          suggestion: `Break into smaller, focused components like we did with NewProjectContainer`
        });
      }
    });
    
    return recommendations;
  }

  private estimateBundleSize(): number {
    return 2100;
  }

  private countComponents(): number {
    return document.querySelectorAll('[data-component], [class*="Component"]').length;
  }

  private identifyLargeFiles(): string[] {
    return [
      'src/components/QueryBuilder.tsx',
      'src/components/VisualizationReporting.tsx', 
      'src/components/AnalysisDashboard.tsx'
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
    
    return Math.max(0, 100 - (memoryUsage / 50) * 100);
  }

  private calculateCodeQualityScore(): number {
    const results = this.qaTestSuites.getResults();
    if (results.length === 0) return 100;
    
    const passed = results.filter(r => r.status === 'pass').length;
    const warnings = results.filter(r => r.status === 'warning').length;
    const failed = results.filter(r => r.status === 'fail').length;
    
    const score = (passed * 1.0 + warnings * 0.7 + failed * 0.0) / results.length * 100;
    return Math.round(score);
  }

  getPerformanceMonitor() {
    return this.performanceMonitor;
  }
}
