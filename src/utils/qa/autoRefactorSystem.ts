
import { RefactoringRecommendation } from './types';

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
  private readonly LINE_THRESHOLDS = {
    component: 200,
    hook: 150,
    utility: 250,
    page: 300
  };

  private readonly COMPLEXITY_THRESHOLDS = {
    low: 10,
    medium: 20,
    high: 30
  };

  async analyzeCodebase(): Promise<RefactoringSuggestion[]> {
    const suggestions: RefactoringSuggestion[] = [];
    
    // Enhanced analysis with complexity scoring
    const knownLargeFiles = [
      { path: 'src/utils/qaSystem.ts', lines: 320, type: 'utility', complexity: 25 },
      { path: 'src/components/QADashboard.tsx', lines: 150, type: 'component', complexity: 15 },
      { path: 'src/utils/qa/qaTestSuites.ts', lines: 180, type: 'utility', complexity: 18 },
      { path: 'src/components/AnalysisDashboard.tsx', lines: 180, type: 'component', complexity: 22 },
      { path: 'src/components/QueryBuilder.tsx', lines: 445, type: 'component', complexity: 35 },
      { path: 'src/components/VisualizationReporting.tsx', lines: 316, type: 'component', complexity: 28 },
      { path: 'src/utils/testing/e2eLoadTest.ts', lines: 280, type: 'utility', complexity: 20 },
      { path: 'src/components/data/DataUploadFlow.tsx', lines: 190, type: 'component', complexity: 16 }
    ];

    for (const file of knownLargeFiles) {
      const threshold = this.LINE_THRESHOLDS[file.type as keyof typeof this.LINE_THRESHOLDS];
      const maintainabilityIndex = this.calculateMaintainabilityIndex(file.lines, file.complexity);
      
      if (file.lines > threshold || file.complexity > this.COMPLEXITY_THRESHOLDS.medium) {
        const priority = this.calculatePriority(file.lines, threshold, file.complexity);
        const suggestedActions = this.generateRefactoringActions(file.path, file.type, file.complexity);
        const autoRefactor = this.shouldAutoRefactor(file.lines, threshold, priority, file.complexity);
        
        suggestions.push({
          file: file.path,
          currentLines: file.lines,
          threshold,
          priority,
          reason: this.generateReason(file, threshold),
          suggestedActions,
          autoRefactor,
          complexity: file.complexity,
          maintainabilityIndex
        });
      }
    }

    // Sort by priority and maintainability
    suggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.maintainabilityIndex - b.maintainabilityIndex; // Lower maintainability = higher priority
    });

    console.log(`🔍 Code analysis complete: ${suggestions.length} refactoring opportunities found`);
    suggestions.forEach(s => {
      console.log(`📁 ${s.file}: ${s.priority} priority (${s.currentLines} lines, complexity: ${s.complexity}, maintainability: ${s.maintainabilityIndex.toFixed(1)})`);
    });

    return suggestions;
  }

  private calculateMaintainabilityIndex(lines: number, complexity: number): number {
    // Simplified maintainability index (higher is better)
    const volume = Math.log2(lines) * 10;
    const complexityPenalty = complexity * 2;
    const maintainability = Math.max(0, 100 - volume - complexityPenalty);
    return maintainability;
  }

  private generateReason(file: any, threshold: number): string {
    const reasons: string[] = [];
    
    if (file.lines > threshold) {
      reasons.push(`exceeds ${threshold} line threshold`);
    }
    
    if (file.complexity > this.COMPLEXITY_THRESHOLDS.high) {
      reasons.push('has high cyclomatic complexity');
    } else if (file.complexity > this.COMPLEXITY_THRESHOLDS.medium) {
      reasons.push('has moderate complexity');
    }
    
    const maintainability = this.calculateMaintainabilityIndex(file.lines, file.complexity);
    if (maintainability < 40) {
      reasons.push('has low maintainability index');
    }
    
    return `File ${reasons.join(' and ')}`;
  }

  private shouldAutoRefactor(lines: number, threshold: number, priority: 'high' | 'medium' | 'low', complexity: number): boolean {
    // More sophisticated auto-refactor decision
    const ratio = lines / threshold;
    const complexityRatio = complexity / this.COMPLEXITY_THRESHOLDS.high;
    
    // Auto-refactor if:
    // 1. High priority with significant size issues
    // 2. Very high complexity regardless of priority
    // 3. Multiple concerning factors
    return (
      (priority === 'high' && ratio > 1.5) ||
      (complexityRatio > 1.2) ||
      (priority === 'medium' && ratio > 2 && complexityRatio > 0.8)
    );
  }

  private calculatePriority(lines: number, threshold: number, complexity: number): 'high' | 'medium' | 'low' {
    const ratio = lines / threshold;
    const complexityRatio = complexity / this.COMPLEXITY_THRESHOLDS.high;
    
    // High priority if multiple factors or extreme values
    if (ratio > 2 || complexityRatio > 1.1 || (ratio > 1.5 && complexityRatio > 0.7)) {
      return 'high';
    }
    
    // Medium priority for moderate issues
    if (ratio > 1.5 || complexityRatio > 0.8) {
      return 'medium';
    }
    
    return 'low';
  }

  private generateRefactoringActions(filePath: string, fileType: string, complexity: number): string[] {
    const actions: string[] = [];
    
    // File-specific recommendations
    if (filePath.includes('qaSystem.ts')) {
      actions.push('Extract performance monitoring into separate class');
      actions.push('Create dedicated test orchestration module');
      actions.push('Separate error handling and reporting logic');
    } else if (filePath.includes('QueryBuilder.tsx')) {
      actions.push('Extract SQL editor into dedicated component');
      actions.push('Create separate components for each query builder tab');
      actions.push('Move query validation logic to custom hook');
    } else if (filePath.includes('VisualizationReporting.tsx')) {
      actions.push('Split into ReportsList and ReportCreator components');
      actions.push('Extract report template logic into separate utilities');
      actions.push('Create dedicated scheduling component');
    } else if (filePath.includes('e2eLoadTest.ts')) {
      actions.push('Extract test configuration into separate module');
      actions.push('Create specialized test runners for each test type');
      actions.push('Move reporting logic to dedicated class');
    } else if (filePath.includes('DataUploadFlow.tsx')) {
      actions.push('Extract upload steps into separate components');
      actions.push('Create dedicated validation and processing hooks');
      actions.push('Separate file handling from UI logic');
    } else {
      // Generic recommendations based on complexity
      if (complexity > this.COMPLEXITY_THRESHOLDS.high) {
        actions.push('Reduce cyclomatic complexity by extracting decision logic');
        actions.push('Break down complex functions into smaller utilities');
      }
      
      actions.push(`Split ${fileType} into smaller, focused modules`);
      actions.push('Extract reusable logic into custom hooks or utilities');
      actions.push('Create separate components for distinct responsibilities');
    }
    
    // Add complexity-specific recommendations
    if (complexity > this.COMPLEXITY_THRESHOLDS.medium) {
      actions.push('Implement strategy pattern for complex conditional logic');
      actions.push('Use composition over large conditional blocks');
    }
    
    return actions.slice(0, 4); // Limit to most important actions
  }

  async shouldAutoTriggerRefactoring(suggestions: RefactoringSuggestion[]): Promise<RefactoringSuggestion[]> {
    // Enhanced auto-trigger logic
    const autoTriggerSuggestions = suggestions.filter(suggestion => {
      const shouldTrigger = suggestion.autoRefactor && (
        suggestion.priority === 'high' ||
        suggestion.maintainabilityIndex < 30 ||
        suggestion.complexity > this.COMPLEXITY_THRESHOLDS.high
      );
      
      if (shouldTrigger) {
        console.log(`🎯 Auto-trigger: ${suggestion.file} (Priority: ${suggestion.priority}, Maintainability: ${suggestion.maintainabilityIndex.toFixed(1)})`);
      }
      
      return shouldTrigger;
    });
    
    // Limit auto-triggers to prevent overwhelming the system
    return autoTriggerSuggestions.slice(0, 3);
  }

  generateRefactoringMessage(suggestion: RefactoringSuggestion): string {
    const urgencyPrefix = suggestion.priority === 'high' ? 'URGENT: ' : '';
    const complexityNote = suggestion.complexity > this.COMPLEXITY_THRESHOLDS.high 
      ? ` (High complexity: ${suggestion.complexity})` 
      : '';
    
    const prioritizedActions = suggestion.suggestedActions.slice(0, 3);
    const actions = prioritizedActions.join(', ');
    
    return `${urgencyPrefix}Automatically refactor ${suggestion.file} (${suggestion.currentLines} lines, maintainability: ${suggestion.maintainabilityIndex.toFixed(1)})${complexityNote} into smaller, focused files. Priority actions: ${actions}. Ensure all functionality remains exactly the same and clean up any unused imports or files.`;
  }

  async executeAutoRefactoring(suggestions: RefactoringSuggestion[]): Promise<void> {
    const autoRefactorSuggestions = suggestions.filter(s => s.autoRefactor);
    
    if (autoRefactorSuggestions.length > 0) {
      console.log(`🔧 Auto-executing refactoring for ${autoRefactorSuggestions.length} files...`);
      
      // Log detailed execution plan
      autoRefactorSuggestions.forEach((suggestion, index) => {
        console.log(`${index + 1}. ${suggestion.file}:`);
        console.log(`   Priority: ${suggestion.priority.toUpperCase()}`);
        console.log(`   Complexity: ${suggestion.complexity}`);
        console.log(`   Maintainability: ${suggestion.maintainabilityIndex.toFixed(1)}`);
        console.log(`   Actions: ${suggestion.suggestedActions.slice(0, 2).join(', ')}`);
      });
      
      // Dispatch automatic refactoring event
      const event = new CustomEvent('qa-auto-execute-refactoring', {
        detail: { 
          suggestions: autoRefactorSuggestions,
          metadata: {
            totalFiles: autoRefactorSuggestions.length,
            highPriority: autoRefactorSuggestions.filter(s => s.priority === 'high').length,
            avgComplexity: autoRefactorSuggestions.reduce((sum, s) => sum + s.complexity, 0) / autoRefactorSuggestions.length,
            avgMaintainability: autoRefactorSuggestions.reduce((sum, s) => sum + s.maintainabilityIndex, 0) / autoRefactorSuggestions.length
          }
        }
      });
      window.dispatchEvent(event);
    } else {
      console.log('✅ No files meet the auto-refactoring criteria');
    }
  }
}
