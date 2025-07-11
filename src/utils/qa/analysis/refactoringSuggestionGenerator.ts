
import { FileAnalysis, ComponentAnalysis } from './dynamicCodebaseAnalyzer';

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

export class RefactoringSuggestionGenerator {
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

  generateSuggestion(file: FileAnalysis): RefactoringSuggestion | null {
    const threshold = this.getThresholdForType(file.fileType);
    const urgencyScore = this.calculateUrgencyScore(file);
    
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

  private calculateUrgencyScore(file: FileAnalysis): number {
    let score = 0;
    
    const threshold = this.getThresholdForType(file.fileType);
    const sizeRatio = file.lines / threshold;
    score += Math.min(sizeRatio * 20, 30);
    
    score += Math.min(file.complexity * 1.25, 25);
    score += Math.max(0, (100 - file.maintainabilityIndex) * 0.25);
    score += file.issues.length * 5;
    
    return Math.min(score, 100);
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

  private shouldAutoRefactor(file: FileAnalysis, priority: string, urgencyScore: number): boolean {
    if (priority === 'critical') return true;
    if (priority === 'high' && urgencyScore > 75) return true;
    if (file.issues.length >= 3) return true;
    if (file.maintainabilityIndex < 25) return true;
    
    if (file.fileType === 'component' && file.lines > 300) return true;
    if (file.fileType === 'utility' && file.complexity > 25) return true;
    if (file.fileType === 'page' && file.lines > 400) return true;
    
    return false;
  }

  private generateContextualActions(file: FileAnalysis): string[] {
    const actions: string[] = [];
    
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
    
    if (file.issues.includes('High cyclomatic complexity detected')) {
      actions.push('Simplify conditional logic using strategy pattern');
    }
    if (file.issues.includes('Too many hooks, consider extracting custom hooks')) {
      actions.push('Create custom hooks for related state and effects');
    }
    
    return actions.slice(0, 4);
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
}
