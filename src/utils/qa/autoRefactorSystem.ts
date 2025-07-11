
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
  private readonly autoRefactorThreshold = 220; // Auto-refactor files over 220 lines

  async analyzeCodebase(): Promise<RefactoringSuggestion[]> {
    console.log('🔍 Analyzing codebase for refactoring opportunities...');
    
    const suggestions: RefactoringSuggestion[] = [];
    
    // Updated mock analysis reflecting the refactored structure
    const mockFiles = [
      // These should now be flagged as needing refactoring (over 220 lines)
      { path: 'src/components/QueryBuilder.tsx', lines: 445, complexity: 35 },
      { path: 'src/components/VisualizationReporting.tsx', lines: 316, complexity: 28 },
      { path: 'src/components/AnalysisDashboard.tsx', lines: 285, complexity: 22 },
      { path: 'src/utils/qa/qaTestSuites.ts', lines: 371, complexity: 18 },
      
      // These are now good examples (under 220 lines after refactoring)
      { path: 'src/pages/NewProject.tsx', lines: 118, complexity: 12 },
      { path: 'src/components/project/DataSourceStep.tsx', lines: 85, complexity: 8 },
      { path: 'src/components/project/ResearchQuestionStep.tsx', lines: 55, complexity: 6 },
      { path: 'src/components/QARunner.tsx', lines: 180, complexity: 16 }
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
    return file.lines > this.autoRefactorThreshold || file.complexity > 15;
  }

  private generateSuggestion(file: { path: string; lines: number; complexity: number }): RefactoringSuggestion {
    const urgencyScore = this.calculateUrgencyScore(file);
    
    return {
      file: file.path,
      currentLines: file.lines,
      threshold: this.autoRefactorThreshold,
      priority: urgencyScore > 80 ? 'critical' : urgencyScore > 60 ? 'high' : 'medium',
      reason: `File has ${file.lines} lines (threshold: ${this.autoRefactorThreshold}) and complexity ${file.complexity}`,
      suggestedActions: this.generateActions(file),
      autoRefactor: urgencyScore > 75 && file.lines > this.autoRefactorThreshold,
      complexity: file.complexity,
      maintainabilityIndex: Math.max(0, 100 - (file.lines / 10) - (file.complexity * 2)),
      issues: this.detectIssues(file),
      estimatedImpact: urgencyScore > 70 ? 'high' : 'medium',
      urgencyScore
    };
  }

  private calculateUrgencyScore(file: { lines: number; complexity: number }): number {
    let score = 0;
    
    // Lines factor - more aggressive scoring for auto-refactoring
    if (file.lines > 400) score += 50;
    else if (file.lines > 300) score += 35;
    else if (file.lines > this.autoRefactorThreshold) score += 25;
    
    // Complexity factor
    score += Math.min(file.complexity * 2.5, 30);
    
    return Math.min(score, 100);
  }

  private generateActions(file: { lines: number; complexity: number }): string[] {
    const actions: string[] = [];
    
    if (file.lines > this.autoRefactorThreshold) {
      actions.push('Break down into smaller, focused components');
      actions.push('Extract reusable logic into custom hooks');
    }
    if (file.complexity > 20) {
      actions.push('Reduce cyclomatic complexity');
      actions.push('Split complex functions into smaller utilities');
    }
    if (file.lines > 300) {
      actions.push('Create separate files for different concerns');
    }
    
    return actions.length > 0 ? actions : ['General code cleanup and modularization'];
  }

  private detectIssues(file: { lines: number; complexity: number }): string[] {
    const issues: string[] = [];
    
    if (file.lines > this.autoRefactorThreshold) issues.push('exceeds-line-threshold');
    if (file.complexity > 20) issues.push('high-complexity');
    if (file.lines > 400) issues.push('critically-large-file');
    
    return issues;
  }

  private isRecentlyRefactored(filePath: string): boolean {
    const lastRefactored = this.refactoringHistory.get(filePath);
    if (!lastRefactored) return false;
    
    return Date.now() - lastRefactored.getTime() < this.cooldownPeriod;
  }

  markFileAsRefactored(filePath: string): void {
    this.refactoringHistory.set(filePath, new Date());
  }

  getAutoRefactorThreshold(): number {
    return this.autoRefactorThreshold;
  }
}
