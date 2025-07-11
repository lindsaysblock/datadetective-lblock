
import { RefactoringSuggestion } from './refactoringSuggestionGenerator';

export interface AutoRefactorDecision {
  shouldExecute: boolean;
  reason: string;
  suggestions: RefactoringSuggestion[];
  confidence: number;
}

export class RefactoringDecisionEngine {
  private refactoringHistory: Map<string, Date> = new Map();

  makeDecision(suggestions: RefactoringSuggestion[]): AutoRefactorDecision {
    const autoExecutableSuggestions = suggestions.filter(s => s.autoRefactor);
    const criticalSuggestions = suggestions.filter(s => s.priority === 'critical');
    const highUrgencySuggestions = suggestions.filter(s => s.urgencyScore > 75);
    
    let shouldExecute = false;
    let reason = '';
    let confidence = 0;
    
    if (criticalSuggestions.length > 0) {
      shouldExecute = true;
      reason = `${criticalSuggestions.length} critical issues detected requiring immediate refactoring`;
      confidence = 95;
    } else if (highUrgencySuggestions.length >= 2) {
      shouldExecute = true;
      reason = `Multiple high-urgency files (${highUrgencySuggestions.length}) exceed quality thresholds`;
      confidence = 85;
    } else if (autoExecutableSuggestions.length >= 3) {
      shouldExecute = true;
      reason = `${autoExecutableSuggestions.length} files meet auto-refactoring criteria`;
      confidence = 75;
    } else if (autoExecutableSuggestions.length > 0) {
      shouldExecute = true;
      reason = `${autoExecutableSuggestions.length} file(s) can be safely auto-refactored`;
      confidence = 65;
    } else {
      reason = 'No files meet auto-refactoring criteria';
      confidence = 90;
    }
    
    return {
      shouldExecute,
      reason,
      suggestions: shouldExecute ? autoExecutableSuggestions.slice(0, 3) : [],
      confidence
    };
  }

  isRecentlyRefactored(filePath: string): boolean {
    const lastRefactor = this.refactoringHistory.get(filePath);
    return lastRefactor ? Date.now() - lastRefactor.getTime() < 24 * 60 * 60 * 1000 : false;
  }

  markFileAsRefactored(filePath: string): void {
    this.refactoringHistory.set(filePath, new Date());
  }

  getRefactoringHistory(): Map<string, Date> {
    return new Map(this.refactoringHistory);
  }
}
