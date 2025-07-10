
import { RefactoringSuggestion } from '../autoRefactorSystem';

export class CodeAnalyzer {
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
}
