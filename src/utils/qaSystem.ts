
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

  async runFullQA(): Promise<QAReport> {
    console.log('🔍 Starting comprehensive QA testing with load and unit tests...');
    this.startTime = performance.now();
    this.qaTestSuites.clearResults();

    // Run all test suites
    await this.qaTestSuites.testComponents();
    await this.qaTestSuites.testDataFlow();
    await this.qaTestSuites.testUserExperience();
    await this.qaTestSuites.testDataIntegrity();
    await this.qaTestSuites.testAuthentication();
    await this.qaTestSuites.testRouting();
    await this.qaTestSuites.testSystemHealth();

    // Run load and unit tests
    await this.testRunner.runLoadTests();
    await this.testRunner.runUnitTests();
    
    // Performance and refactoring analysis
    const performanceMetrics = await this.performanceAnalyzer.analyzePerformance();
    const refactoringRecommendations = await this.refactoringAnalyzer.analyzeRefactoringNeeds();

    const report = this.generateReport(performanceMetrics, refactoringRecommendations);
    console.log('✅ QA testing completed with enhanced coverage:', report);
    
    // Auto-trigger refactoring analysis if needed
    await this.checkForAutoRefactoring(report);
    
    return report;
  }

  private async checkForAutoRefactoring(report: QAReport): Promise<void> {
    try {
      const suggestions = await this.autoRefactorSystem.analyzeCodebase();
      const autoTriggerSuggestions = await this.autoRefactorSystem.shouldAutoTriggerRefactoring(suggestions);
      
      if (autoTriggerSuggestions.length > 0) {
        console.log(`🔧 Auto-refactoring analysis complete: ${autoTriggerSuggestions.length} high-priority refactoring opportunities identified`);
        
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

  private generateReport(performanceMetrics: any, refactoringRecommendations: any): QAReport {
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
      performanceMetrics,
      refactoringRecommendations
    };
  }

  async autoFix(report: QAReport): Promise<void> {
    console.log('🔧 Starting intelligent auto-fix for failed tests...');
    
    const failedTests = report.results.filter(test => test.status === 'fail');
    
    for (const test of failedTests) {
      try {
        if (test.testName.includes('Load Test') || test.testName.includes('Unit Test')) {
          console.log(`⚠️ Skipping auto-fix for: ${test.testName} (requires manual intervention)`);
          continue;
        }
        
        await this.autoFixSystem.attemptIntelligentFix(test);
      } catch (error) {
        console.warn(`Failed to auto-fix test: ${test.testName}`, error);
      }
    }
    
    console.log('🔧 Auto-fix attempts completed');
  }
}

export const autoRunQA = (() => {
  let lastFeatureCount = 0;
  
  return async () => {
    const currentFeatureCount = document.querySelectorAll('[data-feature]').length;
    
    if (currentFeatureCount > lastFeatureCount) {
      console.log('🔍 New feature detected, running automatic QA...');
      const qaSystem = new AutoQASystem();
      const report = await qaSystem.runFullQA();
      
      console.log(`📊 QA Report Summary:
        Overall Status: ${report.overall.toUpperCase()}
        Tests: ${report.passed}/${report.totalTests} passed
        Performance: ${report.performanceMetrics.renderTime.toFixed(2)}ms render time
        Refactoring Needs: ${report.refactoringRecommendations.length} recommendations
      `);
      
      lastFeatureCount = currentFeatureCount;
      return report;
    }
    
    return null;
  };
})();
