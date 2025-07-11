
import type { FileAnalysis } from './dynamicCodebaseAnalyzer';

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

export class RefactoringSuggestionGenerator {
  generateSuggestion(file: FileAnalysis): RefactoringSuggestion | null {
    const urgencyScore = this.calculateUrgencyScore(file);
    
    if (urgencyScore < 30) return null;
    
    return {
      file: file.path,
      currentLines: file.lines,
      threshold: this.getThresholdForType(file.fileType),
      priority: this.getPriority(urgencyScore),
      reason: this.generateReason(file),
      suggestedActions: this.generateActions(file),
      autoRefactor: urgencyScore > 70,
      complexity: file.complexity,
      maintainabilityIndex: file.maintainabilityIndex,
      issues: file.issues,
      estimatedImpact: urgencyScore > 60 ? 'high' : 'medium',
      urgencyScore
    };
  }

  private calculateUrgencyScore(file: FileAnalysis): number {
    let score = 0;
    
    // Lines of code factor
    const threshold = this.getThresholdForType(file.fileType);
    if (file.lines > threshold) {
      score += Math.min((file.lines - threshold) / threshold * 40, 40);
    }
    
    // Complexity factor
    score += Math.min(file.complexity * 2, 25);
    
    // Maintainability factor (inverse)
    score += Math.max(0, (100 - file.maintainabilityIndex) / 2);
    
    // Issues factor
    score += file.issues.length * 5;
    
    return Math.min(score, 100);
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

  private getPriority(urgencyScore: number): 'low' | 'medium' | 'high' | 'critical' {
    if (urgencyScore > 80) return 'critical';
    if (urgencyScore > 60) return 'high';
    if (urgencyScore > 40) return 'medium';
    return 'low';
  }

  private generateReason(file: FileAnalysis): string {
    const reasons: string[] = [];
    
    const threshold = this.getThresholdForType(file.fileType);
    if (file.lines > threshold) {
      reasons.push(`File exceeds ${threshold} lines (${file.lines} lines)`);
    }
    
    if (file.complexity > 10) {
      reasons.push(`High complexity score (${file.complexity})`);
    }
    
    if (file.maintainabilityIndex < 60) {
      reasons.push(`Low maintainability index (${file.maintainabilityIndex})`);
    }
    
    if (file.issues.length > 0) {
      reasons.push(`${file.issues.length} code issues detected`);
    }
    
    return reasons.join(', ') || 'General refactoring needed';
  }

  private generateActions(file: FileAnalysis): string[] {
    const actions: string[] = [];
    
    const threshold = this.getThresholdForType(file.fileType);
    if (file.lines > threshold) {
      actions.push('Break down into smaller files or components');
    }
    
    if (file.complexity > 15) {
      actions.push('Reduce cyclomatic complexity');
    }
    
    if (file.maintainabilityIndex < 50) {
      actions.push('Improve code organization and readability');
    }
    
    if (file.issues.includes('duplicate-code')) {
      actions.push('Extract common functionality into utilities');
    }
    
    if (file.issues.includes('large-function')) {
      actions.push('Break down large functions');
    }
    
    return actions.length > 0 ? actions : ['General code cleanup and organization'];
  }
}
