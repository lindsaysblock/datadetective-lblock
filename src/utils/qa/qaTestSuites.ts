import { QATestResult } from './types';
import { TestRunner } from './testRunner';
import { EnhancedDataValidationTests } from '../testing/suites/enhancedDataValidationTests';

export class QATestSuites {
  private testRunner: TestRunner;
  private results: QATestResult[] = [];

  constructor(testRunner: TestRunner) {
    this.testRunner = testRunner;
  }

  addTestResult(result: QATestResult): void {
    this.results.push(result);
  }

  clearResults(): void {
    this.results = [];
  }

  getResults(): QATestResult[] {
    return this.results;
  }

  async testDataValidation(): Promise<void> {
    console.log('🔍 Running enhanced data validation tests...');
    
    try {
      const dataQualityResults = await EnhancedDataValidationTests.runDataQualityTests();
      const relationshipResults = await EnhancedDataValidationTests.runDataRelationshipTests();
      const recommendationResults = await EnhancedDataValidationTests.runRecommendationEngineTests();
      
      [...dataQualityResults, ...relationshipResults, ...recommendationResults].forEach(result => {
        this.addTestResult({
          testName: result.testName,
          status: result.status,
          message: result.message,
          suggestions: result.status === 'fail' ? [
            'Review data quality validation logic',
            'Ensure proper error handling for invalid data',
            'Add more comprehensive edge case testing'
          ] : undefined
        });
      });

    } catch (error) {
      this.addTestResult({
        testName: 'Enhanced Data Validation Tests',
        status: 'fail',
        message: `Data validation tests failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  async testColumnIdentification(): Promise<void> {
    console.log('📊 Running column identification tests...');
    
    try {
      const columnResults = await EnhancedDataValidationTests.runColumnIdentificationTests();
      
      columnResults.forEach(result => {
        this.addTestResult({
          testName: result.testName,
          status: result.status,
          message: result.message,
          suggestions: result.status === 'fail' ? [
            'Improve column type detection algorithms',
            'Add more training data for auto-detection',
            'Enhance user mapping validation'
          ] : undefined
        });
      });

    } catch (error) {
      this.addTestResult({
        testName: 'Column Identification Tests',
        status: 'fail',
        message: `Column identification tests failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  }

  async testComponents(): Promise<void> {
    // Implement component tests or delegate to testRunner
  }

  async testDataFlow(): Promise<void> {
    // Implement data flow tests or delegate to testRunner
  }

  async testAnalytics(): Promise<void> {
    // Implement analytics tests or delegate to testRunner
  }

  async testAnalyticsLoad(): Promise<void> {
    // Implement analytics load tests or delegate to testRunner
  }

  async testAnalyticsPerformance(): Promise<void> {
    // Implement analytics performance tests or delegate to testRunner
  }

  async testUserExperience(): Promise<void> {
    // Implement user experience tests or delegate to testRunner
  }

  async testDataIntegrity(): Promise<void> {
    // Implement data integrity tests or delegate to testRunner
  }

  async testAuthentication(): Promise<void> {
    // Implement authentication tests or delegate to testRunner
  }

  async testRouting(): Promise<void> {
    // Implement routing tests or delegate to testRunner
  }

  async testSystemHealth(): Promise<void> {
    // Implement system health tests or delegate to testRunner
  }
}
