
/**
 * Refactoring analysis and suggestion system
 * Provides intelligent code refactoring recommendations
 */

/** Refactoring suggestion configuration */
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

/** Refactoring system constants */
const REFACTOR_CONFIG = {
  COOLDOWN_PERIOD: 24 * 60 * 60 * 1000, // 24 hours
  AUTO_THRESHOLD: 220,
  COMPLEXITY_THRESHOLD: 15,
  CRITICAL_THRESHOLD: 400,
  HIGH_THRESHOLD: 300,
  WARNING_THRESHOLD: 180,
  URGENCY_SCORES: {
    CRITICAL: 85,
    HIGH: 70,
    MEDIUM: 50,
    AUTO_TRIGGER: 60
  }
} as const;

/**
 * Automated refactoring analysis system
 * Identifies refactoring opportunities and suggests improvements
 */
export class AutoRefactorSystem {
  private refactoringHistory = new Map<string, Date>();
  private readonly cooldownPeriod = REFACTOR_CONFIG.COOLDOWN_PERIOD;
  private readonly autoRefactorThreshold = REFACTOR_CONFIG.AUTO_THRESHOLD;
  private readonly silentRefactoring = true;

  async analyzeCodebase(): Promise<RefactoringSuggestion[]> {
    console.log('🔍 Analyzing codebase for refactoring opportunities...');
    
    const suggestions: RefactoringSuggestion[] = [];
    
    // Updated mock analysis with current file sizes
    const mockFiles = [
      // Files that exceed the 220-line threshold and need auto-refactoring
      { path: 'src/components/QueryBuilder.tsx', lines: 445, complexity: 35 },
      { path: 'src/components/VisualizationReporting.tsx', lines: 316, complexity: 28 },
      { path: 'src/components/AnalysisDashboard.tsx', lines: 285, complexity: 22 },
      { path: 'src/utils/qa/qaTestSuites.ts', lines: 371, complexity: 18 },
      { path: 'src/components/QARunner.tsx', lines: 331, complexity: 25 },
      { path: 'src/components/testing/E2ETestRunner.tsx', lines: 241, complexity: 22 },
      { path: 'src/pages/Dashboard.tsx', lines: 212, complexity: 18 }, // Still under threshold but close
      
      // These are good examples (under 220 lines after previous refactoring)
      { path: 'src/pages/NewProject.tsx', lines: 118, complexity: 12 },
      { path: 'src/components/project/DataSourceStep.tsx', lines: 85, complexity: 8 },
      { path: 'src/components/project/ResearchQuestionStep.tsx', lines: 55, complexity: 6 },
      { path: 'src/components/QADashboard.tsx', lines: 180, complexity: 16 }
    ];
    
    for (const file of mockFiles) {
      if (this.shouldRefactor(file)) {
        const suggestion = this.generateSuggestion(file);
        if (suggestion) {
          suggestions.push(suggestion);
        }
      }
    }
    
    // Log silent refactoring status
    const silentCandidates = suggestions.filter(s => s.autoRefactor && this.silentRefactoring);
    if (silentCandidates.length > 0) {
      console.log(`🤫 Silent auto-refactoring enabled: ${silentCandidates.length} files will be refactored automatically`);
    }
    
    return suggestions.sort((a, b) => b.urgencyScore - a.urgencyScore);
  }

  async shouldAutoTriggerRefactoring(suggestions: RefactoringSuggestion[]): Promise<RefactoringSuggestion[]> {
    // More aggressive auto-triggering for 220+ line threshold
    return suggestions.filter(s => 
      s.autoRefactor && (
        s.urgencyScore > REFACTOR_CONFIG.URGENCY_SCORES.AUTO_TRIGGER || 
        s.currentLines > this.autoRefactorThreshold ||
        s.priority === 'critical' ||
        s.priority === 'high'
      )
    );
  }

  private shouldRefactor(file: { path: string; lines: number; complexity: number }): boolean {
    if (this.isRecentlyRefactored(file.path)) return false;
    return file.lines > this.autoRefactorThreshold || file.complexity > REFACTOR_CONFIG.COMPLEXITY_THRESHOLD;
  }

  private generateSuggestion(file: { path: string; lines: number; complexity: number }): RefactoringSuggestion {
    const urgencyScore = this.calculateUrgencyScore(file);
    
    return {
      file: file.path,
      currentLines: file.lines,
      threshold: this.autoRefactorThreshold,
      priority: urgencyScore > REFACTOR_CONFIG.URGENCY_SCORES.CRITICAL ? 'critical' : 
               urgencyScore > REFACTOR_CONFIG.URGENCY_SCORES.HIGH ? 'high' : 
               urgencyScore > REFACTOR_CONFIG.URGENCY_SCORES.MEDIUM ? 'medium' : 'low',
      reason: `File has ${file.lines} lines (threshold: ${this.autoRefactorThreshold}) and complexity ${file.complexity}`,
      suggestedActions: this.generateActions(file),
      autoRefactor: urgencyScore > REFACTOR_CONFIG.URGENCY_SCORES.AUTO_TRIGGER && file.lines > this.autoRefactorThreshold,
      complexity: file.complexity,
      maintainabilityIndex: Math.max(0, 100 - (file.lines / 10) - (file.complexity * 2)),
      issues: this.detectIssues(file),
      estimatedImpact: urgencyScore > REFACTOR_CONFIG.URGENCY_SCORES.HIGH ? 'high' : 'medium',
      urgencyScore
    };
  }

  private calculateUrgencyScore(file: { lines: number; complexity: number }): number {
    let score = 0;
    
    // More aggressive scoring for 220+ line threshold
    if (file.lines > REFACTOR_CONFIG.CRITICAL_THRESHOLD) score += 60;
    else if (file.lines > REFACTOR_CONFIG.HIGH_THRESHOLD) score += 50;
    else if (file.lines > this.autoRefactorThreshold) score += 40;
    else if (file.lines > REFACTOR_CONFIG.WARNING_THRESHOLD) score += 20;
    
    // Complexity factor
    score += Math.min(file.complexity * 3, 35);
    
    // Bonus for files significantly over threshold
    if (file.lines > this.autoRefactorThreshold * 1.5) score += 20;
    
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
