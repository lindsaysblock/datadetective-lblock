
import { RefactoringRecommendation } from './types';
import { CodeAnalyzer } from './refactoring/codeAnalyzer';
import { RefactorExecutor } from './refactoring/refactorExecutor';

export interface RefactoringSuggestion {
  file: string;
  currentLines: number;
  threshold: number;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  suggestedActions: string[];
  autoRefactor: boolean;
  complexity: number;
  maintainabilityIndex: number;
}

export class AutoRefactorSystem {
  private codeAnalyzer = new CodeAnalyzer();
  private refactorExecutor = new RefactorExecutor();

  async analyzeCodebase(): Promise<RefactoringSuggestion[]> {
    return await this.codeAnalyzer.analyzeCodebase();
  }

  async shouldAutoTriggerRefactoring(suggestions: RefactoringSuggestion[]): Promise<RefactoringSuggestion[]> {
    return await this.refactorExecutor.shouldAutoTriggerRefactoring(suggestions);
  }

  generateRefactoringMessage(suggestion: RefactoringSuggestion): string {
    return this.refactorExecutor.generateRefactoringMessage(suggestion);
  }

  async executeAutoRefactoring(suggestions: RefactoringSuggestion[]): Promise<void> {
    await this.refactorExecutor.executeAutoRefactoring(suggestions);
  }
}
