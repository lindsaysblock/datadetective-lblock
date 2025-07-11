
export interface RefactoringSuggestion {
  file: string;
  currentLines: number;
  threshold: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  reason: string;
  suggestedActions: string[];
  autoRefactor: boolean;
  complexity: number;
  maintainabilityIndex: number;
  issues: string[];
  estimatedImpact: 'low' | 'medium' | 'high';
  urgencyScore: number;
}

export class AutoRefactorSystem {
  private refactoringHistory = new Map<string, Date>();
  private readonly cooldownPeriod = 24 * 60 * 60 * 1000; // 24 hours

  async analyzeCodebase(): Promise<RefactoringSuggestion[]> {
    console.log('🔍 Analyzing codebase for refactoring opportunities...');
    
    const suggestions: RefactoringSuggestion[] = [];
    
    // Mock analysis - in a real system this would analyze actual files
    const mockFiles = [
      { path: 'src/components/QueryBuilder.tsx', lines: 450, complexity: 18 },
      { path: 'src/pages/NewProject.tsx', lines: 380, complexity: 15 },
      { path: 'src/components/DataSourceManager.tsx', lines: 320, complexity: 12 }
    ];
    
    for (const file of mockFiles) {
      if (this.shouldRefactor(file)) {
        const suggestion = this.generateSuggestion(file);
        if (suggestion) {
          suggestions.push(suggestion);
        }
      }
    }
    
    return suggestions.sort((a, b) => b.urgencyScore - a.urgencyScore);
  }

  async shouldAutoTriggerRefactoring(suggestions: RefactoringSuggestion[]): Promise<RefactoringSuggestion[]> {
    return suggestions.filter(s => s.autoRefactor && s.urgencyScore > 70);
  }

  private shouldRefactor(file: { path: string; lines: number; complexity: number }): boolean {
    if (this.isRecentlyRefactored(file.path)) return false;
    return file.lines > 300 || file.complexity > 10;
  }

  private generateSuggestion(file: { path: string; lines: number; complexity: number }): RefactoringSuggestion {
    const urgencyScore = this.calculateUrgencyScore(file);
    
    return {
      file: file.path,
      currentLines: file.lines,
      threshold: 300,
      priority: urgencyScore > 80 ? 'critical' : urgencyScore > 60 ? 'high' : 'medium',
      reason: `File has ${file.lines} lines and complexity ${file.complexity}`,
      suggestedActions: this.generateActions(file),
      autoRefactor: urgencyScore > 75,
      complexity: file.complexity,
      maintainabilityIndex: Math.max(0, 100 - (file.lines / 10) - (file.complexity * 2)),
      issues: this.detectIssues(file),
      estimatedImpact: urgencyScore > 70 ? 'high' : 'medium',
      urgencyScore
    };
  }

  private calculateUrgencyScore(file: { lines: number; complexity: number }): number {
    let score = 0;
    
    // Lines factor
    if (file.lines > 400) score += 40;
    else if (file.lines > 300) score += 25;
    
    // Complexity factor
    score += Math.min(file.complexity * 3, 35);
    
    return Math.min(score, 100);
  }

  private generateActions(file: { lines: number; complexity: number }): string[] {
    const actions: string[] = [];
    
    if (file.lines > 400) {
      actions.push('Break down into smaller components');
    }
    if (file.complexity > 15) {
      actions.push('Reduce cyclomatic complexity');
    }
    
    return actions.length > 0 ? actions : ['General code cleanup'];
  }

  private detectIssues(file: { lines: number; complexity: number }): string[] {
    const issues: string[] = [];
    
    if (file.lines > 400) issues.push('large-file');
    if (file.complexity > 15) issues.push('high-complexity');
    
    return issues;
  }

  private isRecentlyRefactored(filePath: string): boolean {
    const lastRefactored = this.refactoringHistory.get(filePath);
    if (!lastRefactored) return false;
    
    return Date.now() - lastRefactored.getTime() < this.cooldownPeriod;
  }
}
