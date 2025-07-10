
export class RefactoringExecutor {
  private autoRefactor: any;

  constructor() {
    // Will be injected by the calling system
  }

  async executeAutoRefactoring(decision: any): Promise<void> {
    if (decision.suggestions.length === 0) return;
    
    console.log(`🔧 Executing auto-refactoring for ${decision.suggestions.length} files...`);
    
    const refactoringMessages = decision.suggestions.map((suggestion: any) => ({
      message: this.generateRefactoringMessage(suggestion),
      label: `Auto-refactor ${suggestion.file.split('/').pop()}`,
      autoExecute: true
    }));
    
    const event = new CustomEvent('qa-auto-refactor-suggestions', {
      detail: { 
        suggestions: refactoringMessages,
        metadata: {
          confidence: decision.confidence,
          reason: decision.reason,
          totalFiles: decision.suggestions.length
        }
      }
    });
    window.dispatchEvent(event);
    
    // Mark files as refactored to prevent immediate re-triggering
    for (const suggestion of decision.suggestions) {
      if (this.autoRefactor) {
        this.autoRefactor.markFileAsRefactored(suggestion.file);
      }
    }
  }

  private generateRefactoringMessage(suggestion: any): string {
    const urgencyPrefix = suggestion.priority === 'critical' ? 'CRITICAL: ' : '';
    const actionsText = suggestion.suggestedActions.slice(0, 3).join(', ');
    
    return `${urgencyPrefix}Refactor ${suggestion.file} (${suggestion.currentLines} lines, ${suggestion.complexity} complexity, ${suggestion.maintainabilityIndex.toFixed(1)} maintainability) by ${actionsText}. Ensure functionality remains identical and clean up unused imports.`;
  }

  setAutoRefactor(autoRefactor: any) {
    this.autoRefactor = autoRefactor;
  }
}
