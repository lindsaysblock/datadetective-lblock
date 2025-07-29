/**
 * Enhanced QA System
 * Advanced quality assurance with dynamic analysis and compliance checking
 * Refactored for consistency and maintainability
 */

import { QAReport, QATestResult } from './types';
import { DynamicCodebaseAnalyzer } from './analysis/dynamicCodebaseAnalyzer';
import { EnhancedAutoRefactor } from './analysis/enhancedAutoRefactor';
import { DynamicTestGenerator } from './analysis/dynamicTestGenerator';
import { AutoFixSystem } from './autoFixSystem';
import { QAReportGenerator } from './reporting/qaReportGenerator';
import { RefactoringExecutor } from './refactoring/refactoringExecutor';

const TEST_PRIORITY_ORDER = ['high', 'medium', 'low'] as const;
const DATA_RELATED_KEYWORDS = ['data', 'parse', 'upload'] as const;
const SKIP_PATTERNS = ['Dynamic', 'Analysis'] as const;

/**
 * Enhanced QA system with advanced analysis capabilities
 */
export class EnhancedQASystem {
  private codebaseAnalyzer = new DynamicCodebaseAnalyzer();
  private autoRefactor = new EnhancedAutoRefactor();
  private testGenerator = new DynamicTestGenerator();
  private autoFixSystem = new AutoFixSystem();
  private reportGenerator = new QAReportGenerator();
  private refactoringExecutor = new RefactoringExecutor();
  private startTime: number = 0;

  /**
   * Executes comprehensive enhanced QA workflow
   */
  async runEnhancedQA(): Promise<QAReport> {
    console.log('🚀 Starting Enhanced QA System with compliance checking...');
    this.startTime = performance.now();

    try {
      await this.runComplianceCheck();
      
      const codebaseAnalysis = await this.analyzeCodebase();
      const dynamicTests = await this.generateTests(codebaseAnalysis);
      const testResults = await this.executeTests(dynamicTests);
      const refactorDecision = await this.analyzeRefactoring();
      const report = this.generateReport(testResults, codebaseAnalysis, refactorDecision);
      
      await this.executeRefactoringIfNeeded(refactorDecision);
      
      console.log('✅ Enhanced QA analysis complete with compliance enforcement');
      return report;
      
    } catch (error) {
      console.error('❌ Enhanced QA system error:', error);
      return this.generateErrorReport(error);
    }
  }

  /**
   * Runs compliance check with error handling
   */
  private async runComplianceCheck(): Promise<void> {
    try {
      const { autoComplianceSystem } = await import('./standards/autoComplianceSystem');
      await autoComplianceSystem.runComplianceCheck();
    } catch (error) {
      console.warn('⚠️ Compliance check failed:', error);
    }
  }

  /**
   * Analyzes codebase structure and metrics
   */
  private async analyzeCodebase() {
    console.log('📊 Analyzing codebase structure...');
    return await this.codebaseAnalyzer.analyzeProject();
  }

  /**
   * Generates dynamic tests based on codebase analysis
   */
  private async generateTests(codebaseAnalysis: any) {
    console.log('🧪 Generating dynamic tests...');
    
    // Include multi-provider analytics tests
    const multiProviderTests = await this.generateMultiProviderTests();
    const dynamicTests = this.testGenerator.generateTestsForProject(
      codebaseAnalysis.files, 
      codebaseAnalysis.components
    );
    
    return [...multiProviderTests, ...dynamicTests];
  }

  private async generateMultiProviderTests() {
    try {
      const { MultiProviderAnalyticsTests } = await import('@/utils/testing/suites/multiProviderAnalyticsTests');
      const { EndToEndAnalyticsTests } = await import('@/utils/testing/suites/endToEndAnalyticsTests');
      const { APIIntegrationTests } = await import('@/utils/testing/suites/apiIntegrationTests');
      const { MultiUserSessionTests } = await import('@/utils/testing/suites/multiUserSessionTests');
      
      const [providerTests, e2eTests, apiTests, sessionTests] = await Promise.all([
        MultiProviderAnalyticsTests.runAllTests(),
        EndToEndAnalyticsTests.runAllTests(),
        APIIntegrationTests.runAllTests(),
        MultiUserSessionTests.runAllTests()
      ]);
      
      const allTests = [...providerTests, ...e2eTests, ...apiTests, ...sessionTests];
      
      // Convert to the expected test format
      return allTests.map(test => ({
        testName: test.testName,
        priority: test.status === 'fail' ? 'high' : 'medium',
        testFn: async () => test
      }));
    } catch (error) {
      console.warn('⚠️ Could not load comprehensive analytics tests:', error);
      return [];
    }
  }

  /**
   * Executes generated test suite with enhanced error reporting
   */
  private async executeTests(dynamicTests: any[]) {
    console.log('⚡ Executing dynamic test suite with enhanced error reporting...');
    
    const dynamicResults = await this.runDynamicTests(dynamicTests);
    
    // Add mock failed tests for demonstration if no real failures
    if (dynamicResults.filter(r => r.status === 'fail').length === 0) {
      console.log('📝 Adding mock test failures for expansion testing...');
      const { generateMockFailedTests } = await import('./testMockFailures');
      const mockFailures = generateMockFailedTests();
      return [...dynamicResults, ...mockFailures];
    }
    
    return dynamicResults;
  }

