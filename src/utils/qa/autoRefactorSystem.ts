
import { RefactoringRecommendation } from './types';

export interface RefactoringSuggestion {
  file: string;
  currentLines: number;
  threshold: number;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  suggestedActions: string[];
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
      { path: 'src/components/QADashboard.tsx', lines: 347, type: 'component' },
      { path: 'src/utils/qa/qaTestSuites.ts', lines: 209, type: 'utility' },
      { path: 'src/components/AnalysisDashboard.tsx', lines: 180, type: 'component' },
      { path: 'src/components/QueryBuilder.tsx', lines: 445, type: 'component' },
      { path: 'src/components/VisualizationReporting.tsx', lines: 316, type: 'component' }
    ];

    for (const file of knownLargeFiles) {
      const threshold = this.LINE_THRESHOLDS[file.type as keyof typeof this.LINE_THRESHOLDS];
      
      if (file.lines > threshold) {
        const priority = this.calculatePriority(file.lines, threshold);
        const suggestedActions = this.generateRefactoringActions(file.path, file.type);
        
        suggestions.push({
          file: file.path,
          currentLines: file.lines,
          threshold,
          priority,
          reason: `File exceeds ${threshold} line threshold for ${file.type} files`,
          suggestedActions
        });
      }
    }

    return suggestions;
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
    } else if (filePath.includes('QADashboard.tsx')) {
      actions.push('Extract QA overview into separate component');
      actions.push('Split test results into dedicated components');
      actions.push('Create separate performance metrics component');
      actions.push('Extract refactoring recommendations into its own component');
    } else if (filePath.includes('qaTestSuites.ts')) {
      actions.push('Split test suites into separate files by category');
      actions.push('Create base test suite class for common functionality');
      actions.push('Extract test result aggregation logic');
    } else if (filePath.includes('QueryBuilder.tsx')) {
      actions.push('Extract query builder tabs into separate components');
      actions.push('Create dedicated SQL editor component');
      actions.push('Split visual query builder into smaller components');
    } else if (filePath.includes('VisualizationReporting.tsx')) {
      actions.push('Split into ReportsList, ReportCreator, and ReportScheduler components');
      actions.push('Extract report configuration into separate component');
      actions.push('Create dedicated report template components');
    } else {
      actions.push(`Split ${fileType} into smaller, focused modules`);
      actions.push('Extract reusable logic into custom hooks or utilities');
      actions.push('Create separate components for distinct responsibilities');
    }
    
    return actions;
  }

  async shouldAutoTriggerRefactoring(suggestions: RefactoringSuggestion[]): Promise<RefactoringSuggestion[]> {
    // Only auto-trigger for high priority suggestions to avoid spam
    return suggestions.filter(suggestion => 
      suggestion.priority === 'high' && 
      suggestion.currentLines > suggestion.threshold * 1.8
    );
  }

  generateRefactoringMessage(suggestion: RefactoringSuggestion): string {
    const actions = suggestion.suggestedActions.slice(0, 3).join(', ');
    return `Refactor ${suggestion.file} (${suggestion.currentLines} lines) into smaller files without breaking any functionality. Focus on: ${actions}. Make sure to delete any unused imports or files after the operation is done.`;
  }
}
