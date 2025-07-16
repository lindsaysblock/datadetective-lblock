
/**
 * Suggestion Generator
 * Generates refactoring suggestions based on code analysis
 */

import { RefactoringSuggestion } from '../autoRefactorSystem';
import { FileMetricsCalculator } from './fileMetrics';

/** Suggestion generation constants */
const SUGGESTION_CONSTANTS = {
  MIN_CONFIDENCE_SCORE: 0.7,
  MAX_SUGGESTIONS_PER_FILE: 5,
  PRIORITY_WEIGHTS: {
    high: 3,
    medium: 2,
    low: 1
  },
  URGENCY_THRESHOLDS: {
    high: 70,
    medium: 40
  },
  MAINTAINABILITY_THRESHOLD: 40
} as const;

/**
 * Refactoring suggestion generator
 * Creates prioritized suggestions for code improvements
 */
export class RefactoringSuggestionGenerator {
  private metricsCalculator = new FileMetricsCalculator();

  generateSuggestion(file: any): RefactoringSuggestion {
    const threshold = this.metricsCalculator.getThresholdForType(file.type);
    const maintainabilityIndex = this.metricsCalculator.calculateMaintainabilityIndex(file.lines, file.complexity);
    const urgencyScore = this.metricsCalculator.calculateUrgencyScore(file.lines, threshold, file.complexity);
    
    return {
      file: file.path,
      currentLines: file.lines,
      threshold,
      priority: this.calculatePriority(file.lines, threshold, file.complexity),
      reason: this.generateReason(file, threshold),
      suggestedActions: this.generateRefactoringActions(file.path, file.type, file.complexity),
      autoRefactor: this.shouldAutoRefactor(file.lines, threshold, this.calculatePriority(file.lines, threshold, file.complexity), file.complexity),
      complexity: file.complexity,
      maintainabilityIndex,
      issues: this.identifyIssues(file),
      estimatedImpact: urgencyScore > SUGGESTION_CONSTANTS.URGENCY_THRESHOLDS.high ? 'high' : 
                       urgencyScore > SUGGESTION_CONSTANTS.URGENCY_THRESHOLDS.medium ? 'medium' : 'low',
      urgencyScore
    };
  }

  private calculatePriority(lines: number, threshold: number, complexity: number): 'high' | 'medium' | 'low' {
    const ratio = lines / threshold;
    const complexityThresholds = this.metricsCalculator.getComplexityThresholds();
    const complexityRatio = complexity / complexityThresholds.high;
    
    if (ratio > 2 || complexityRatio > 1.1 || (ratio > 1.5 && complexityRatio > 0.7)) {
      return 'high';
    }
    
    if (ratio > 1.5 || complexityRatio > 0.8) {
      return 'medium';
    }
    
    return 'low';
  }

  private generateReason(file: any, threshold: number): string {
    const reasons: string[] = [];
    const complexityThresholds = this.metricsCalculator.getComplexityThresholds();
    
    if (file.lines > threshold) {
      reasons.push(`exceeds ${threshold} line threshold`);
    }
    
    if (file.complexity > complexityThresholds.high) {
      reasons.push('has high cyclomatic complexity');
    } else if (file.complexity > complexityThresholds.medium) {
      reasons.push('has moderate complexity');
    }
    
    const maintainability = this.metricsCalculator.calculateMaintainabilityIndex(file.lines, file.complexity);
    if (maintainability < SUGGESTION_CONSTANTS.MAINTAINABILITY_THRESHOLD) {
      reasons.push('has low maintainability index');
    }
    
    return `File ${reasons.join(' and ')}`;
  }

  private shouldAutoRefactor(lines: number, threshold: number, priority: 'high' | 'medium' | 'low', complexity: number): boolean {
    const ratio = lines / threshold;
    const complexityThresholds = this.metricsCalculator.getComplexityThresholds();
    const complexityRatio = complexity / complexityThresholds.high;
    
    return (
      (priority === 'high' && ratio > 1.5) ||
      (complexityRatio > 1.2) ||
      (priority === 'medium' && ratio > 2 && complexityRatio > 0.8)
    );
  }

  private identifyIssues(file: any): string[] {
    const issues: string[] = [];
    const threshold = this.metricsCalculator.getThresholdForType(file.type);
    const complexityThresholds = this.metricsCalculator.getComplexityThresholds();
    
    if (file.lines > threshold) {
      issues.push('Large file size');
    }
    
    if (file.complexity > complexityThresholds.medium) {
      issues.push('High complexity');
    }
    
    return issues;
  }

  private generateRefactoringActions(filePath: string, fileType: string, complexity: number): string[] {
    const actions: string[] = [];
    const complexityThresholds = this.metricsCalculator.getComplexityThresholds();
    
    // File-specific recommendations
    if (filePath.includes('QueryBuilder.tsx')) {
      actions.push('Extract SQL editor into dedicated component');
      actions.push('Create separate components for each query builder tab');
      actions.push('Move query validation logic to custom hook');
    } else if (filePath.includes('VisualizationReporting.tsx')) {
      actions.push('Split into ReportsList and ReportCreator components');
      actions.push('Extract report template logic into separate utilities');
      actions.push('Create dedicated scheduling component');
    } else {
      if (complexity > complexityThresholds.high) {
        actions.push('Reduce cyclomatic complexity by extracting decision logic');
        actions.push('Break down complex functions into smaller utilities');
      }
      
      actions.push(`Split ${fileType} into smaller, focused modules`);
      actions.push('Extract reusable logic into custom hooks or utilities');
    }
    
    return actions.slice(0, 4);
  }
}