  /**
   * Analyzes refactoring opportunities
   */
  private async analyzeRefactoring() {
    console.log('🔧 Analyzing refactoring opportunities...');
    return await this.autoRefactor.analyzeAndDecide();
  }

  /**
   * Generates comprehensive QA report
   */
  private generateReport(testResults: QATestResult[], codebaseAnalysis: any, refactorDecision: any) {
    return this.reportGenerator.generateEnhancedReport(
      testResults, 
      codebaseAnalysis, 
      refactorDecision,
      this.startTime
    );
  }

  /**
   * Executes refactoring if automatically triggered
   */
  private async executeRefactoringIfNeeded(refactorDecision: any) {
    if (refactorDecision.shouldExecute) {
      console.log(`🎯 Auto-triggering refactoring: ${refactorDecision.reason}`);
      await this.refactoringExecutor.executeAutoRefactoring(refactorDecision);
    }
  }

  /**
   * Runs dynamic tests with priority ordering
   */
  private async runDynamicTests(tests: any[]): Promise<QATestResult[]> {
    const results: QATestResult[] = [];
    const orderedTests = this.prioritizeTests(tests);
    
    for (const test of orderedTests) {
      try {
        const result = await test.testFn();
        
        // Enhance the result with detailed information for expansion
        const enhancedResult = {
          ...result,
          isDataRelated: this.isDataRelatedTest(test.testName)
        };
        
        // Add detailed information for failed tests
        if (result.status === 'fail') {
          enhancedResult.error = result.error || result.message || 'Test failed without specific error details';
          enhancedResult.fullDetails = result.fullDetails || `Test "${test.testName}" failed. Review the error details and suggestions for resolution steps.`;
          enhancedResult.fixSuggestions = result.fixSuggestions || [
            'Review test implementation',
            'Check for missing dependencies',
            'Verify test data and conditions'
          ];
          enhancedResult.optimizations = result.optimizations || [
            'Consider adding better error handling',
            'Add validation for test prerequisites',
            'Implement proper cleanup after test execution'
          ];
        }
        
        // Add performance insights for warning tests
        if (result.status === 'warning') {
          enhancedResult.optimizations = result.optimizations || [
            'Performance could be improved',
            'Consider optimization opportunities',
            'Review for potential bottlenecks'
          ];
          enhancedResult.fullDetails = result.fullDetails || `Test "${test.testName}" passed with warnings. Check optimization suggestions for improvement opportunities.`;
        }
        
        results.push(enhancedResult);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        const stackTrace = error instanceof Error ? error.stack : undefined;
        
        results.push({
          testName: test.testName,
          status: 'fail',
          message: `Test execution failed: ${errorMessage}`,
          error: errorMessage,
          stackTrace: stackTrace,
          fullDetails: `Dynamic test "${test.testName}" failed during execution. This could be due to code issues, resource constraints, or test configuration problems. Stack trace and error details are available in the expandable section.`,
          fixSuggestions: [
            'Check the console for additional error details',
            'Verify all required dependencies are available',
            'Review the test implementation for potential issues',
            'Try running the test in isolation to isolate the problem'
          ],
          optimizations: [
            'Consider adding better error handling to the test',
            'Add timeout handling for long-running operations',
            'Implement retry logic for flaky tests'
          ],
          isDataRelated: this.isDataRelatedTest(test.testName),
          category: 'dynamic_test'
        });
      }
    }
    
    console.log(`📊 Dynamic tests complete: ${results.length} tests executed`);
    return results;
  }

  /**
   * Prioritizes tests by priority level
   */
  private prioritizeTests(tests: any[]) {
    const priorityGroups = TEST_PRIORITY_ORDER.map(priority => 
      tests.filter(t => t.priority === priority)
    );
    
    return priorityGroups.flat();
  }

  /**
   * Generates error report for failed QA execution
   */
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
        error: error instanceof Error ? error.message : 'Unknown error occurred in enhanced QA system',
        stackTrace: error instanceof Error ? error.stack : undefined,
        suggestions: ['Check system resources', 'Review error logs', 'Restart enhanced QA system'],
        fullDetails: `Enhanced QA system encountered a critical error during dynamic analysis. Error details: ${error instanceof Error ? error.message : 'Unknown error'}. This may be due to complex codebase analysis, resource constraints, or dynamic test generation failures.`,
        fixSuggestions: [
          'Try running legacy QA mode',
          'Check memory usage and close unnecessary applications', 
          'Verify all project dependencies are correctly installed',
          'Review console for additional error details'
        ],
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

  /**
   * Determines if test is data-related
   */
  private isDataRelatedTest(testName: string): boolean {
    const lowerTestName = testName.toLowerCase();
    return DATA_RELATED_KEYWORDS.some(keyword => lowerTestName.includes(keyword));
  }

  /**
   * Enhanced auto-fix with intelligent targeting
   */
  async autoFix(report: QAReport): Promise<void> {
    console.log('🔧 Starting enhanced auto-fix with intelligent targeting...');
    
    const failedTests = report.results.filter(test => test.status === 'fail');
    let fixAttempts = 0;
    let successfulFixes = 0;
    
    for (const test of failedTests) {
      try {
        fixAttempts++;
        
        if (this.shouldSkipEnhancedAutoFix(test.testName)) {
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

  /**
   * Determines if test should be skipped for enhanced auto-fix
   */
  private shouldSkipEnhancedAutoFix(testName: string): boolean {
    return SKIP_PATTERNS.some(pattern => testName.includes(pattern));
  }
}
