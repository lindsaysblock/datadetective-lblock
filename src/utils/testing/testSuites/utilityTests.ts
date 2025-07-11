
import { TestRunner, UnitTestResult, AssertionHelper } from '../testRunner';

export class UtilityTestSuite {
  private testRunner = new TestRunner();

  async runAllTests(): Promise<UnitTestResult[]> {
    const tests: UnitTestResult[] = [];

    tests.push(await this.testUtilityFunctions());
    tests.push(await this.testDataValidation());
    tests.push(await this.testErrorHandling());
    tests.push(await this.testFormatting());

    return tests;
  }

  private async testUtilityFunctions(): Promise<UnitTestResult> {
    return this.testRunner.runTest('Utility Functions', (assert: AssertionHelper) => {
      const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };
      
      assert.equal(formatBytes(1024), '1 KB', 'Should format bytes correctly');
      assert.equal(formatBytes(0), '0 Bytes', 'Should handle zero bytes');
    });
  }

  private async testDataValidation(): Promise<UnitTestResult> {
    return this.testRunner.runTest('Data Validation', (assert: AssertionHelper) => {
      const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };
      
      assert.truthy(isValidEmail('test@example.com'), 'Valid email should pass validation');
      assert.falsy(isValidEmail('invalid-email'), 'Invalid email should fail validation');
    });
  }

  private async testErrorHandling(): Promise<UnitTestResult> {
    return this.testRunner.runTest('Error Handling', (assert: AssertionHelper) => {
      const safeParseJSON = (jsonString: string) => {
        try {
          return { success: true, data: JSON.parse(jsonString) };
        } catch (error) {
          return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
      };
      
      const validResult = safeParseJSON('{"test": true}');
      const invalidResult = safeParseJSON('invalid json');
      
      assert.truthy(validResult.success, 'Valid JSON should parse successfully');
      assert.falsy(invalidResult.success, 'Invalid JSON should return error');
    });
  }

  private async testFormatting(): Promise<UnitTestResult> {
    return this.testRunner.runTest('Formatting', (assert: AssertionHelper) => {
      const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
      };
      
      const testDate = new Date('2024-01-15');
      const formatted = formatDate(testDate);
      
      assert.equal(formatted, '2024-01-15', 'Date should be formatted correctly');
    });
  }
}
