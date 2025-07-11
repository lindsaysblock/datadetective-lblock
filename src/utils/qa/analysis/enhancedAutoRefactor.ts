
import { DynamicCodebaseAnalyzer, FileAnalysis, ComponentAnalysis } from './dynamicCodebaseAnalyzer';
import { RefactoringSuggestionGenerator, RefactoringSuggestion } from './refactoringSuggestionGenerator';
import { RefactoringDecisionEngine, AutoRefactorDecision } from './refactoringDecisionEngine';

export { RefactoringSuggestion, AutoRefactorDecision };

export class EnhancedAutoRefactor {
  private analyzer = new DynamicCodebaseAnalyzer();
  private suggestionGenerator = new RefactoringSuggestionGenerator();
  private decisionEngine = new RefactoringDecisionEngine();
  private lastAnalysis: Date | null = null;

  async analyzeAndDecide(): Promise<AutoRefactorDecision> {
    console.log('🔍 Enhanced auto-refactor analysis starting...');
    
    const analysis = await this.analyzer.analyzeProject();
    const suggestions = this.generateSmartSuggestions(analysis.files, analysis.components);
    const decision = this.decisionEngine.makeDecision(suggestions);
    
    this.lastAnalysis = new Date();
    
    console.log(`🎯 Auto-refactor decision: ${decision.shouldExecute ? 'EXECUTE' : 'WAIT'}`);
    console.log(`   Confidence: ${decision.confidence}%`);
    console.log(`   Suggestions: ${suggestions.length} total, ${decision.suggestions.length} auto-executable`);
    
    return decision;
  }

  private generateSmartSuggestions(files: FileAnalysis[], components: ComponentAnalysis[]): RefactoringSuggestion[] {
    const suggestions: RefactoringSuggestion[] = [];
    
    // Analyze files for refactoring opportunities
    for (const file of files) {
      if (this.decisionEngine.isRecentlyRefactored(file.path)) {
        continue;
      }
      
      const suggestion = this.suggestionGenerator.generateSuggestion(file);
      if (suggestion) {
        suggestions.push(suggestion);
      }
    }
    
    // Analyze components for refactoring opportunities
    for (const component of components) {
      if (component.isLargeComponent && !this.decisionEngine.isRecentlyRefactored(component.file)) {
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

  private analyzeComponentForRefactoring(component: ComponentAnalysis, files: FileAnalysis[]): RefactoringSuggestion | null {
    const file = files.find(f => f.path === component.file);
    if (!file) return null;
    
    const urgencyScore = this.calculateComponentUrgencyScore(component);
    
    if (urgencyScore < 50) return null;
    
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

  private calculateComponentUrgencyScore(component: ComponentAnalysis): number {
    let score = 0;
    
    score += Math.min(component.renderComplexity * 1.5, 30);
    score += Math.min(component.stateVariables * 5, 25);
    score += Math.min(component.propsCount * 2, 20);
    score += Math.min(component.effectsCount * 3, 15);
    
    if (!component.hasErrorBoundary) score += 10;
    
    return Math.min(score, 100);
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
    this.decisionEngine.markFileAsRefactored(filePath);
  }

  getRefactoringHistory(): Map<string, Date> {
    return this.decisionEngine.getRefactoringHistory();
  }
}
