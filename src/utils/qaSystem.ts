
import { QAReport } from './qa/types';
import { QATestSuites } from './qa/qaTestSuites';
import { AutoFixSystem } from './qa/autoFixSystem';
import { AutoRefactorSystem } from './qa/autoRefactorSystem';
import { TestOrchestrator } from './qa/testOrchestrator';

export * from './qa/types';

export class AutoQASystem {
  private qaTestSuites = new QATestSuites();
  private autoFixSystem = new AutoFixSystem();
  private autoRefactorSystem = new AutoRefactorSystem();
  private testOrchestrator = new TestOrchestrator(this.qaTestSuites);
  private startTime: number = 0;

  async runFullQA(): Promise<QAReport> {
    console.log('🔍 Starting comprehensive QA testing with enhanced performance monitoring...');
    this.startTime = performance.now();

    try {
      const { performanceMetrics, refactoringRecommendations } = await this.testOrchestrator.runAllTests();
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
    const performanceMonitor = this.testOrchestrator.getPerformanceMonitor();

    // Enhanced performance metrics with QA system insights
    const enhancedMetrics = {
      ...performanceMetrics,
      qaSystemDuration: totalDuration,
      testExecutionMetrics: Object.fromEntries(performanceMonitor.getMetrics()),
      systemEfficiency: performanceMonitor.calculateSystemEfficiency(),
      memoryEfficiency: performanceMonitor.calculateMemoryEfficiency()
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
