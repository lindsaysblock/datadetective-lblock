
import type { RefactoringSuggestion } from './refactoringSuggestionGenerator';

export interface AutoRefactorDecision {
  shouldExecute: boolean;
  confidence: number;
  suggestions: RefactoringSuggestion[];
  reason: string;
  estimatedTime: number;
}

export class RefactoringDecisionEngine {
  private refactoringHistory = new Map<string, Date>();
  private readonly cooldownPeriod = 24 * 60 * 60 * 1000; // 24 hours

  makeDecision(suggestions: RefactoringSuggestion[]): AutoRefactorDecision {
    const autoExecutableSuggestions = suggestions.filter(s => s.autoRefactor);
    const highPrioritySuggestions = suggestions.filter(s => s.priority === 'critical' || s.priority === 'high');
    
    const shouldExecute = this.shouldExecuteRefactoring(autoExecutableSuggestions);
    const confidence = this.calculateConfidence(autoExecutableSuggestions);
    
    return {
      shouldExecute,
      confidence,
      suggestions: shouldExecute ? autoExecutableSuggestions : highPrioritySuggestions,
      reason: this.generateDecisionReason(shouldExecute, autoExecutableSuggestions, highPrioritySuggestions),
      estimatedTime: this.calculateEstimatedTime(shouldExecute ? autoExecutableSuggestions : highPrioritySuggestions)
    };
  }

  private shouldExecuteRefactoring(suggestions: RefactoringSuggestion[]): boolean {
    if (suggestions.length === 0) return false;
    
    // Check if any critical issues exist
    const criticalSuggestions = suggestions.filter(s => s.priority === 'critical');
    if (criticalSuggestions.length > 0) return true;
    
    // Check if multiple high-priority suggestions exist
    const highPrioritySuggestions = suggestions.filter(s => s.priority === 'high');
    if (highPrioritySuggestions.length >= 2) return true;
    
    // Check average urgency score
    const avgUrgencyScore = suggestions.reduce((sum, s) => sum + s.urgencyScore, 0) / suggestions.length;
    if (avgUrgencyScore > 75) return true;
    
    return false;
  }

  private calculateConfidence(suggestions: RefactoringSuggestion[]): number {
    if (suggestions.length === 0) return 0;
    
    let confidence = 50; // Base confidence
    
    // Increase confidence based on suggestion quality
    const avgUrgencyScore = suggestions.reduce((sum, s) => sum + s.urgencyScore, 0) / suggestions.length;
    confidence += (avgUrgencyScore - 50) * 0.5;
    
    // Increase confidence for critical suggestions
    const criticalCount = suggestions.filter(s => s.priority === 'critical').length;
    confidence += criticalCount * 15;
    
    // Decrease confidence if files were recently refactored
    const recentlyRefactoredCount = suggestions.filter(s => 
      this.isRecentlyRefactored(s.file)
    ).length;
    confidence -= recentlyRefactoredCount * 10;
    
    return Math.max(0, Math.min(100, confidence));
  }

  private generateDecisionReason(
    shouldExecute: boolean, 
    autoExecutable: RefactoringSuggestion[], 
    highPriority: RefactoringSuggestion[]
  ): string {
    if (!shouldExecute) {
      if (highPriority.length === 0) {
        return 'No high-priority refactoring needs detected';
      }
      return `${highPriority.length} high-priority suggestions require manual review`;
    }
    
    const reasons: string[] = [];
    
    const criticalCount = autoExecutable.filter(s => s.priority === 'critical').length;
    if (criticalCount > 0) {
      reasons.push(`${criticalCount} critical issue${criticalCount > 1 ? 's' : ''} detected`);
    }
    
    const highCount = autoExecutable.filter(s => s.priority === 'high').length;
    if (highCount > 0) {
      reasons.push(`${highCount} high-priority issue${highCount > 1 ? 's' : ''} detected`);
    }
    
    const avgUrgency = autoExecutable.reduce((sum, s) => sum + s.urgencyScore, 0) / autoExecutable.length;
    if (avgUrgency > 75) {
      reasons.push(`High average urgency score (${avgUrgency.toFixed(1)})`);
    }
    
    return reasons.join(', ') || 'Multiple refactoring opportunities identified';
  }

  private calculateEstimatedTime(suggestions: RefactoringSuggestion[]): number {
    return suggestions.reduce((total, suggestion) => {
      let time = 5; // Base time in minutes
      
      if (suggestion.priority === 'critical') time += 15;
      else if (suggestion.priority === 'high') time += 10;
      else if (suggestion.priority === 'medium') time += 5;
      
      time += Math.min(suggestion.currentLines / 50, 20); // Add time based on file size
      
      return total + time;
    }, 0);
  }

  isRecentlyRefactored(filePath: string): boolean {
    const lastRefactored = this.refactoringHistory.get(filePath);
    if (!lastRefactored) return false;
    
    return Date.now() - lastRefactored.getTime() < this.cooldownPeriod;
  }

  markFileAsRefactored(filePath: string): void {
    this.refactoringHistory.set(filePath, new Date());
  }

  getRefactoringHistory(): Map<string, Date> {
    return new Map(this.refactoringHistory);
  }
}
