
import { QAReport, QATestResult } from './types';
import { DynamicCodebaseAnalyzer } from './analysis/dynamicCodebaseAnalyzer';
import { EnhancedAutoRefactor } from './analysis/enhancedAutoRefactor';
import { DynamicTestGenerator } from './analysis/dynamicTestGenerator';
import { AutoFixSystem } from './autoFixSystem';

export class EnhancedQASystem {
  private codebaseAnalyzer = new DynamicCodebaseAnalyzer();
  private autoRefactor = new EnhancedAutoRefactor();
  private testGenerator = new DynamicTestGenerator();
  private autoFixSystem = new AutoFixSystem();
  private startTime: number = 0;

  async runEnhancedQA(): Promise<QAReport> {
    console.log('🚀 Starting Enhanced QA System with dynamic analysis...');
    this.startTime = performance.now();

    try {
      // Step 1: Analyze the actual codebase
      console.log('📊 Analyzing codebase structure...');
      const codebaseAnalysis = await this.codebaseAnalyzer.analyzeProject();
      
      // Step 2: Generate tests based on actual structure
      console.log('🧪 Generating dynamic tests...');
      const dynamicTests = this.testGenerator.generateTestsForProject(
        codebaseAnalysis.files, 
        codebaseAnalysis.components
      );
      
      // Step 3: Run all tests
      console.log('⚡ Executing dynamic test suite...');
      const testResults = await this.runDynamicTests(dynamicTests);
      
      // Step 4: Analyze for auto-refactoring opportunities
      console.log('🔧 Analyzing refactoring opportunities...');
      const refactorDecision = await this.autoRefactor.analyzeAndDecide();
      
      // Step 5: Generate comprehensive report
      const report = this.generateEnhancedReport(
        testResults, 
        codebaseAnalysis, 
        refactorDecision
      );
      
      // Step 6: Trigger auto-refactoring if needed
      if (refactorDecision.shouldExecute) {
        console.log(`🎯 Auto-triggering refactoring: ${refactorDecision.reason}`);
        await this.executeAutoRefactoring(refactorDecision);
      }
      
      console.log('✅ Enhanced QA analysis complete');
      return report;
      
    } catch (error) {
      console.error('❌ Enhanced QA system error:', error);
      return this.generateErrorReport(error);
    }
  }

