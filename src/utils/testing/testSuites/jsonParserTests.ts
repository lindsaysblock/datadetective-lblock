
import { TestRunner, UnitTestResult, AssertionHelper } from '../testRunner';

export class JSONParserTestSuite {
  private testRunner = new TestRunner();

  async runAllTests(): Promise<UnitTestResult[]> {
    const tests: UnitTestResult[] = [];

    tests.push(await this.testJSONParsingBasicFunctionality());
    tests.push(await this.testJSONParsingNestedObjects());
    tests.push(await this.testJSONParsingArrays());
    tests.push(await this.testJSONParsingInvalidFormat());

    return tests;
  }

  private async testJSONParsingBasicFunctionality(): Promise<UnitTestResult> {
    return this.testRunner.runTest('JSON Parsing Basic Functionality', (assert: AssertionHelper) => {
      const jsonString = '{"name": "John", "age": 30}';
      
      try {
        const parsed = JSON.parse(jsonString);
        assert.equal(parsed.name, 'John', 'Should parse name correctly');
        assert.equal(parsed.age, 30, 'Should parse age correctly');
      } catch (error) {
        assert.truthy(false, 'Valid JSON should parse without errors');
      }
    });
  }

  private async testJSONParsingNestedObjects(): Promise<UnitTestResult> {
    return this.testRunner.runTest('JSON Parsing Nested Objects', (assert: AssertionHelper) => {
      const jsonString = '{"user": {"name": "John", "details": {"age": 30}}}';
      
      try {
        const parsed = JSON.parse(jsonString);
        assert.equal(parsed.user.name, 'John', 'Should parse nested name');
        assert.equal(parsed.user.details.age, 30, 'Should parse deeply nested age');
      } catch (error) {
        assert.truthy(false, 'Valid nested JSON should parse without errors');
      }
    });
  }

  private async testJSONParsingArrays(): Promise<UnitTestResult> {
    return this.testRunner.runTest('JSON Parsing Arrays', (assert: AssertionHelper) => {
      const jsonString = '[{"name": "John"}, {"name": "Jane"}]';
      
      try {
        const parsed = JSON.parse(jsonString);
        assert.truthy(Array.isArray(parsed), 'Should parse as array');
        assert.equal(parsed.length, 2, 'Should have 2 items');
        assert.equal(parsed[0].name, 'John', 'First item should have correct name');
      } catch (error) {
        assert.truthy(false, 'Valid JSON array should parse without errors');
      }
    });
  }

  private async testJSONParsingInvalidFormat(): Promise<UnitTestResult> {
    return this.testRunner.runTest('JSON Parsing Invalid Format', (assert: AssertionHelper) => {
      const invalidJSON = '{name: "John", age: 30}'; // Missing quotes around property names
      
      try {
        JSON.parse(invalidJSON);
        assert.truthy(false, 'Invalid JSON should throw an error');
      } catch (error) {
        assert.truthy(true, 'Invalid JSON should be handled gracefully');
      }
    });
  }
}
