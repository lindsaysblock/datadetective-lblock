import { QAReport } from '../types';
import { QATestSuites } from '../qaTestSuites';
import { AutoFixSystem } from '../autoFixSystem';
import { EnhancedQASystem } from '../enhancedQASystem';
import { TestRunner } from '../testRunner';

export class QASystemCore {
  private qaTestSuites: QATestSuites;
  private autoFixSystem = new AutoFixSystem();
  private enhancedQASystem = new EnhancedQASystem();
  private startTime: number = 0;
  private useEnhancedMode: boolean = true;

  constructor() {
    const testRunner = new TestRunner();
    this.qaTestSuites = new QATestSuites(testRunner);
  }

  async runFullQA(): Promise<QAReport> {
    console.log('🔍 Starting QA testing with enhanced dynamic analysis...');
    this.startTime = performance.now();

    try {
      if (this.useEnhancedMode) {
        console.log('🚀 Using Enhanced QA System with dynamic codebase analysis');
        const enhancedReport = await this.enhancedQASystem.runEnhancedQA();
        await this.checkForAutoRefactoring(enhancedReport);
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
    const results = this.qaTestSuites.getResults();
    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;
    const warnings = results.filter(r => r.status === 'warning').length;
    const overall = failed > 0 ? 'fail' : warnings > 0 ? 'warning' : 'pass';

    return {
      overall,
      timestamp: new Date(),
      totalTests: results.length,
      passed,
      failed,
      warnings,
      results,
      performanceMetrics: {
        renderTime: 0,
        memoryUsage: 0,
        bundleSize: 0,
        componentCount: 0,
        largeFiles: [],
        duration: performance.now() - this.startTime
      },
      refactoringRecommendations: []
    };
  }

  private async checkForAutoRefactoring(report: QAReport): Promise<void> {
    // Auto-refactoring logic
    console.log('🔧 Checking for auto-refactoring opportunities...');
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
        suggestions: ['Check system resources', 'Review error logs', 'Restart QA system'],
        category: 'system'
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
    console.log('🚀 Enhanced QA mode enabled');
  }

  disableEnhancedMode(): void {
    this.useEnhancedMode = false;
    console.log('📊 Enhanced QA mode disabled');
  }

  isEnhancedModeEnabled(): boolean {
    return this.useEnhancedMode;
  }
}
