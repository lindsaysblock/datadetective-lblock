
import { QAReport } from './types';
import { AutoFixSystem } from './autoFixSystem';
import { AutoRefactorSystem } from './autoRefactorSystem';
import { QAOrchestrator } from './core/qaOrchestrator';

export class AutoQASystem {
  private qaOrchestrator = new QAOrchestrator();
  private autoFixSystem = new AutoFixSystem();
  private autoRefactorSystem = new AutoRefactorSystem();

  async runFullQA(): Promise<QAReport> {
    const report = await this.qaOrchestrator.runFullQA();
    await this.checkForAutoRefactoring(report);
    return report;
  }

  private async checkForAutoRefactoring(report: QAReport): Promise<void> {
    try {
      const suggestions = await this.autoRefactorSystem.analyzeCodebase();
      const autoTriggerSuggestions = await this.autoRefactorSystem.shouldAutoTriggerRefactoring(suggestions);
      
      if (autoTriggerSuggestions.length > 0) {
        console.log(`🔧 Auto-refactoring analysis complete: ${autoTriggerSuggestions.length} high-priority refactoring opportunities identified`);
        
        autoTriggerSuggestions.forEach(suggestion => {
          console.log(`📁 ${suggestion.file}: ${suggestion.reason}`);
          console.log(`   Priority: ${suggestion.priority.toUpperCase()}`);
          console.log(`   Actions: ${suggestion.suggestedActions.slice(0, 2).join(', ')}`);
        });
        
        const event = new CustomEvent('qa-auto-refactor-suggestions', {
          detail: { suggestions: autoTriggerSuggestions }
        });
        window.dispatchEvent(event);
      }
    } catch (error) {
      console.warn('Auto-refactoring analysis failed:', error);
    }
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

  enableEnhancedMode(): void {
    this.qaOrchestrator.enableEnhancedMode();
  }

  disableEnhancedMode(): void {
    this.qaOrchestrator.disableEnhancedMode();
  }

  isEnhancedModeEnabled(): boolean {
    return this.qaOrchestrator.isEnhancedModeEnabled();
  }
}
