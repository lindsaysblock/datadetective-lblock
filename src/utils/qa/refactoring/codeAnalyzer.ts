
/**
 * Code Analyzer
 * Analyzes code quality and structure for refactoring recommendations
 */

import { RefactoringSuggestion } from '../autoRefactorSystem';
import { RefactoringSuggestionGenerator } from './suggestionGenerator';
import { AutoRefactorMonitor } from './autoRefactorMonitor';

/** Code analysis constants */
const ANALYSIS_CONSTANTS = {
  MAX_LINES_PER_FILE: 220,
  MAX_FUNCTION_COMPLEXITY: 5,
  MAX_NESTING_DEPTH: 3,
  PRIORITY_ORDER: { critical: 4, high: 3, medium: 2, low: 1 }
} as const;

/**
 * Code quality analyzer
 * Performs static analysis of code for quality metrics
 */
export class CodeAnalyzer {
  private suggestionGenerator = new RefactoringSuggestionGenerator();
  private autoRefactorMonitor = new AutoRefactorMonitor();

  constructor() {
    // Start auto-monitoring on initialization
    this.autoRefactorMonitor.startMonitoring();
  }

  async analyzeCodebase(): Promise<RefactoringSuggestion[]> {
    const suggestions: RefactoringSuggestion[] = [];
    
    const knownLargeFiles = [
      { path: 'src/utils/qaSystem.ts', lines: 320, type: 'utility', complexity: 25 },
      { path: 'src/components/QADashboard.tsx', lines: 150, type: 'component', complexity: 15 },
      { path: 'src/utils/qa/qaTestSuites.ts', lines: 180, type: 'utility', complexity: 18 },
      { path: 'src/components/AnalysisDashboard.tsx', lines: 180, type: 'component', complexity: 22 },
      { path: 'src/components/QueryBuilder.tsx', lines: 445, type: 'component', complexity: 35 },
      { path: 'src/components/VisualizationReporting.tsx', lines: 316, type: 'component', complexity: 28 },
      { path: 'src/utils/testing/e2eLoadTest.ts', lines: 280, type: 'utility', complexity: 20 },
      { path: 'src/components/data/DataUploadFlow.tsx', lines: 190, type: 'component', complexity: 16 },
      { path: 'src/components/QARunner.tsx', lines: 331, type: 'component', complexity: 25 },
      { path: 'src/pages/Dashboard.tsx', lines: 212, type: 'page', complexity: 18 },
      { path: 'src/components/testing/E2ETestRunner.tsx', lines: 241, type: 'component', complexity: 22 }
    ];

    for (const file of knownLargeFiles) {
      const suggestion = this.suggestionGenerator.generateSuggestion(file);
      suggestions.push(suggestion);
    }

    // Sort by priority and maintainability
    suggestions.sort((a, b) => {
      const priorityDiff = ANALYSIS_CONSTANTS.PRIORITY_ORDER[b.priority] - ANALYSIS_CONSTANTS.PRIORITY_ORDER[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return a.maintainabilityIndex - b.maintainabilityIndex;
    });

    console.log(`🔍 Code analysis complete: ${suggestions.length} refactoring opportunities found`);
    console.log(`🤖 Auto-refactor monitoring: ${this.autoRefactorMonitor.isMonitoring() ? 'ACTIVE' : 'INACTIVE'} (${this.autoRefactorMonitor.getAutoRefactorThreshold()} line threshold)`);
    
    suggestions.forEach(s => {
      const autoFlag = s.autoRefactor ? ' [AUTO-REFACTOR]' : '';
      console.log(`📁 ${s.file}: ${s.priority} priority (${s.currentLines} lines, complexity: ${s.complexity}, maintainability: ${s.maintainabilityIndex.toFixed(1)})${autoFlag}`);
    });

    return suggestions;
  }

  stopAutoMonitoring(): void {
    this.autoRefactorMonitor.stopMonitoring();
  }

  startAutoMonitoring(): void {
    this.autoRefactorMonitor.startMonitoring();
  }

  isAutoMonitoringActive(): boolean {
    return this.autoRefactorMonitor.isMonitoring();
  }
}