  private async runDynamicTests(tests: any[]): Promise<QATestResult[]> {
    const results: QATestResult[] = [];
    
    // Group tests by priority and run high priority first
    const highPriorityTests = tests.filter(t => t.priority === 'high');
    const mediumPriorityTests = tests.filter(t => t.priority === 'medium');
    const lowPriorityTests = tests.filter(t => t.priority === 'low');
    
    const orderedTests = [...highPriorityTests, ...mediumPriorityTests, ...lowPriorityTests];
    
    for (const test of orderedTests) {
      try {
        const result = await test.testFn();
        results.push({
          ...result,
          isDataRelated: this.isDataRelatedTest(test.testName)
        });
      } catch (error) {
        results.push({
          testName: test.testName,
          status: 'fail',
          message: `Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          isDataRelated: false
        });
      }
    }
    
    console.log(`📊 Dynamic tests complete: ${results.length} tests executed`);
    return results;
  }

  private async executeAutoRefactoring(decision: any): Promise<void> {
    if (decision.suggestions.length === 0) return;
    
    console.log(`🔧 Executing auto-refactoring for ${decision.suggestions.length} files...`);
    
    // Create refactoring messages for each suggestion
    const refactoringMessages = decision.suggestions.map((suggestion: any) => ({
      message: this.generateRefactoringMessage(suggestion),
      label: `Auto-refactor ${suggestion.file.split('/').pop()}`,
      autoExecute: true
    }));
    
    // Dispatch auto-refactoring event
    const event = new CustomEvent('qa-auto-refactor-suggestions', {
      detail: { 
        suggestions: refactoringMessages,
        metadata: {
          confidence: decision.confidence,
          reason: decision.reason,
          totalFiles: decision.suggestions.length
        }
      }
    });
    window.dispatchEvent(event);
    
    // Mark files as refactored to prevent immediate re-triggering
    for (const suggestion of decision.suggestions) {
      this.autoRefactor.markFileAsRefactored(suggestion.file);
    }
  }

  private generateRefactoringMessage(suggestion: any): string {
    const urgencyPrefix = suggestion.priority === 'critical' ? 'CRITICAL: ' : '';
    const actionsText = suggestion.suggestedActions.slice(0, 3).join(', ');
    
    return `${urgencyPrefix}Refactor ${suggestion.file} (${suggestion.currentLines} lines, ${suggestion.complexity} complexity, ${suggestion.maintainabilityIndex.toFixed(1)} maintainability) by ${actionsText}. Ensure functionality remains identical and clean up unused imports.`;
  }

  private generateEnhancedReport(
    testResults: QATestResult[], 
    codebaseAnalysis: any, 
    refactorDecision: any
  ): QAReport {
    const passed = testResults.filter(r => r.status === 'pass').length;
    const failed = testResults.filter(r => r.status === 'fail').length;
    const warnings = testResults.filter(r => r.status === 'warning').length;
    
    const overall = failed > 0 ? 'fail' : warnings > 0 ? 'warning' : 'pass';
    const totalDuration = performance.now() - this.startTime;
    
    // Enhanced performance metrics from real analysis
    const performanceMetrics = {
      renderTime: testResults.find(r => r.testName.includes('Render Performance'))?.performance || 0,
      memoryUsage: testResults.find(r => r.testName.includes('Memory Usage'))?.performance || 0,
      bundleSize: testResults.find(r => r.testName.includes('Bundle Size'))?.performance || 0,
      componentCount: codebaseAnalysis.globalMetrics.totalComponents,
      largeFiles: codebaseAnalysis.globalMetrics.largeFiles.map((f: any) => `${f.path} (${f.lines} lines)`),
      qaSystemDuration: totalDuration,
      systemEfficiency: this.calculateSystemEfficiency(testResults),
      memoryEfficiency: this.calculateMemoryEfficiency(testResults),
      codebaseHealth: this.calculateCodebaseHealth(codebaseAnalysis),
      refactoringReadiness: refactorDecision.confidence,
      dynamicAnalysisEnabled: true
    };
    
    // Convert refactor decision to refactoring recommendations
    const refactoringRecommendations = refactorDecision.suggestions.map((s: any) => ({
      file: s.file,
      type: 'size',
      priority: s.priority,
      description: s.reason,
      suggestion: s.suggestedActions.join('; ')
    }));
    
    console.log(`📊 Enhanced QA Report Generated:`);
    console.log(`   Overall: ${overall.toUpperCase()}`);
    console.log(`   Tests: ${passed}/${testResults.length} passed`);
    console.log(`   Codebase Health: ${performanceMetrics.codebaseHealth.toFixed(1)}%`);
    console.log(`   Refactoring Confidence: ${performanceMetrics.refactoringReadiness}%`);
    console.log(`   System Efficiency: ${performanceMetrics.systemEfficiency.toFixed(1)}%`);

    return {
      overall,
      timestamp: new Date(),
      totalTests: testResults.length,
      passed,
      failed,
      warnings,
      results: testResults,
      performanceMetrics,
      refactoringRecommendations
    };
  }

  private calculateSystemEfficiency(testResults: QATestResult[]): number {
    let efficiency = 100;
    
    // Penalize for failed tests
    const failedTests = testResults.filter(r => r.status === 'fail').length;
    efficiency -= failedTests * 15;
    
    // Penalize for warnings
    const warningTests = testResults.filter(r => r.status === 'warning').length;
    efficiency -= warningTests * 5;
    
    // Bonus for performance
    const avgPerformance = testResults
      .filter(r => r.performance && r.performance > 0)
      .reduce((sum, r) => sum + (r.performance || 0), 0) / testResults.length;
    
    if (avgPerformance < 50) efficiency += 10; // Good performance bonus
    
    return Math.max(0, Math.min(100, efficiency));
  }

  private calculateMemoryEfficiency(testResults: QATestResult[]): number {
    const memoryTest = testResults.find(r => r.testName.includes('Memory Usage'));
    if (!memoryTest || !memoryTest.performance) return 85; // Default
    
    const memoryUsage = memoryTest.performance;
    
    if (memoryUsage < 10) return 95;
    if (memoryUsage < 25) return 85;
    if (memoryUsage < 50) return 70;
    return 50;
  }

  private calculateCodebaseHealth(codebaseAnalysis: any): number {
    let health = 100;
    
    // File size penalties
    const largeFileRatio = codebaseAnalysis.globalMetrics.largeFiles.length / codebaseAnalysis.globalMetrics.totalFiles;
    health -= largeFileRatio * 30;
    
    // Complexity penalties
    const complexFileRatio = codebaseAnalysis.globalMetrics.complexFiles.length / codebaseAnalysis.globalMetrics.totalFiles;
    health -= complexFileRatio * 25;
    
    // Average file size bonus/penalty
    const avgSize = codebaseAnalysis.globalMetrics.avgFileSize;
    if (avgSize > 300) health -= 15;
    else if (avgSize < 150) health += 10;
    
    return Math.max(0, Math.min(100, health));
  }

  private generateErrorReport(error: any): QAReport {
    return {
      overall: 'fail',
      timestamp: new Date(),
      totalTests: 1,
      passed: 0,
      failed: 1,
      warnings: 0,
      results: [{
        testName: 'Enhanced QA System Error',
        status: 'fail',
        message: `Enhanced QA system failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        suggestions: ['Check system resources', 'Review error logs', 'Restart enhanced QA system']
      }],
      performanceMetrics: {
        renderTime: 0,
        memoryUsage: 0,
        bundleSize: 0,
        componentCount: 0,
        largeFiles: [],
        dynamicAnalysisEnabled: false
      },
      refactoringRecommendations: []
    };
  }

  private isDataRelatedTest(testName: string): boolean {
    return testName.toLowerCase().includes('data') || 
           testName.toLowerCase().includes('parse') ||
           testName.toLowerCase().includes('upload');
  }

  async autoFix(report: QAReport): Promise<void> {
    console.log('🔧 Starting enhanced auto-fix with intelligent targeting...');
    
    const failedTests = report.results.filter(test => test.status === 'fail');
    let fixAttempts = 0;
    let successfulFixes = 0;
    
    for (const test of failedTests) {
      try {
        fixAttempts++;
        
        // Skip auto-generated tests that may need manual intervention
        if (test.testName.includes('Dynamic') || test.testName.includes('Analysis')) {
          console.log(`⚠️ Skipping auto-fix for dynamic test: ${test.testName}`);
          continue;
        }
        
        console.log(`🔧 Attempting enhanced fix for: ${test.testName}`);
        await this.autoFixSystem.attemptIntelligentFix(test);
        successfulFixes++;
        
      } catch (error) {
        console.warn(`Failed to auto-fix test: ${test.testName}`, error);
      }
    }
    
    console.log(`🔧 Enhanced auto-fix completed: ${successfulFixes}/${fixAttempts} successful fixes`);
  }
}
