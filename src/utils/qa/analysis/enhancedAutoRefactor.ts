
import { DynamicCodebaseAnalyzer, FileAnalysis, ComponentAnalysis } from './dynamicCodebaseAnalyzer';

export interface RefactoringSuggestion {
  file: string;
  currentLines: number;
  threshold: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  reason: string;
  suggestedActions: string[];
  autoRefactor: boolean;
  complexity: number;
  maintainabilityIndex: number;
  issues: string[];
  estimatedImpact: 'high' | 'medium' | 'low';
  urgencyScore: number;
}

export interface AutoRefactorDecision {
  shouldExecute: boolean;
  reason: string;
  suggestions: RefactoringSuggestion[];
  confidence: number;
}

export class EnhancedAutoRefactor {
  private analyzer = new DynamicCodebaseAnalyzer();
  private lastAnalysis: Date | null = null;
  private refactoringHistory: Map<string, Date> = new Map();

  async analyzeAndDecide(): Promise<AutoRefactorDecision> {
    console.log('🔍 Enhanced auto-refactor analysis starting...');
    
    const analysis = await this.analyzer.analyzeProject();
    const suggestions = this.generateSmartSuggestions(analysis.files, analysis.components);
    const decision = this.makeAutoRefactorDecision(suggestions);
    
    this.lastAnalysis = new Date();
    
    console.log(`🎯 Auto-refactor decision: ${decision.shouldExecute ? 'EXECUTE' : 'WAIT'}`);
    console.log(`   Confidence: ${decision.confidence}%`);
    console.log(`   Suggestions: ${suggestions.length} total, ${decision.suggestions.length} auto-executable`);
    
    return decision;
  }

  private generateSmartSuggestions(files: FileAnalysis[], components: ComponentAnalysis[]): RefactoringSuggestion[] {
    const suggestions: RefactoringSuggestion[] = [];
    
    for (const file of files) {
      const suggestion = this.analyzeFileForRefactoring(file);
      if (suggestion) {
        suggestions.push(suggestion);
      }
    }
    
    // Add component-specific suggestions
    for (const component of components) {
      if (component.isLargeComponent) {
        const componentSuggestion = this.analyzeComponentForRefactoring(component, files);
        if (componentSuggestion) {
          suggestions.push(componentSuggestion);
        }
      }
    }
    
    // Sort by urgency score (highest first)
    suggestions.sort((a, b) => b.urgencyScore - a.urgencyScore);
    
    return suggestions;
  }

  private analyzeFileForRefactoring(file: FileAnalysis): RefactoringSuggestion | null {
    const threshold = this.getThresholdForType(file.fileType);
    const urgencyScore = this.calculateUrgencyScore(file);
    
    // Skip if file was recently refactored
    const lastRefactor = this.refactoringHistory.get(file.path);
    if (lastRefactor && Date.now() - lastRefactor.getTime() < 24 * 60 * 60 * 1000) {
      return null;
    }
    
    // Only suggest refactoring if there are clear issues
    if (file.lines <= threshold && file.complexity <= 20 && file.issues.length === 0) {
      return null;
    }
    
    const priority = this.calculatePriority(file, threshold, urgencyScore);
    const suggestedActions = this.generateContextualActions(file);
    const autoRefactor = this.shouldAutoRefactor(file, priority, urgencyScore);
    
    return {
      file: file.path,
      currentLines: file.lines,
      threshold,
      priority,
      reason: this.generateReason(file, threshold),
      suggestedActions,
      autoRefactor,
      complexity: file.complexity,
      maintainabilityIndex: file.maintainabilityIndex,
      issues: file.issues,
      estimatedImpact: this.calculateImpact(file),
      urgencyScore
    };
  }

  private analyzeComponentForRefactoring(component: ComponentAnalysis, files: FileAnalysis[]): RefactoringSuggestion | null {
    const file = files.find(f => f.path === component.file);
    if (!file) return null;
    
    const urgencyScore = this.calculateComponentUrgencyScore(component);
    
    if (urgencyScore < 50) return null; // Not urgent enough
    
    return {
      file: component.file,
      currentLines: file.lines,
      threshold: this.getThresholdForType(file.fileType),
      priority: urgencyScore > 80 ? 'critical' : urgencyScore > 60 ? 'high' : 'medium',
      reason: `Component ${component.name} has high complexity (${component.renderComplexity}) and ${component.stateVariables} state variables`,
      suggestedActions: this.generateComponentActions(component),
      autoRefactor: urgencyScore > 75,
      complexity: component.renderComplexity,
      maintainabilityIndex: file.maintainabilityIndex,
      issues: file.issues,
      estimatedImpact: urgencyScore > 70 ? 'high' : 'medium',
      urgencyScore
    };
  }

  private calculateUrgencyScore(file: FileAnalysis): number {
    let score = 0;
    
    // Size factor (0-30 points)
    const threshold = this.getThresholdForType(file.fileType);
    const sizeRatio = file.lines / threshold;
    score += Math.min(sizeRatio * 20, 30);
    
    // Complexity factor (0-25 points)
    score += Math.min(file.complexity * 1.25, 25);
    
    // Maintainability factor (0-25 points)
    score += Math.max(0, (100 - file.maintainabilityIndex) * 0.25);
    
    // Issues factor (0-20 points)
    score += file.issues.length * 5;
    
    return Math.min(score, 100);
  }

