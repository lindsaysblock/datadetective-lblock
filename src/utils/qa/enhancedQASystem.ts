
import { QAReport, QATestResult } from './types';
import { DynamicCodebaseAnalyzer } from './analysis/dynamicCodebaseAnalyzer';
import { EnhancedAutoRefactor } from './analysis/enhancedAutoRefactor';
import { DynamicTestGenerator } from './analysis/dynamicTestGenerator';
import { AutoFixSystem } from './autoFixSystem';
import { QAReportGenerator } from './reporting/qaReportGenerator';
import { RefactoringExecutor } from './refactoring/refactoringExecutor';

export class EnhancedQASystem {
  private codebaseAnalyzer = new DynamicCodebaseAnalyzer();
  private autoRefactor = new EnhancedAutoRefactor();
  private testGenerator = new DynamicTestGenerator();
  private autoFixSystem = new AutoFixSystem();
  private reportGenerator = new QAReportGenerator();
  private refactoringExecutor = new RefactoringExecutor();
  private startTime: number = 0;

  async runEnhancedQA(): Promise<QAReport> {
    console.log('🚀 Starting Enhanced QA System with dynamic analysis...');
    this.startTime = performance.now();

    try {
      const codebaseAnalysis = await this.analyzeCodebase();
      const dynamicTests = await this.generateTests(codebaseAnalysis);
      const testResults = await this.executeTests(dynamicTests);
      const refactorDecision = await this.analyzeRefactoring();
      const report = this.generateReport(testResults, codebaseAnalysis, refactorDecision);
      
      await this.executeRefactoringIfNeeded(refactorDecision);
      
      console.log('✅ Enhanced QA analysis complete');
      return report;
      
    } catch (error) {
      console.error('❌ Enhanced QA system error:', error);
      return this.generateErrorReport(error);
    }
  }

  private async analyzeCodebase() {
    console.log('📊 Analyzing codebase structure...');
    return await this.codebaseAnalyzer.analyzeProject();
  }

  private async generateTests(codebaseAnalysis: any) {
    console.log('🧪 Generating dynamic tests...');
    return this.testGenerator.generateTestsForProject(
      codebaseAnalysis.files, 
      codebaseAnalysis.components
    );
  }

  private async executeTests(dynamicTests: any[]) {
    console.log('⚡ Executing dynamic test suite...');
    return await this.runDynamicTests(dynamicTests);
  }

  private async analyzeRefactoring() {
    console.log('🔧 Analyzing refactoring opportunities...');
    return await this.autoRefactor.analyzeAndDecide();
  }

  private generateReport(testResults: QATestResult[], codebaseAnalysis: any, refactorDecision: any) {
    return this.reportGenerator.generateEnhancedReport(
      testResults, 
      codebaseAnalysis, 
      refactorDecision,
      this.startTime
    );
  }

  private async executeRefactoringIfNeeded(refactorDecision: any) {
    if (refactorDecision.shouldExecute) {
      console.log(`🎯 Auto-triggering refactoring: ${refactorDecision.reason}`);
      await this.refactoringExecutor.executeAutoRefactoring(refactorDecision);
    }
  }

  private async runDynamicTests(tests: any[]): Promise<QATestResult[]> {
    const results: QATestResult[] = [];
    const orderedTests = this.prioritizeTests(tests);
    
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
          isDataRelated: false,
          category: 'system'
        });
      }
    }
    
    console.log(`📊 Dynamic tests complete: ${results.length} tests executed`);
    return results;
  }

  private prioritizeTests(tests: any[]) {
    const highPriorityTests = tests.filter(t => t.priority === 'high');
    const mediumPriorityTests = tests.filter(t => t.priority === 'medium');
    const lowPriorityTests = tests.filter(t => t.priority === 'low');
    
    return [...highPriorityTests, ...mediumPriorityTests, ...lowPriorityTests];
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
        suggestions: ['Check system resources', 'Review error logs', 'Restart enhanced QA system'],
        category: 'system'
      }],
      performanceMetrics: {
        renderTime: 0,
        memoryUsage: 0,
        bundleSize: 0,
        componentCount: 0,
        largeFiles: [],
        dynamicAnalysisEnabled: false,
        duration: 0
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
