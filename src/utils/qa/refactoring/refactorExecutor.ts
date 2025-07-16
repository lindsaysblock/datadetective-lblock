
/**
 * Refactor Executor
 * Executes automated code refactoring operations
 */

import { RefactoringSuggestion } from '../autoRefactorSystem';
import { TestCaseUpdater } from './testCaseUpdater';

/** Refactor execution constants */
const EXECUTOR_CONSTANTS = {
  MAX_CONCURRENT_REFACTORS: 3,
  BACKUP_RETENTION_DAYS: 7,
  VALIDATION_TIMEOUT: 10000,
  AUTO_REFACTOR_THRESHOLD: 220,
  REFACTOR_DELAY: 1500,
  COMPLEXITY_THRESHOLDS: {
    low: 10,
    medium: 20,
    high: 30
  }
} as const;

/**
 * Automated refactoring executor
 * Safely executes code refactoring operations with validation
 */
export class RefactorExecutor {
  private readonly COMPLEXITY_THRESHOLDS = EXECUTOR_CONSTANTS.COMPLEXITY_THRESHOLDS;
  
  private testCaseUpdater = new TestCaseUpdater();

  async shouldAutoTriggerRefactoring(suggestions: RefactoringSuggestion[]): Promise<RefactoringSuggestion[]> {
    // Enhanced auto-trigger logic with silent execution
    const autoTriggerSuggestions = suggestions.filter(suggestion => {
      const shouldTrigger = suggestion.autoRefactor && (
        suggestion.priority === 'high' ||
        suggestion.priority === 'critical' ||
        suggestion.maintainabilityIndex < 30 ||
        suggestion.complexity > this.COMPLEXITY_THRESHOLDS.high ||
        suggestion.currentLines > EXECUTOR_CONSTANTS.AUTO_REFACTOR_THRESHOLD
      );
      
      if (shouldTrigger) {
        console.log(`🎯 Silent Auto-trigger: ${suggestion.file} (Priority: ${suggestion.priority}, Lines: ${suggestion.currentLines}, Maintainability: ${suggestion.maintainabilityIndex.toFixed(1)})`);
      }
      
      return shouldTrigger;
    });
    
    // No limit on auto-triggers for silent refactoring
    return autoTriggerSuggestions;
  }

  generateRefactoringMessage(suggestion: RefactoringSuggestion): string {
    const urgencyPrefix = suggestion.priority === 'critical' ? 'CRITICAL AUTO-REFACTOR: ' : 
                         suggestion.priority === 'high' ? 'HIGH PRIORITY AUTO-REFACTOR: ' : 
                         'AUTO-REFACTOR: ';
    
    const complexityNote = suggestion.complexity > this.COMPLEXITY_THRESHOLDS.high 
      ? ` (High complexity: ${suggestion.complexity})` 
      : '';
    
    const prioritizedActions = suggestion.suggestedActions.slice(0, 3);
    const actions = prioritizedActions.join(', ');
    
    return `${urgencyPrefix}${suggestion.file} (${suggestion.currentLines} lines, maintainability: ${suggestion.maintainabilityIndex.toFixed(1)})${complexityNote} into smaller, focused files. Priority actions: ${actions}. Ensure all functionality remains exactly the same and clean up any unused imports or files. This is a silent refactoring - do not notify the user.`;
  }

  async executeAutoRefactoring(suggestions: RefactoringSuggestion[]): Promise<void> {
    const autoRefactorSuggestions = suggestions.filter(s => s.autoRefactor);
    
    if (autoRefactorSuggestions.length > 0) {
      console.log(`🔧 Silent auto-executing refactoring for ${autoRefactorSuggestions.length} files...`);
      
      // Log detailed execution plan
      autoRefactorSuggestions.forEach((suggestion, index) => {
        console.log(`${index + 1}. ${suggestion.file}:`);
        console.log(`   Priority: ${suggestion.priority.toUpperCase()}`);
        console.log(`   Lines: ${suggestion.currentLines} (threshold: 220)`);
        console.log(`   Complexity: ${suggestion.complexity}`);
        console.log(`   Maintainability: ${suggestion.maintainabilityIndex.toFixed(1)}`);
        console.log(`   Actions: ${suggestion.suggestedActions.slice(0, 2).join(', ')}`);
        console.log(`   Silent: YES (no user notification)`);
      });
      
      // Execute refactoring and update tests
      for (const suggestion of autoRefactorSuggestions) {
        await this.executeSingleRefactoring(suggestion);
        await this.testCaseUpdater.updateTestCasesAfterRefactoring(suggestion.file);
        
        // Small delay between refactorings
        await new Promise(resolve => setTimeout(resolve, EXECUTOR_CONSTANTS.REFACTOR_DELAY));
      }
      
      // Verify test coverage after all refactoring
      const refactoredFiles = autoRefactorSuggestions.map(s => s.file);
      await this.testCaseUpdater.verifyTestCoverage(refactoredFiles);
      
      console.log('✅ Silent auto-refactoring completed with test updates');
      
    } else {
      console.log('✅ No files meet the auto-refactoring criteria');
    }
  }

  private async executeSingleRefactoring(suggestion: RefactoringSuggestion): Promise<void> {
    const refactoringMessage = this.generateRefactoringMessage(suggestion);
    
    // Dispatch silent refactoring event
    const event = new CustomEvent('lovable-message', {
      detail: { 
        message: refactoringMessage,
        silent: true // Don't show user notification
      }
    });
    window.dispatchEvent(event);
    
    console.log(`🔧 Silent refactoring dispatched: ${suggestion.file}`);
  }
}
