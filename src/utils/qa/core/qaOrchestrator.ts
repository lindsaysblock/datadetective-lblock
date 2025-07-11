import { QAReport } from '../types';
import { QATestSuites } from '../qaTestSuites';
import { TestOrchestrator } from '../testOrchestrator';
import { EnhancedQASystem } from '../enhancedQASystem';
import { PerformanceOptimizer } from '../performance/performanceOptimizer';
import { TestRunner } from '../testRunner';

export class QAOrchestrator {
  private qaTestSuites: QATestSuites;
  private testOrchestrator: TestOrchestrator;
  private enhancedQASystem = new EnhancedQASystem();
  private performanceOptimizer = new PerformanceOptimizer();
  private useEnhancedMode: boolean = true;

  constructor() {
    const testRunner = new TestRunner();
    this.qaTestSuites = new QATestSuites(testRunner);
    this.testOrchestrator = new TestOrchestrator(this.qaTestSuites);
  }

  async runFullQA(): Promise<QAReport> {
    console.log('🔍 Starting QA testing with enhanced dynamic analysis...');

    try {
      if (this.useEnhancedMode) {
        console.log('🚀 Using Enhanced QA System with dynamic codebase analysis');
        const enhancedReport = await this.enhancedQASystem.runEnhancedQA();
        return enhancedReport;
      } else {
        console.log('📊 Using Legacy QA System');
        return await this.runLegacyQA();
      }
    } catch (error) {
      console.error('❌ QA system encountered an error:', error);
      
      if (this.useEnhancedMode) {
        console.log('🔄 Enhanced QA failed, falling back to legacy system...');
        try {
          return await this.runLegacyQA();
        } catch (legacyError) {
          return this.generateErrorReport(legacyError);
        }
      } else {
        return this.generateErrorReport(error);
      }
    }
  }

  private async runLegacyQA(): Promise<QAReport> {
    const { performanceMetrics, refactoringRecommendations } = await this.testOrchestrator.runAllTests();
    const report = this.generateEnhancedReport(performanceMetrics, refactoringRecommendations);
    
    console.log('✅ Legacy QA testing completed:', report);
    return report;
  }

  private generateEnhancedReport(performanceMetrics: any, refactoringRecommendations: any): QAReport {
    const results = this.qaTestSuites.getResults();
    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;
    const warnings = results.filter(r => r.status === 'warning').length;

    const overall = failed > 0 ? 'fail' : warnings > 0 ? 'warning' : 'pass';

    const enhancedMetrics = {
      ...performanceMetrics,
      testExecutionMetrics: Object.fromEntries(this.performanceOptimizer.getMetrics()),
      systemEfficiency: this.performanceOptimizer.calculateSystemEfficiency(),
      memoryEfficiency: this.performanceOptimizer.calculateMemoryEfficiency(),
      enhancedMode: this.useEnhancedMode
    };

    return {
      overall,
      timestamp: new Date(),
      totalTests: results.length,
      passed,
      failed,
      warnings,
      results,
      performanceMetrics: enhancedMetrics,
      refactoringRecommendations
    };
  }

  private generateErrorReport(error: any): QAReport {
    return {
      overall: 'fail',
      timestamp: new Date(),
      totalTests: 0,
      passed: 0,
      failed: 1,
      warnings: 0,
      results: [{
        testName: 'QA System Error',
        status: 'fail',
        message: `QA system failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        suggestions: ['Check system resources', 'Review error logs', 'Restart QA system']
      }],
      performanceMetrics: {
        renderTime: 0,
        memoryUsage: 0,
        bundleSize: 0,
        componentCount: 0,
        largeFiles: []
      },
      refactoringRecommendations: []
    };
  }

  enableEnhancedMode(): void {
    this.useEnhancedMode = true;
    console.log('🚀 Enhanced QA mode enabled - dynamic analysis activated');
  }

  disableEnhancedMode(): void {
    this.useEnhancedMode = false;
    console.log('📊 Enhanced QA mode disabled - using legacy system');
  }

  isEnhancedModeEnabled(): boolean {
    return this.useEnhancedMode;
  }
}
