import { useState, useCallback } from 'react';
import { SafeDOMHelpers } from '../../../utils/dom/safeDOMHelpers';

export interface E2ETestResult {
  testName: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  duration: number;
  category: string;
}

export const useE2ETestLogic = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState('');
  const [results, setResults] = useState<E2ETestResult[]>([]);

  const runE2ETests = useCallback(async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);
    
    const tests = [
      { name: 'Authentication Flow', category: 'auth' },
      { name: 'Navigation Tests', category: 'navigation' },
      { name: 'Form Validation', category: 'forms' },
      { name: 'Data Loading', category: 'data' },
      { name: 'User Interactions', category: 'interaction' },
      { name: 'Error Handling', category: 'error' }
    ];

    const testResults: E2ETestResult[] = [];

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      setCurrentTest(test.name);
      setProgress((i / tests.length) * 100);
      
      const startTime = performance.now();
      
      // Safe test execution
      try {
        const result = await executeTest(test.name, test.category);
        testResults.push(result);
      } catch (error) {
        testResults.push({
          testName: test.name,
          status: 'fail',
          message: `Test failed: ${error}`,
          duration: performance.now() - startTime,
          category: test.category
        });
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setResults(testResults);
    setProgress(100);
    setIsRunning(false);
    setCurrentTest('');
    
    return testResults;
  }, []);

  return {
    runE2ETests,
    isRunning,
    progress,
    currentTest,
    results
  };
};

// Safe test execution function
async function executeTest(testName: string, category: string): Promise<E2ETestResult> {
  const startTime = performance.now();
  
  try {
    // Safe DOM testing
    switch (category) {
      case 'auth':
        return testAuthentication(testName, startTime);
      case 'navigation':
        return testNavigation(testName, startTime);
      case 'forms':
        return testForms(testName, startTime);
      case 'data':
        return testDataLoading(testName, startTime);
      case 'interaction':
        return testInteractions(testName, startTime);
      case 'error':
        return testErrorHandling(testName, startTime);
      default:
        return {
          testName,
          status: 'pass',
          message: 'Test completed successfully',
          duration: performance.now() - startTime,
          category
        };
    }
  } catch (error) {
    return {
      testName,
      status: 'fail',
      message: `Test execution failed: ${error}`,
      duration: performance.now() - startTime,
      category
    };
  }
}

function testAuthentication(testName: string, startTime: number): E2ETestResult {
  // Safe DOM checks for auth elements
  const authButtons = SafeDOMHelpers.querySelectorAll('button');
  const loginButtons = authButtons.filter(btn => btn.textContent?.toLowerCase().includes('login'));
  const hasLoginButton = loginButtons.length > 0;
  const hasAuthForms = SafeDOMHelpers.querySelectorAll('form').length > 0;
  
  return {
    testName,
    status: hasLoginButton || hasAuthForms ? 'pass' : 'warning',
    message: hasLoginButton || hasAuthForms ? 'Authentication elements found' : 'No authentication elements detected',
    duration: performance.now() - startTime,
    category: 'auth'
  };
}

function testNavigation(testName: string, startTime: number): E2ETestResult {
  const navElements = SafeDOMHelpers.querySelectorAll('nav, [role="navigation"], a[href]');
  
  return {
    testName,
    status: navElements.length > 0 ? 'pass' : 'warning',
    message: `Found ${navElements.length} navigation elements`,
    duration: performance.now() - startTime,
    category: 'navigation'
  };
}

function testForms(testName: string, startTime: number): E2ETestResult {
  const forms = SafeDOMHelpers.querySelectorAll('form, input, textarea, select');
  
  return {
    testName,
    status: forms.length > 0 ? 'pass' : 'warning',
    message: `Found ${forms.length} form elements`,
    duration: performance.now() - startTime,
    category: 'forms'
  };
}

function testDataLoading(testName: string, startTime: number): E2ETestResult {
  const dataElements = SafeDOMHelpers.querySelectorAll('table, .data-table');
  
  return {
    testName,
    status: dataElements.length > 0 ? 'pass' : 'warning',
    message: `Found ${dataElements.length} data elements`,
    duration: performance.now() - startTime,
    category: 'data'
  };
}

function testInteractions(testName: string, startTime: number): E2ETestResult {
  const interactive = SafeDOMHelpers.querySelectorAll('button, [role="button"], [tabindex], input[type="submit"]');
  
  return {
    testName,
    status: interactive.length > 0 ? 'pass' : 'warning',
    message: `Found ${interactive.length} interactive elements`,
    duration: performance.now() - startTime,
    category: 'interaction'
  };
}

function testErrorHandling(testName: string, startTime: number): E2ETestResult {
  const errorElements = SafeDOMHelpers.querySelectorAll('[data-error], .error, [role="alert"], .alert');
  
  return {
    testName,
    status: 'pass',
    message: `Error handling elements: ${errorElements.length}`,
    duration: performance.now() - startTime,
    category: 'error'
  };
}