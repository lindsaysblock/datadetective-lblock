
import { QAReport } from './qa/types';
import { QATestSuites } from './qa/qaTestSuites';
import { AutoFixSystem } from './qa/autoFixSystem';
import { AutoRefactorSystem } from './qa/autoRefactorSystem';
import { PerformanceAnalyzer } from './qa/performanceAnalyzer';
import { RefactoringAnalyzer } from './qa/refactoringAnalyzer';
import { TestRunner } from './qa/testRunner';

export * from './qa/types';

export class AutoQASystem {
  private qaTestSuites = new QATestSuites();
  private autoFixSystem = new AutoFixSystem();
  private autoRefactorSystem = new AutoRefactorSystem();
  private performanceAnalyzer = new PerformanceAnalyzer(this.qaTestSuites);
  private refactoringAnalyzer = new RefactoringAnalyzer(this.qaTestSuites);
  private testRunner = new TestRunner(this.qaTestSuites);
  private startTime: number = 0;
  private performanceMetrics: Map<string, number> = new Map();

  async runFullQA(): Promise<QAReport> {
    console.log('🔍 Starting comprehensive QA testing with enhanced performance monitoring...');
    this.startTime = performance.now();
    this.qaTestSuites.clearResults();
    this.performanceMetrics.clear();

    try {
      // Run all test suites with performance tracking
      await this.runTestWithMetrics('Components', () => this.qaTestSuites.testComponents());
      await this.runTestWithMetrics('Data Flow', () => this.qaTestSuites.testDataFlow());
      await this.runTestWithMetrics('User Experience', () => this.qaTestSuites.testUserExperience());
      await this.runTestWithMetrics('Data Integrity', () => this.qaTestSuites.testDataIntegrity());
      await this.runTestWithMetrics('Authentication', () => this.qaTestSuites.testAuthentication());
      await this.runTestWithMetrics('Routing', () => this.qaTestSuites.testRouting());
      await this.runTestWithMetrics('System Health', () => this.qaTestSuites.testSystemHealth());

      // Run load and unit tests with enhanced monitoring
      await this.runTestWithMetrics('Load Tests', () => this.testRunner.runLoadTests());
      await this.runTestWithMetrics('Unit Tests', () => this.testRunner.runUnitTests());
      
      // Performance and refactoring analysis
      const performanceMetrics = await this.runTestWithMetrics('Performance Analysis', 
        () => this.performanceAnalyzer.analyzePerformance()
      );
      
      const refactoringRecommendations = await this.runTestWithMetrics('Refactoring Analysis',
        () => this.refactoringAnalyzer.analyzeRefactoringNeeds()
      );

      const report = this.generateEnhancedReport(performanceMetrics, refactoringRecommendations);
      console.log('✅ QA testing completed with comprehensive coverage:', report);
      
      // Auto-trigger refactoring analysis if needed
      await this.checkForAutoRefactoring(report);
      
      return report;
    } catch (error) {
      console.error('❌ QA system encountered an error:', error);
      
      // Generate error report
      const errorReport: QAReport = {
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
      
      return errorReport;
    }
  }

  private async runTestWithMetrics<T>(testName: string, testFn: () => Promise<T>): Promise<T> {
    const startTime = performance.now();
    const startMemory = this.getMemoryUsage();
    
    try {
      const result = await testFn();
      const endTime = performance.now();
      const endMemory = this.getMemoryUsage();
      
      const duration = endTime - startTime;
      const memoryDelta = endMemory - startMemory;
      
      this.performanceMetrics.set(`${testName}_duration`, duration);
      this.performanceMetrics.set(`${testName}_memory`, memoryDelta);
      
      console.log(`⏱️ ${testName}: ${duration.toFixed(2)}ms, Memory: ${memoryDelta > 0 ? '+' : ''}${memoryDelta.toFixed(2)}MB`);
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      this.performanceMetrics.set(`${testName}_duration`, duration);
      this.performanceMetrics.set(`${testName}_error`, 1);
      
      console.error(`❌ ${testName} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024;
    }
    return 0;
  }

  private async checkForAutoRefactoring(report: QAReport): Promise<void> {
    try {
      const suggestions = await this.autoRefactorSystem.analyzeCodebase();
      const autoTriggerSuggestions = await this.autoRefactorSystem.shouldAutoTriggerRefactoring(suggestions);
      
      if (autoTriggerSuggestions.length > 0) {
        console.log(`🔧 Auto-refactoring analysis complete: ${autoTriggerSuggestions.length} high-priority refactoring opportunities identified`);
        
        // Log detailed suggestions
        autoTriggerSuggestions.forEach(suggestion => {
          console.log(`📁 ${suggestion.file}: ${suggestion.reason}`);
          console.log(`   Priority: ${suggestion.priority.toUpperCase()}`);
          console.log(`   Actions: ${suggestion.suggestedActions.slice(0, 2).join(', ')}`);
        });
        
        // Dispatch custom event to trigger refactoring prompts in the UI
        const event = new CustomEvent('qa-auto-refactor-suggestions', {
          detail: { suggestions: autoTriggerSuggestions }
        });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.warn('Auto-refactoring analysis failed:', error);
    }
  }

  private generateEnhancedReport(performanceMetrics: any, refactoringRecommendations: any): QAReport {
    const results = this.qaTestSuites.getResults();
    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;
    const warnings = results.filter(r => r.status === 'warning').length;

    const overall = failed > 0 ? 'fail' : warnings > 0 ? 'warning' : 'pass';
    const totalDuration = performance.now() - this.startTime;

    // Enhanced performance metrics with QA system insights
    const enhancedMetrics = {
      ...performanceMetrics,
      qaSystemDuration: totalDuration,
      testExecutionMetrics: Object.fromEntries(this.performanceMetrics),
      systemEfficiency: this.calculateSystemEfficiency(),
      memoryEfficiency: this.calculateMemoryEfficiency()
    };

    console.log(`📊 QA System Performance Summary:`);
    console.log(`   Total Duration: ${totalDuration.toFixed(2)}ms`);
    console.log(`   System Efficiency: ${enhancedMetrics.systemEfficiency.toFixed(1)}%`);
    console.log(`   Memory Efficiency: ${enhancedMetrics.memoryEfficiency.toFixed(1)}%`);

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

  private calculateSystemEfficiency(): number {
    let efficiency = 100;
    
    // Penalize for slow test execution
    this.performanceMetrics.forEach((duration, testName) => {
      if (testName.endsWith('_duration')) {
        if (duration > 1000) efficiency -= 10; // Very slow
        else if (duration > 500) efficiency -= 5; // Slow
      }
    });
    
    // Penalize for errors
    this.performanceMetrics.forEach((value, testName) => {
      if (testName.endsWith('_error')) {
        efficiency -= 20; // Major penalty for errors
      }
    });
    
    return Math.max(0, efficiency);
  }

  private calculateMemoryEfficiency(): number {
    let efficiency = 100;
    let totalMemoryDelta = 0;
    let memoryTests = 0;
    
    this.performanceMetrics.forEach((memoryDelta, testName) => {
      if (testName.endsWith('_memory')) {
        totalMemoryDelta += memoryDelta;
        memoryTests++;
      }
    });
    
    if (memoryTests > 0) {
      const avgMemoryDelta = totalMemoryDelta / memoryTests;
      if (avgMemoryDelta > 50) efficiency -= 30; // High memory usage
      else if (avgMemoryDelta > 20) efficiency -= 15; // Moderate memory usage
      else if (avgMemoryDelta > 10) efficiency -= 5; // Low memory usage
    }
    
    return Math.max(0, efficiency);
  }

  async autoFix(report: QAReport): Promise<void> {
    console.log('🔧 Starting intelligent auto-fix for failed tests...');
    
    const failedTests = report.results.filter(test => test.status === 'fail');
    let fixAttempts = 0;
    let successfulFixes = 0;
    
    for (const test of failedTests) {
      try {
        fixAttempts++;
        
        if (test.testName.includes('Load Test') || test.testName.includes('Unit Test')) {
          console.log(`⚠️ Skipping auto-fix for: ${test.testName} (requires manual intervention)`);
          continue;
        }
        
        console.log(`🔧 Attempting fix for: ${test.testName}`);
        await this.autoFixSystem.attemptIntelligentFix(test);
        successfulFixes++;
        
      } catch (error) {
        console.warn(`Failed to auto-fix test: ${test.testName}`, error);
      }
    }
    
    console.log(`🔧 Auto-fix completed: ${successfulFixes}/${fixAttempts} successful fixes`);
  }
}

export const autoRunQA = (() => {
  let lastFeatureCount = 0;
  let qaRunCount = 0;
  
  return async () => {
    const currentFeatureCount = document.querySelectorAll('[data-feature]').length;
    
    if (currentFeatureCount > lastFeatureCount) {
      qaRunCount++;
      console.log(`🔍 New feature detected (run #${qaRunCount}), running automatic QA...`);
      
      const qaSystem = new AutoQASystem();
      const startTime = performance.now();
      const report = await qaSystem.runFullQA();
      const duration = performance.now() - startTime;
      
      console.log(`📊 QA Report Summary (Run #${qaRunCount}):`);
      console.log(`   Overall Status: ${report.overall.toUpperCase()}`);
      console.log(`   Tests: ${report.passed}/${report.totalTests} passed`);
      console.log(`   Performance: ${report.performanceMetrics.renderTime.toFixed(2)}ms render time`);
      console.log(`   QA Duration: ${duration.toFixed(2)}ms`);
      console.log(`   Refactoring Needs: ${report.refactoringRecommendations.length} recommendations`);
      console.log(`   System Efficiency: ${report.performanceMetrics.systemEfficiency?.toFixed(1) || 'N/A'}%`);
      
      lastFeatureCount = currentFeatureCount;
      return report;
    }
    
    return null;
  };
})();
