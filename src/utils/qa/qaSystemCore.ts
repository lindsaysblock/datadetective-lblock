
/**
 * QA System Core
 * Automated quality assurance orchestration with auto-fix capabilities
 * Refactored for consistency and maintainability
 */

import { QAReport } from './types';
import { AutoFixSystem } from './autoFixSystem';
import { AutoRefactorSystem } from './autoRefactorSystem';
import { QAOrchestrator } from './core/qaOrchestrator';

const MAX_DISPLAY_SUGGESTIONS = 2;
const SUGGESTION_PRIORITY_LEVELS = ['high', 'medium', 'low'] as const;

/**
 * Main QA system orchestrator that coordinates quality assurance processes
 */
export class AutoQASystem {
  private qaOrchestrator = new QAOrchestrator();
  private autoFixSystem = new AutoFixSystem();
  private autoRefactorSystem = new AutoRefactorSystem();

  /**
   * Executes full quality assurance workflow
   */
  async runFullQA(): Promise<QAReport> {
    const report = await this.qaOrchestrator.runFullQA();
    await this.checkForAutoRefactoring(report);
    return report;
  }

  /**
   * Analyzes codebase for refactoring opportunities
   */
  private async checkForAutoRefactoring(report: QAReport): Promise<void> {
    try {
      const suggestions = await this.autoRefactorSystem.analyzeCodebase();
      const autoTriggerSuggestions = await this.autoRefactorSystem.shouldAutoTriggerRefactoring(suggestions);
      
      if (autoTriggerSuggestions.length > 0) {
        console.log(`🔧 Auto-refactoring analysis complete: ${autoTriggerSuggestions.length} high-priority refactoring opportunities identified`);
        
        autoTriggerSuggestions.forEach(suggestion => {
          console.log(`📁 ${suggestion.file}: ${suggestion.reason}`);
          console.log(`   Priority: ${suggestion.priority.toUpperCase()}`);
          console.log(`   Actions: ${suggestion.suggestedActions.slice(0, MAX_DISPLAY_SUGGESTIONS).join(', ')}`);
        });
        
        this.dispatchRefactoringSuggestions(autoTriggerSuggestions);
      }
    } catch (error) {
      console.warn('Auto-refactoring analysis failed:', error);
    }
  }

  /**
   * Dispatches refactoring suggestions as custom event
   */
  private dispatchRefactoringSuggestions(suggestions: any[]): void {
    const event = new CustomEvent('qa-auto-refactor-suggestions', {
      detail: { suggestions }
    });
    window.dispatchEvent(event);
  }

  /**
   * Attempts to automatically fix failed tests
   */
  async autoFix(report: QAReport): Promise<void> {
    console.log('🔧 Starting intelligent auto-fix for failed tests...');
    
    const failedTests = report.results.filter(test => test.status === 'fail');
    let fixAttempts = 0;
    let successfulFixes = 0;
    
    for (const test of failedTests) {
      try {
        fixAttempts++;
        
        if (this.shouldSkipAutoFix(test.testName)) {
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

  /**
   * Determines if a test should be skipped for auto-fix
   */
  private shouldSkipAutoFix(testName: string): boolean {
    const skipPatterns = ['Load Test', 'Unit Test', 'Integration Test'];
    return skipPatterns.some(pattern => testName.includes(pattern));
  }

  /**
   * Enables enhanced QA mode with additional analysis
   */
  enableEnhancedMode(): void {
    this.qaOrchestrator.enableEnhancedMode();
  }

  /**
   * Disables enhanced QA mode
   */
  disableEnhancedMode(): void {
    this.qaOrchestrator.disableEnhancedMode();
  }

  /**
   * Checks if enhanced mode is currently enabled
   */
  isEnhancedModeEnabled(): boolean {
    return this.qaOrchestrator.isEnhancedModeEnabled();
  }
}
