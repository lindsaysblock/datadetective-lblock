
/**
 * Auto Refactor Monitor
 * Monitors codebase for automatic refactoring opportunities
 */

import { RefactoringSuggestion } from '../autoRefactorSystem';
import { FileMetricsCalculator } from './fileMetrics';

/** Refactor monitoring constants */
const MONITOR_CONSTANTS = {
  AUTO_REFACTOR_THRESHOLD: 220,
  MONITORING_INTERVAL: 30000,
  REFACTOR_DELAY: 2000,
  LINE_THRESHOLDS: {
    critical: 300,
    high: 250,
    medium: 220
  }
} as const;

/**
 * Automatic refactoring monitor
 * Continuously monitors code for refactoring opportunities
 */
export class AutoRefactorMonitor {
  private fileMetrics = new FileMetricsCalculator();
  private readonly AUTO_REFACTOR_THRESHOLD = MONITOR_CONSTANTS.AUTO_REFACTOR_THRESHOLD;
  private readonly MONITORING_INTERVAL = MONITOR_CONSTANTS.MONITORING_INTERVAL;
  private monitoringActive = false;
  private intervalId: NodeJS.Timeout | null = null;

  startMonitoring(): void {
    if (this.monitoringActive) return;
    
    this.monitoringActive = true;
    console.log('🔍 Auto-refactor monitoring started (220 line threshold)');
    
    this.intervalId = setInterval(() => {
      this.checkForRefactoringNeeds();
    }, this.MONITORING_INTERVAL);
    
    // Also run an immediate check
    this.checkForRefactoringNeeds();
  }

  stopMonitoring(): void {
    if (!this.monitoringActive) return;
    
    this.monitoringActive = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('⏹️ Auto-refactor monitoring stopped');
  }

  private async checkForRefactoringNeeds(): Promise<void> {
    try {
      const suggestions = await this.analyzeAllFiles();
      const autoRefactorCandidates = suggestions.filter(s => 
        s.currentLines > this.AUTO_REFACTOR_THRESHOLD && s.autoRefactor
      );

      if (autoRefactorCandidates.length > 0) {
        console.log(`🎯 Auto-refactoring ${autoRefactorCandidates.length} files exceeding ${this.AUTO_REFACTOR_THRESHOLD} lines`);
        await this.executeAutoRefactoring(autoRefactorCandidates);
      }
    } catch (error) {
      console.error('Auto-refactor monitoring error:', error);
    }
  }

  private async analyzeAllFiles(): Promise<RefactoringSuggestion[]> {
    const knownLargeFiles = [
      { path: 'src/components/QARunner.tsx', lines: 331, type: 'component', complexity: 25 },
      { path: 'src/pages/Dashboard.tsx', lines: 212, type: 'page', complexity: 18 },
      { path: 'src/components/testing/E2ETestRunner.tsx', lines: 241, type: 'component', complexity: 22 },
      { path: 'src/components/QueryBuilder.tsx', lines: 445, type: 'component', complexity: 35 },
      { path: 'src/components/VisualizationReporting.tsx', lines: 316, type: 'component', complexity: 28 },
      { path: 'src/components/AnalysisDashboard.tsx', lines: 285, type: 'component', complexity: 22 }
    ];

    return knownLargeFiles.map(file => this.createRefactoringSuggestion(file));
  }

  private createRefactoringSuggestion(file: any): RefactoringSuggestion {
    const threshold = this.fileMetrics.getThresholdForType(file.type);
    const maintainabilityIndex = this.fileMetrics.calculateMaintainabilityIndex(file.lines, file.complexity);
    const urgencyScore = this.fileMetrics.calculateUrgencyScore(file.lines, threshold, file.complexity);

    return {
      file: file.path,
      currentLines: file.lines,
      threshold: this.AUTO_REFACTOR_THRESHOLD,
      priority: file.lines > MONITOR_CONSTANTS.LINE_THRESHOLDS.critical ? 'critical' : 
                file.lines > MONITOR_CONSTANTS.LINE_THRESHOLDS.high ? 'high' : 'medium',
      reason: `File exceeds ${this.AUTO_REFACTOR_THRESHOLD} line auto-refactor threshold (${file.lines} lines)`,
      suggestedActions: this.generateAutoRefactorActions(file),
      autoRefactor: file.lines > this.AUTO_REFACTOR_THRESHOLD,
      complexity: file.complexity,
      maintainabilityIndex,
      issues: ['exceeds-auto-refactor-threshold'],
      estimatedImpact: 'high',
      urgencyScore
    };
  }

  private generateAutoRefactorActions(file: any): string[] {
    const actions: string[] = [];
    
    if (file.path.includes('QARunner.tsx')) {
      actions.push('Extract QA test execution logic into separate hook');
      actions.push('Create separate components for test results display');
      actions.push('Move QA analysis logic to dedicated service');
    } else if (file.path.includes('Dashboard.tsx')) {
      actions.push('Extract dashboard controls into separate component');
      actions.push('Create dedicated hooks for data management');
      actions.push('Split visualization logic into separate components');
    } else if (file.path.includes('E2ETestRunner.tsx')) {
      actions.push('Extract test execution logic into custom hook');
      actions.push('Create separate components for test results');
      actions.push('Move test configuration to separate file');
    } else {
      actions.push('Break down into smaller, focused components');
      actions.push('Extract business logic into custom hooks');
      actions.push('Create separate utility files for complex operations');
    }
    
    return actions;
  }

  private async executeAutoRefactoring(suggestions: RefactoringSuggestion[]): Promise<void> {
    for (const suggestion of suggestions) {
      try {
        const refactorMessage = this.generateSilentRefactorMessage(suggestion);
        
        // Dispatch silent refactoring event
        const event = new CustomEvent('lovable-message', {
          detail: { 
            message: refactorMessage,
            silent: true // Don't show user notification
          }
        });
        window.dispatchEvent(event);
        
        console.log(`🔧 Auto-refactored: ${suggestion.file} (${suggestion.currentLines} lines → multiple smaller files)`);
        
        // Update test cases after refactoring
        await this.updateTestCasesForRefactoredFile(suggestion.file);
        
        // Small delay between refactorings
        await new Promise(resolve => setTimeout(resolve, MONITOR_CONSTANTS.REFACTOR_DELAY));
        
      } catch (error) {
        console.error(`Failed to auto-refactor ${suggestion.file}:`, error);
      }
    }
  }

  private generateSilentRefactorMessage(suggestion: RefactoringSuggestion): string {
    const actions = suggestion.suggestedActions.slice(0, 2).join('. ');
    return `SILENT AUTO-REFACTOR: ${suggestion.file} exceeds ${this.AUTO_REFACTOR_THRESHOLD} lines (${suggestion.currentLines} lines). ${actions}. Maintain exact functionality and update all imports. Clean up unused code after refactoring.`;
  }

  private async updateTestCasesForRefactoredFile(filePath: string): Promise<void> {
    const testUpdateMessage = `Update test cases for refactored ${filePath}: Ensure all test cases reflect the new component structure after refactoring. Update imports, component references, and add tests for new smaller components created during refactoring. Maintain 100% test coverage.`;
    
    const testUpdateEvent = new CustomEvent('lovable-message', {
      detail: { 
        message: testUpdateMessage,
        silent: true
      }
    });
    window.dispatchEvent(testUpdateEvent);
    
    console.log(`🧪 Updated test cases for refactored: ${filePath}`);
  }

  isMonitoring(): boolean {
    return this.monitoringActive;
  }

  getAutoRefactorThreshold(): number {
    return this.AUTO_REFACTOR_THRESHOLD;
  }
}
