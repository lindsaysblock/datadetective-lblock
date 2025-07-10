
import { RefactoringSuggestion } from '../autoRefactorSystem';

export class RefactorExecutor {
  private readonly COMPLEXITY_THRESHOLDS = {
    low: 10,
    medium: 20,
    high: 30
  };

  async shouldAutoTriggerRefactoring(suggestions: RefactoringSuggestion[]): Promise<RefactoringSuggestion[]> {
    // Enhanced auto-trigger logic
    const autoTriggerSuggestions = suggestions.filter(suggestion => {
      const shouldTrigger = suggestion.autoRefactor && (
        suggestion.priority === 'high' ||
        suggestion.maintainabilityIndex < 30 ||
        suggestion.complexity > this.COMPLEXITY_THRESHOLDS.high
      );
      
      if (shouldTrigger) {
        console.log(`🎯 Auto-trigger: ${suggestion.file} (Priority: ${suggestion.priority}, Maintainability: ${suggestion.maintainabilityIndex.toFixed(1)})`);
      }
      
      return shouldTrigger;
    });
    
    // Limit auto-triggers to prevent overwhelming the system
    return autoTriggerSuggestions.slice(0, 3);
  }

  generateRefactoringMessage(suggestion: RefactoringSuggestion): string {
    const urgencyPrefix = suggestion.priority === 'high' ? 'URGENT: ' : '';
    const complexityNote = suggestion.complexity > this.COMPLEXITY_THRESHOLDS.high 
      ? ` (High complexity: ${suggestion.complexity})` 
      : '';
    
    const prioritizedActions = suggestion.suggestedActions.slice(0, 3);
    const actions = prioritizedActions.join(', ');
    
    return `${urgencyPrefix}Automatically refactor ${suggestion.file} (${suggestion.currentLines} lines, maintainability: ${suggestion.maintainabilityIndex.toFixed(1)})${complexityNote} into smaller, focused files. Priority actions: ${actions}. Ensure all functionality remains exactly the same and clean up any unused imports or files.`;
  }

  async executeAutoRefactoring(suggestions: RefactoringSuggestion[]): Promise<void> {
    const autoRefactorSuggestions = suggestions.filter(s => s.autoRefactor);
    
    if (autoRefactorSuggestions.length > 0) {
      console.log(`🔧 Auto-executing refactoring for ${autoRefactorSuggestions.length} files...`);
      
      // Log detailed execution plan
      autoRefactorSuggestions.forEach((suggestion, index) => {
        console.log(`${index + 1}. ${suggestion.file}:`);
        console.log(`   Priority: ${suggestion.priority.toUpperCase()}`);
        console.log(`   Complexity: ${suggestion.complexity}`);
        console.log(`   Maintainability: ${suggestion.maintainabilityIndex.toFixed(1)}`);
        console.log(`   Actions: ${suggestion.suggestedActions.slice(0, 2).join(', ')}`);
      });
      
      // Dispatch automatic refactoring event
      const event = new CustomEvent('qa-auto-execute-refactoring', {
        detail: { 
          suggestions: autoRefactorSuggestions,
          metadata: {
            totalFiles: autoRefactorSuggestions.length,
            highPriority: autoRefactorSuggestions.filter(s => s.priority === 'high').length,
            avgComplexity: autoRefactorSuggestions.reduce((sum, s) => sum + s.complexity, 0) / autoRefactorSuggestions.length,
            avgMaintainability: autoRefactorSuggestions.reduce((sum, s) => sum + s.maintainabilityIndex, 0) / autoRefactorSuggestions.length
          }
        }
      });
      window.dispatchEvent(event);
    } else {
      console.log('✅ No files meet the auto-refactoring criteria');
    }
  }
}