  private calculateComponentUrgencyScore(component: ComponentAnalysis): number {
    let score = 0;
    
    // Render complexity (0-30 points)
    score += Math.min(component.renderComplexity * 1.5, 30);
    
    // State management complexity (0-25 points)
    score += Math.min(component.stateVariables * 5, 25);
    
    // Props complexity (0-20 points)
    score += Math.min(component.propsCount * 2, 20);
    
    // Effects complexity (0-15 points)
    score += Math.min(component.effectsCount * 3, 15);
    
    // Error boundary bonus (0-10 points)
    if (!component.hasErrorBoundary) score += 10;
    
    return Math.min(score, 100);
  }

  private makeAutoRefactorDecision(suggestions: RefactoringSuggestion[]): AutoRefactorDecision {
    const autoExecutableSuggestions = suggestions.filter(s => s.autoRefactor);
    const criticalSuggestions = suggestions.filter(s => s.priority === 'critical');
    const highUrgencySuggestions = suggestions.filter(s => s.urgencyScore > 75);
    
    // Decision logic
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
      confidence = 90; // High confidence in NOT refactoring
    }
    
    return {
      shouldExecute,
      reason,
      suggestions: shouldExecute ? autoExecutableSuggestions.slice(0, 3) : [], // Limit to 3 to prevent overload
      confidence
    };
  }

  private shouldAutoRefactor(file: FileAnalysis, priority: string, urgencyScore: number): boolean {
    // More nuanced auto-refactor decision
    if (priority === 'critical') return true;
    if (priority === 'high' && urgencyScore > 75) return true;
    if (file.issues.length >= 3) return true;
    if (file.maintainabilityIndex < 25) return true;
    
    // File-specific rules
    if (file.fileType === 'component' && file.lines > 300) return true;
    if (file.fileType === 'utility' && file.complexity > 25) return true;
    if (file.fileType === 'page' && file.lines > 400) return true;
    
    return false;
  }

  private calculatePriority(file: FileAnalysis, threshold: number, urgencyScore: number): 'critical' | 'high' | 'medium' | 'low' {
    if (urgencyScore > 85 || file.issues.length >= 4) return 'critical';
    if (urgencyScore > 70 || file.lines > threshold * 2) return 'high';
    if (urgencyScore > 50 || file.lines > threshold * 1.5) return 'medium';
    return 'low';
  }

  private calculateImpact(file: FileAnalysis): 'high' | 'medium' | 'low' {
    if (file.fileType === 'page' || file.complexity > 25) return 'high';
    if (file.fileType === 'component' || file.lines > 200) return 'medium';
    return 'low';
  }

  private generateContextualActions(file: FileAnalysis): string[] {
    const actions: string[] = [];
    
    // File-specific actions based on actual analysis
    if (file.path.includes('NewProject.tsx')) {
      actions.push('Extract step components (ResearchQuestionStep, DataSourceStep, etc.)');
      actions.push('Create useNewProjectForm custom hook for state management');
      actions.push('Split validation logic into separate utilities');
    } else if (file.path.includes('QueryBuilder.tsx')) {
      actions.push('Extract tab components (SQLTab, VisualTab, etc.)');
      actions.push('Create useQueryBuilder hook for complex state');
      actions.push('Move query execution logic to separate service');
    } else if (file.path.includes('qaTestSuites.ts')) {
      actions.push('Split test suites into individual files');
      actions.push('Extract test utilities and helpers');
      actions.push('Create modular test orchestration system');
    } else {
      // Generic actions based on file type and issues
      if (file.fileType === 'component') {
        actions.push(`Split ${file.exports[0]} into smaller focused components`);
        if (file.hookCount > 3) {
          actions.push('Extract custom hooks for state management');
        }
      } else if (file.fileType === 'utility') {
        actions.push('Break down utility functions into focused modules');
        actions.push('Extract shared interfaces and types');
      }
    }
    
    // Issue-specific actions
    if (file.issues.includes('High cyclomatic complexity detected')) {
      actions.push('Simplify conditional logic using strategy pattern');
    }
    if (file.issues.includes('Too many hooks, consider extracting custom hooks')) {
      actions.push('Create custom hooks for related state and effects');
    }
    
    return actions.slice(0, 4); // Limit to most important
  }

  private generateComponentActions(component: ComponentAnalysis): string[] {
    const actions: string[] = [];
    
    if (component.renderComplexity > 15) {
      actions.push('Break down render method into smaller sub-components');
    }
    if (component.stateVariables > 4) {
      actions.push('Extract state management into custom hook');
    }
    if (component.propsCount > 6) {
      actions.push('Group related props into configuration objects');
    }
    if (!component.hasErrorBoundary) {
      actions.push('Add error boundary for better error handling');
    }
    
    return actions;
  }

  private generateReason(file: FileAnalysis, threshold: number): string {
    const reasons: string[] = [];
    
    if (file.lines > threshold) {
      const ratio = (file.lines / threshold).toFixed(1);
      reasons.push(`${ratio}x larger than recommended (${file.lines}/${threshold} lines)`);
    }
    
    if (file.complexity > 20) {
      reasons.push(`high complexity score (${file.complexity})`);
    }
    
    if (file.maintainabilityIndex < 40) {
      reasons.push(`low maintainability index (${file.maintainabilityIndex.toFixed(1)})`);
    }
    
    if (file.issues.length > 0) {
      reasons.push(`${file.issues.length} code quality issues detected`);
    }
    
    return `File has ${reasons.join(', ')}`;
  }

  private getThresholdForType(fileType: string): number {
    const thresholds = {
      component: 200,
      page: 300,
      hook: 150,
      utility: 250,
      type: 100
    };
    return thresholds[fileType as keyof typeof thresholds] || 200;
  }

  markFileAsRefactored(filePath: string): void {
    this.refactoringHistory.set(filePath, new Date());
  }

  getRefactoringHistory(): Map<string, Date> {
    return new Map(this.refactoringHistory);
  }
}
