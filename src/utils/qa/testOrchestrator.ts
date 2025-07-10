
import { QATestSuites } from './qaTestSuites';
import { TestRunner } from './testRunner';
import { PerformanceAnalyzer } from './performanceAnalyzer';
import { RefactoringAnalyzer } from './refactoringAnalyzer';
import { PerformanceMonitor } from './performanceMonitor';

export class TestOrchestrator {
  private qaTestSuites: QATestSuites;
  private testRunner: TestRunner;
  private performanceAnalyzer: PerformanceAnalyzer;
  private refactoringAnalyzer: RefactoringAnalyzer;
  private performanceMonitor: PerformanceMonitor;

  constructor(qaTestSuites: QATestSuites) {
    this.qaTestSuites = qaTestSuites;
    this.testRunner = new TestRunner(qaTestSuites);
    this.performanceAnalyzer = new PerformanceAnalyzer(qaTestSuites);
    this.refactoringAnalyzer = new RefactoringAnalyzer(qaTestSuites);
    this.performanceMonitor = new PerformanceMonitor(qaTestSuites);
  }

  async runAllTests(): Promise<{ performanceMetrics: any; refactoringRecommendations: any }> {
    console.log('🔍 Starting comprehensive QA testing with enhanced performance monitoring...');
    this.qaTestSuites.clearResults();
    this.performanceMonitor.clearMetrics();

    // Run all test suites with performance tracking
    await this.performanceMonitor.runTestWithMetrics('Components', () => this.qaTestSuites.testComponents());
    await this.performanceMonitor.runTestWithMetrics('Data Flow', () => this.qaTestSuites.testDataFlow());
    await this.performanceMonitor.runTestWithMetrics('User Experience', () => this.qaTestSuites.testUserExperience());
    await this.performanceMonitor.runTestWithMetrics('Data Integrity', () => this.qaTestSuites.testDataIntegrity());
    await this.performanceMonitor.runTestWithMetrics('Authentication', () => this.qaTestSuites.testAuthentication());
    await this.performanceMonitor.runTestWithMetrics('Routing', () => this.qaTestSuites.testRouting());
    await this.performanceMonitor.runTestWithMetrics('System Health', () => this.qaTestSuites.testSystemHealth());

    // Run load and unit tests with enhanced monitoring
    await this.performanceMonitor.runTestWithMetrics('Load Tests', () => this.testRunner.runLoadTests());
    await this.performanceMonitor.runTestWithMetrics('Unit Tests', () => this.testRunner.runUnitTests());
    
    // Performance and refactoring analysis
    const performanceMetrics = await this.performanceMonitor.runTestWithMetrics('Performance Analysis', 
      () => this.performanceAnalyzer.analyzePerformance()
    );
    
    const refactoringRecommendations = await this.performanceMonitor.runTestWithMetrics('Refactoring Analysis',
      () => this.refactoringAnalyzer.analyzeRefactoringNeeds()
    );

    return { performanceMetrics, refactoringRecommendations };
  }

  getPerformanceMonitor(): PerformanceMonitor {
    return this.performanceMonitor;
  }
}
