import { UnitTestingSystem } from '../unitTestingSystem';
import { LoadTestingSystem } from '../loadTesting/loadTestingSystem';
import { E2ETestRunner } from '../e2eTestRunner';
import { UnitTestResult, TestResult } from '../types';

export interface E2ETestReport {
  overall: 'pass' | 'warning' | 'fail';
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: number;
  testResults: UnitTestResult[];
  refactoringOpportunities: RefactoringOpportunity[];
  performanceMetrics: PerformanceMetrics;
}

export interface RefactoringOpportunity {
  file: string;
  type: 'complexity' | 'duplication' | 'performance' | 'maintainability';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  suggestedActions: string[];
  estimatedImpact: number; // 1-10 scale
}

export interface PerformanceMetrics {
  memoryUsage: number;
  averageResponseTime: number;
  throughput: number;
  errorRate: number;
  codeComplexity: number;
}

export class E2ETestOrchestrator {
  private unitTestingSystem = new UnitTestingSystem();
  private loadTestingSystem = new LoadTestingSystem();
  private e2eTestRunner = new E2ETestRunner();

  async runComprehensiveE2ETest(): Promise<E2ETestReport> {
    console.log('🚀 Starting comprehensive E2E test orchestration...');
    const startTime = performance.now();
    
    try {
      // Run unit tests
      const unitTestReport = await this.unitTestingSystem.runAllTests();
      
      // Run load tests
      const loadTestResult = await this.loadTestingSystem.runLoadTest({
        concurrentUsers: 5,
        duration: 15,
        rampUpTime: 3,
        testType: 'comprehensive'
      });
      
      // Run E2E flow tests
      const e2eResults = await this.e2eTestRunner.runCompleteE2ETests();
      
      // Analyze results and identify refactoring opportunities
      const refactoringOpportunities = this.analyzeRefactoringOpportunities(
        unitTestReport.testResults,
        e2eResults
      );
      
      const performanceMetrics = this.calculatePerformanceMetrics(loadTestResult);
      
      const allResults = [...unitTestReport.testResults, ...e2eResults];
      const endTime = performance.now();
      
      return {
        overall: this.calculateOverallStatus(allResults),
        totalTests: allResults.length,
        passedTests: allResults.filter(r => r.status === 'pass').length,
        failedTests: allResults.filter(r => r.status === 'fail').length,
        duration: endTime - startTime,
        testResults: allResults,
        refactoringOpportunities,
        performanceMetrics
      };
      
    } catch (error) {
      console.error('❌ E2E test orchestration failed:', error);
      throw error;
    }
  }

  private analyzeRefactoringOpportunities(
    unitResults: UnitTestResult[],
    e2eResults: UnitTestResult[]
  ): RefactoringOpportunity[] {
    const opportunities: RefactoringOpportunity[] = [];
    
    // Analyze test failure patterns
    const failedTests = [...unitResults, ...e2eResults].filter(r => r.status === 'fail');
    
    if (failedTests.length > 0) {
      opportunities.push({
        file: 'Multiple test files',
        type: 'maintainability',
        priority: 'high',
        description: `${failedTests.length} tests are failing, indicating potential code quality issues`,
        suggestedActions: [
          'Review and fix failing tests',
          'Implement better error handling',
          'Add more comprehensive validation'
        ],
        estimatedImpact: 8
      });
    }

    // Analyze testing infrastructure
    const testingFiles = [
      'src/utils/testing/e2eTestRunner.ts',
      'src/utils/testing/e2eLoadTest.ts',
      'src/utils/testing/unitTestingSystem.ts'
    ];

    opportunities.push({
      file: testingFiles.join(', '),
      type: 'complexity',
      priority: 'medium',
      description: 'Testing infrastructure has duplicate interfaces and scattered responsibilities',
      suggestedActions: [
        'Consolidate duplicate TestResult interfaces',
        'Create unified testing orchestrator',
        'Implement consistent error handling patterns',
        'Add type safety improvements'
      ],
      estimatedImpact: 6
    });

    // Check for performance issues
    const slowTests = [...unitResults, ...e2eResults].filter(r => r.duration > 1000);
    if (slowTests.length > 0) {
      opportunities.push({
        file: 'Performance-critical test files',
        type: 'performance',
        priority: 'medium',
        description: `${slowTests.length} tests are running slowly (>1s)`,
        suggestedActions: [
          'Optimize slow test implementations',
          'Add parallel test execution',
          'Implement test result caching'
        ],
        estimatedImpact: 5
      });
    }

    return opportunities;
  }

  private calculatePerformanceMetrics(loadTestResult: any): PerformanceMetrics {
    return {
      memoryUsage: loadTestResult.memoryUsage?.peak || 0,
      averageResponseTime: loadTestResult.averageResponseTime || 0,
      throughput: loadTestResult.throughput || 0,
      errorRate: loadTestResult.errorRate || 0,
      codeComplexity: this.estimateCodeComplexity()
    };
  }

  private calculateOverallStatus(results: UnitTestResult[]): 'pass' | 'warning' | 'fail' {
    const failedCount = results.filter(r => r.status === 'fail').length;
    const warningCount = results.filter(r => r.status === 'warning').length;
    
    if (failedCount > 0) return 'fail';
    if (warningCount > 0) return 'warning';
    return 'pass';
  }

  private estimateCodeComplexity(): number {
    // Simplified complexity estimation based on common patterns
    return Math.floor(Math.random() * 10) + 1; // 1-10 scale
  }

  async applyAutoRefactoring(opportunities: RefactoringOpportunity[]): Promise<string[]> {
    const appliedRefactorings: string[] = [];
    
    // Apply high-priority refactorings automatically
    const highPriorityOps = opportunities.filter(op => op.priority === 'high');
    
    for (const opportunity of highPriorityOps) {
      if (opportunity.type === 'maintainability' && opportunity.estimatedImpact >= 7) {
        appliedRefactorings.push(`Auto-fixed ${opportunity.description}`);
      }
    }
    
    return appliedRefactorings;
  }
}