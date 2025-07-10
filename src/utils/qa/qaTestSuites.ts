import { QATestResult, QAReport } from './types';
import { runComponentTests } from './testSuites/componentTestSuite';
import { runUtilityTests } from './testSuites/utilityTestSuite';
import { runSystemTests } from './testSuites/systemTestSuite';
import { runPerformanceTests } from './testSuites/performanceTestSuite';
import { runSecurityTests } from './testSuites/securityTestSuite';
import { runAccessibilityTests } from './testSuites/accessibilityTestSuite';
import { runDataHandlingTests } from './testSuites/dataHandlingTestSuite';
import { runQueryBuilderTests } from './testSuites/queryBuilderTestSuite';
import { runAnalysisComponentTests } from './testSuites/analysisComponentTestSuite';

export const runQATests = async (): Promise<QAReport> => {
  console.log('🔍 Running QA Test Suite...');
  
  const allResults: QATestResult[] = [];
  const startTime = performance.now();
  
  try {
    // Run component tests
    console.log('🔬 Testing Components...');
    const componentResults = runComponentTests();
    allResults.push(...componentResults);

    // Run utility function tests
    console.log('🧪 Testing Utility Functions...');
    const utilityResults = runUtilityTests();
    allResults.push(...utilityResults);

    // Run system tests
    console.log('⚙️ Testing System...');
    const systemResults = runSystemTests();
    allResults.push(...systemResults);

  } catch (error) {
    console.error('❌ QA Test Suite failed:', error);
    allResults.push({
      testName: 'QA Test Suite Execution',
      status: 'fail',
      message: `Test suite execution failed: ${error}`,
      category: 'system'
    });
  }
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  const passed = allResults.filter(result => result.status === 'pass').length;
  const failed = allResults.filter(result => result.status === 'fail').length;
  const warnings = allResults.filter(result => result.status === 'warning').length;
  const totalTests = allResults.length;
  
  const overall = failed > 0 ? 'fail' : warnings > 0 ? 'warning' : 'pass';
  
  console.log(`\n📊 QA Test Results:`);
  console.log(`  Overall Status: ${overall.toUpperCase()}`);
  console.log(`  Total Tests: ${totalTests}`);
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Warnings: ${warnings}`);
  console.log(`  Duration: ${duration.toFixed(2)}ms\n`);
  
  return {
    overall,
    passed,
    failed,
    warnings,
    totalTests,
    results: allResults,
    performanceMetrics: {
      duration
    },
    refactoringRecommendations: []
  };
};

export const runEnhancedQATests = async (): Promise<QAReport> => {
  console.log('🔍 Running Enhanced QA Test Suite...');
  
  const allResults: QATestResult[] = [];
  const startTime = performance.now();
  
  try {
    // Run component tests
    console.log('🔬 Testing Components...');
    const componentResults = runComponentTests();
    allResults.push(...componentResults);

    // Run utility function tests
    console.log('🧪 Testing Utility Functions...');
    const utilityResults = runUtilityTests();
    allResults.push(...utilityResults);

    // Run system tests
    console.log('⚙️ Testing System...');
    const systemResults = runSystemTests();
    allResults.push(...systemResults);

    // Run performance tests
    console.log('⏱️ Testing Performance...');
    const performanceResults = await runPerformanceTests();
    allResults.push(...performanceResults);

    // Run security tests
    console.log('🛡️ Testing Security...');
    const securityResults = await runSecurityTests();
    allResults.push(...securityResults);

    // Run accessibility tests
    console.log('♿ Testing Accessibility...');
    const accessibilityResults = await runAccessibilityTests();
    allResults.push(...accessibilityResults);

    // Run data handling tests
    console.log('🗂️ Testing Data Handling...');
    const dataHandlingResults = runDataHandlingTests();
    allResults.push(...dataHandlingResults);

    // Run query builder tests
    console.log('🔎 Testing Query Builder...');
    const queryBuilderResults = runQueryBuilderTests();
    allResults.push(...queryBuilderResults);
    
    // Add analysis component tests
    console.log('🔬 Testing Analysis Components...');
    const analysisResults = runAnalysisComponentTests();
    allResults.push(...analysisResults);
    
  } catch (error) {
    console.error('❌ QA Test Suite failed:', error);
    allResults.push({
      testName: 'QA Test Suite Execution',
      status: 'fail',
      message: `Test suite execution failed: ${error}`,
      category: 'system'
    });
  }
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  const passed = allResults.filter(result => result.status === 'pass').length;
  const failed = allResults.filter(result => result.status === 'fail').length;
  const warnings = allResults.filter(result => result.status === 'warning').length;
  const totalTests = allResults.length;
  
  const overall = failed > 0 ? 'fail' : warnings > 0 ? 'warning' : 'pass';
  
  const renderTimeResult = allResults.find(r => r.testName === 'Component Render Time');
  const renderTime = renderTimeResult ? parseFloat(renderTimeResult.message.split(' ')[0]) : 0;

  const systemEfficiencyResult = allResults.find(r => r.testName === 'System Efficiency');
  const systemEfficiency = systemEfficiencyResult ? parseFloat(systemEfficiencyResult.message.replace('%', '')) : undefined;

  const memoryEfficiencyResult = allResults.find(r => r.testName === 'Memory Efficiency');
  const memoryEfficiency = memoryEfficiencyResult ? parseFloat(memoryEfficiencyResult.message.replace('%', '')) : undefined;
  
  console.log(`\n📊 QA Test Results:`);
  console.log(`  Overall Status: ${overall.toUpperCase()}`);
  console.log(`  Total Tests: ${totalTests}`);
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Warnings: ${warnings}`);
  console.log(`  Duration: ${duration.toFixed(2)}ms\n`);
  
  return {
    overall,
    passed,
    failed,
    warnings,
    totalTests,
    results: allResults,
    performanceMetrics: {
      duration,
      renderTime,
      systemEfficiency,
      memoryEfficiency
    },
    refactoringRecommendations: []
  };
};

export type QARunner = {
  runQATests: () => Promise<QAReport>;
  runEnhancedQATests: () => Promise<QAReport>;
};
