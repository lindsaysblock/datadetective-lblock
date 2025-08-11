import { useState } from 'react';
import { TestResultCard } from '../../../types/testing';
import { QATestSuites } from '../../../utils/qa/qaTestSuites';
import { TestRunner } from '../../../utils/qa/testRunner';
import { TestFixService } from '../../../utils/testing/testFixService';
import { useToast } from '@/hooks/use-toast';

const TEST_SUITES = [
  { name: 'Component Tests', method: 'testComponents', progress: 8 },
  { name: 'Data Flow Tests', method: 'testDataFlow', progress: 16 },
  { name: 'Data Validation Tests', method: 'testDataValidation', progress: 24 },
  { name: 'Column Identification Tests', method: 'testColumnIdentification', progress: 32 },
  { name: 'Analytics Tests', method: 'testAnalytics', progress: 40 },
  { name: 'Analytics Load Tests', method: 'testAnalyticsLoad', progress: 48 },
  { name: 'Analytics Performance Tests', method: 'testAnalyticsPerformance', progress: 56 },
  { name: 'User Experience Tests', method: 'testUserExperience', progress: 64 },
  { name: 'Data Integrity Tests', method: 'testDataIntegrity', progress: 72 },
  { name: 'Authentication Tests', method: 'testAuthentication', progress: 80 },
  { name: 'Routing Tests', method: 'testRouting', progress: 88 },
  { name: 'System Health Tests', method: 'testSystemHealth', progress: 96 },
  { name: 'API Integration Tests', method: 'testAPIIntegration', progress: 100 }
] as const;

interface TestState {
  isRunning: boolean;
  progress: number;
  currentTest: string;
  testResults: TestResultCard[];
}

export const useE2ETestRunner = () => {
  const [state, setState] = useState<TestState>({
    isRunning: false,
    progress: 0,
    currentTest: '',
    testResults: []
  });
  const { toast } = useToast();

  const updateState = (updates: Partial<TestState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const runAllTests = async (): Promise<void> => {
    updateState({ isRunning: true, progress: 0, testResults: [] });
    
    toast({
      title: "🚀 Comprehensive E2E Testing Started",
      description: "Running all test suites including QA, performance, and data pipeline tests",
    });

    const results: TestResultCard[] = [];
    
    try {
      const qaTestSuites = new QATestSuites();
      const testRunner = new TestRunner(qaTestSuites);
      qaTestSuites.clearResults();

      for (const suite of TEST_SUITES) {
        updateState({ currentTest: suite.name, progress: suite.progress });
        
        const result = await runSingleTestSuite(suite, qaTestSuites);
        results.push(result);
        updateState({ testResults: [...results] });
      }
      
      showCompletionToast(results);
    } catch (error) {
      showErrorToast();
      console.error('E2E Test Error:', error);
    } finally {
      updateState({ isRunning: false, currentTest: '' });
    }
  };

  const runSingleTestSuite = async (
    suite: typeof TEST_SUITES[number], 
    qaTestSuites: QATestSuites
  ): Promise<TestResultCard> => {
    const startCount = qaTestSuites.getResults().length;
    
    try {
      await executeTestMethod(suite.method, qaTestSuites);
      
      const endCount = qaTestSuites.getResults().length;
      const suiteTests = qaTestSuites.getResults().slice(startCount);
      
      return await buildTestResult(suite, suiteTests);
    } catch (error) {
      return {
        name: suite.name,
        status: 'error',
        details: `Test suite failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toLocaleTimeString()
      };
    }
  };

  const executeTestMethod = async (method: string, qaTestSuites: QATestSuites): Promise<void> => {
    const methodMap: Record<string, () => Promise<void>> = {
      'testComponents': () => qaTestSuites.testComponents(),
      'testDataFlow': () => qaTestSuites.testDataFlow(),
      'testDataValidation': () => qaTestSuites.testDataValidation(),
      'testColumnIdentification': () => qaTestSuites.testColumnIdentification(),
      'testAnalytics': () => qaTestSuites.testAnalytics(),
      'testAnalyticsLoad': () => qaTestSuites.testAnalyticsLoad(),
      'testAnalyticsPerformance': () => qaTestSuites.testAnalyticsPerformance(),
      'testUserExperience': () => qaTestSuites.testUserExperience(),
      'testDataIntegrity': () => qaTestSuites.testDataIntegrity(),
      'testAuthentication': () => qaTestSuites.testAuthentication(),
      'testRouting': () => qaTestSuites.testRouting(),
      'testSystemHealth': () => qaTestSuites.testSystemHealth(),
      'testAPIIntegration': () => qaTestSuites.testAPIIntegration()
    };

    const testMethod = methodMap[method];
    if (!testMethod) {
      throw new Error(`Unknown test method: ${method}`);
    }

    await testMethod();
  };

  const buildTestResult = async (
    suite: typeof TEST_SUITES[number], 
    suiteTests: any[]
  ): Promise<TestResultCard> => {
    const passed = suiteTests.filter(t => t.status === 'pass').length;
    const failed = suiteTests.filter(t => t.status === 'fail').length;
    const warnings = suiteTests.filter(t => t.status === 'warning').length;
    
    const status = failed > 0 ? 'error' : warnings > 0 ? 'warning' : 'success';

    const failureDetails = suiteTests
      .filter((t: any) => t.status === 'fail')
      .map((t: any) => `${t.testName}: ${t.message}`)
      .join('\n');
    
    const fixService = TestFixService.getInstance();
    const [fixes, availableOptimizations] = await Promise.all([
      failed > 0 ? fixService.getAvailableFixes(suite.name, failureDetails, suiteTests) : Promise.resolve([]),
      fixService.getOptimizations(suite.name)
    ]);
    
    return {
      name: suite.name,
      status,
      details: `${passed}/${suiteTests.length} tests passed${failed > 0 ? `, ${failed} failed` : ''}${warnings > 0 ? `, ${warnings} warnings` : ''}`,
      timestamp: new Date().toLocaleTimeString(),
      failedTests: failed,
      warningTests: warnings,
      fixes,
      availableOptimizations,
      expandedData: {
        testResults: suiteTests,
        testSuites: [suite.name],
        coverage: Math.round((passed / suiteTests.length) * 100)
      },
      metrics: {
        testsRun: suiteTests.length,
        passed,
        failed,
        warnings,
        coverage: Math.round((passed / suiteTests.length) * 100)
      }
    };
  };

  const showCompletionToast = (results: TestResultCard[]): void => {
    const failed = results.filter(r => r.status === 'error').length;
    const warnings = results.filter(r => r.status === 'warning').length;
    const passed = results.filter(r => r.status === 'success').length;
    
    if (failed === 0) {
      toast({
        title: "✅ Comprehensive E2E Tests Complete",
        description: `All test suites completed: ${passed} passed, ${warnings} warnings`,
      });
    } else {
      toast({
        title: "⚠️ E2E Tests Complete with Issues",
        description: `Tests completed: ${passed} passed, ${failed} failed, ${warnings} warnings`,
        variant: "destructive",
      });
    }
  };

  const showErrorToast = (): void => {
    toast({
      title: "❌ E2E Test Error",
      description: "An error occurred during comprehensive testing",
      variant: "destructive",
    });
  };

  return {
    ...state,
    runAllTests
  };
};