
import { RefactoringRecommendation } from './types';

export interface RefactoringSuggestion {
  file: string;
  currentLines: number;
  threshold: number;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  suggestedActions: string[];
  autoRefactor: boolean; // New flag for automatic refactoring
}

export class AutoRefactorSystem {
  private readonly LINE_THRESHOLDS = {
    component: 200,
    hook: 150,
    utility: 250,
    page: 300
  };

  async analyzeCodebase(): Promise<RefactoringSuggestion[]> {
    const suggestions: RefactoringSuggestion[] = [];
    
    // Analyze known large files from the codebase
    const knownLargeFiles = [
      { path: 'src/utils/qaSystem.ts', lines: 284, type: 'utility' },
      { path: 'src/components/QADashboard.tsx', lines: 150, type: 'component' }, // Updated after recent refactoring
      { path: 'src/utils/qa/qaTestSuites.ts', lines: 120, type: 'utility' }, // Updated after recent refactoring
      { path: 'src/components/AnalysisDashboard.tsx', lines: 180, type: 'component' },
      { path: 'src/components/QueryBuilder.tsx', lines: 445, type: 'component' },
      { path: 'src/components/VisualizationReporting.tsx', lines: 316, type: 'component' }
    ];

    for (const file of knownLargeFiles) {
      const threshold = this.LINE_THRESHOLDS[file.type as keyof typeof this.LINE_THRESHOLDS];
      
      if (file.lines > threshold) {
        const priority = this.calculatePriority(file.lines, threshold);
        const suggestedActions = this.generateRefactoringActions(file.path, file.type);
        const autoRefactor = this.shouldAutoRefactor(file.lines, threshold, priority);
        
        suggestions.push({
          file: file.path,
          currentLines: file.lines,
          threshold,
          priority,
          reason: `File exceeds ${threshold} line threshold for ${file.type} files`,
          suggestedActions,
          autoRefactor
        });
      }
    }

    return suggestions;
  }

  private shouldAutoRefactor(lines: number, threshold: number, priority: 'high' | 'medium' | 'low'): boolean {
    // Auto-refactor if file is significantly over threshold or high priority
    const ratio = lines / threshold;
    return priority === 'high' || ratio > 1.8;
  }

  private calculatePriority(lines: number, threshold: number): 'high' | 'medium' | 'low' {
    const ratio = lines / threshold;
    if (ratio > 2) return 'high';
    if (ratio > 1.5) return 'medium';
    return 'low';
  }

  private generateRefactoringActions(filePath: string, fileType: string): string[] {
    const actions: string[] = [];
    
    if (filePath.includes('qaSystem.ts')) {
      actions.push('Split QA system into separate test runner and report generator classes');
      actions.push('Extract load testing and unit testing into separate modules');
      actions.push('Create dedicated performance analysis utilities');
    } else if (filePath.includes('QueryBuilder.tsx')) {
      actions.push('Extract query builder tabs into separate components');
      actions.push('Create dedicated SQL editor component');
      actions.push('Split visual query builder into smaller components');
    } else if (filePath.includes('VisualizationReporting.tsx')) {
      actions.push('Split into ReportsList, ReportCreator, and ReportScheduler components');
      actions.push('Extract report configuration into separate component');
      actions.push('Create dedicated report template components');
    } else if (filePath.includes('AnalysisDashboard.tsx')) {
      actions.push('Extract dashboard tabs into separate components');
      actions.push('Create dedicated analysis result components');
      actions.push('Split visualization and insights into separate components');
    } else {
      actions.push(`Split ${fileType} into smaller, focused modules`);
      actions.push('Extract reusable logic into custom hooks or utilities');
      actions.push('Create separate components for distinct responsibilities');
    }
    
    return actions;
  }

  async shouldAutoTriggerRefactoring(suggestions: RefactoringSuggestion[]): Promise<RefactoringSuggestion[]> {
    // Return all suggestions marked for auto-refactoring
    return suggestions.filter(suggestion => suggestion.autoRefactor);
  }

  generateRefactoringMessage(suggestion: RefactoringSuggestion): string {
    const actions = suggestion.suggestedActions.slice(0, 3).join(', ');
    return `Automatically refactor ${suggestion.file} (${suggestion.currentLines} lines) into smaller files without breaking any functionality. Focus on: ${actions}. Make sure to delete any unused imports or files after the operation is done.`;
  }

  async executeAutoRefactoring(suggestions: RefactoringSuggestion[]): Promise<void> {
    const autoRefactorSuggestions = suggestions.filter(s => s.autoRefactor);
    
    if (autoRefactorSuggestions.length > 0) {
      console.log(`🔧 Auto-executing refactoring for ${autoRefactorSuggestions.length} files...`);
      
      // Dispatch automatic refactoring event
      const event = new CustomEvent('qa-auto-execute-refactoring', {
        detail: { suggestions: autoRefactorSuggestions }
      });
      window.dispatchEvent(event);
    }
  }
}
