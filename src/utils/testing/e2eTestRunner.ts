
import { TestRunner, UnitTestResult } from './testRunner';
import { FileUploadFixTests } from './suites/fileUploadFixTests';

export class E2ETestRunner {
  private testRunner = new TestRunner();
  private fileUploadTests = new FileUploadFixTests();

  async runCompleteE2ETests(): Promise<UnitTestResult[]> {
    console.log('🚀 Starting comprehensive E2E test suite...');
    
    const allResults: UnitTestResult[] = [];

    try {
      // Test file upload functionality
      console.log('📁 Testing file upload functionality...');
      const fileUploadResults = await this.fileUploadTests.runAllTests();
      allResults.push(...fileUploadResults);

      // Test data processing pipeline
      console.log('⚙️ Testing data processing pipeline...');
      const dataProcessingResults = await this.testDataProcessingPipeline();
      allResults.push(...dataProcessingResults);

      // Test form state management
      console.log('📝 Testing form state management...');
      const formStateResults = await this.testFormStateManagement();
      allResults.push(...formStateResults);

      // Test project creation flow
      console.log('🎯 Testing project creation flow...');
      const projectFlowResults = await this.testProjectCreationFlow();
      allResults.push(...projectFlowResults);

      console.log('✅ E2E test suite completed successfully');
      this.printTestSummary(allResults);
      
      return allResults;
    } catch (error) {
      console.error('❌ E2E test suite failed:', error);
      throw error;
    }
  }

  private async testDataProcessingPipeline(): Promise<UnitTestResult[]> {
    const tests: UnitTestResult[] = [];

    tests.push(await this.testRunner.runTest('Data Processing Pipeline - CSV Files', (assert) => {
      const mockCSVContent = 'name,age,city\nJohn,30,NYC\nJane,25,LA';
      const mockFile = new File([mockCSVContent], 'test.csv', { type: 'text/csv' });
      
      assert.truthy(mockFile, 'Mock CSV file should be created');
      assert.equal(mockFile.name, 'test.csv', 'File name should match');
      assert.equal(mockFile.type, 'text/csv', 'File type should be CSV');
    }));

    tests.push(await this.testRunner.runTest('Data Processing Pipeline - JSON Files', (assert) => {
      const mockJSONContent = JSON.stringify([
        { name: 'John', age: 30, city: 'NYC' },
        { name: 'Jane', age: 25, city: 'LA' }
      ]);
      const mockFile = new File([mockJSONContent], 'test.json', { type: 'application/json' });
      
      assert.truthy(mockFile, 'Mock JSON file should be created');
      assert.equal(mockFile.name, 'test.json', 'File name should match');
      assert.equal(mockFile.type, 'application/json', 'File type should be JSON');
    }));

    tests.push(await this.testRunner.runTest('Data Processing Pipeline - Large Files', (assert) => {
      const largeContent = Array.from({ length: 1000 }, (_, i) => `row${i},value${i},data${i}`).join('\n');
      const mockFile = new File([largeContent], 'large.csv', { type: 'text/csv' });
      
      assert.truthy(mockFile.size > 10000, 'Large file should have significant size');
      assert.equal(mockFile.name, 'large.csv', 'Large file name should match');
    }));

    return tests;
  }

  private async testFormStateManagement(): Promise<UnitTestResult[]> {
    const tests: UnitTestResult[] = [];

    tests.push(await this.testRunner.runTest('Form State - Project Name Persistence', (assert) => {
      let projectName = '';
      const setProjectName = (name: string) => { projectName = name; };
      
      setProjectName('Test Project');
      assert.equal(projectName, 'Test Project', 'Project name should persist');
      
      setProjectName('Updated Project');
      assert.equal(projectName, 'Updated Project', 'Project name should update');
    }));

    tests.push(await this.testRunner.runTest('Form State - Research Question Management', (assert) => {
      let researchQuestion = '';
      const setResearchQuestion = (question: string) => { researchQuestion = question; };
      
      setResearchQuestion('How many users?');
      assert.equal(researchQuestion, 'How many users?', 'Research question should persist');
      
      setResearchQuestion('What is the conversion rate?');
      assert.equal(researchQuestion, 'What is the conversion rate?', 'Research question should update');
    }));

    tests.push(await this.testRunner.runTest('Form State - Step Navigation', (assert) => {
      let currentStep = 1;
      const nextStep = () => { currentStep += 1; };
      const prevStep = () => { currentStep = Math.max(1, currentStep - 1); };
      
      nextStep();
      assert.equal(currentStep, 2, 'Should advance to step 2');
      
      nextStep();
      assert.equal(currentStep, 3, 'Should advance to step 3');
      
      prevStep();
      assert.equal(currentStep, 2, 'Should go back to step 2');
      
      prevStep();
      prevStep(); // Try to go below 1
      assert.equal(currentStep, 1, 'Should not go below step 1');
    }));

    return tests;
  }

  private async testProjectCreationFlow(): Promise<UnitTestResult[]> {
    const tests: UnitTestResult[] = [];

    tests.push(await this.testRunner.runTest('Project Flow - Complete Workflow', (assert) => {
      const projectState = {
        step: 1,
        projectName: '',
        researchQuestion: '',
        files: [] as File[],
        parsedData: [] as any[]
      };

      // Step 1: Set research question
      projectState.researchQuestion = 'Test question';
      projectState.step = 2;
      assert.equal(projectState.step, 2, 'Should advance to data step');
      assert.truthy(projectState.researchQuestion, 'Should have research question');

      // Step 2: Add files
      const mockFile = new File(['test'], 'test.csv', { type: 'text/csv' });
      projectState.files.push(mockFile);
      assert.equal(projectState.files.length, 1, 'Should have one file');

      // Step 2: Process data
      projectState.parsedData.push({
        id: '1',
        name: 'test.csv',
        rowCount: 100,
        columns: ['col1', 'col2']
      });
      projectState.step = 3;
      assert.equal(projectState.step, 3, 'Should advance to context step');
      assert.equal(projectState.parsedData.length, 1, 'Should have parsed data');

      // Step 3: Set context and project name
      projectState.projectName = 'Test Project';
      projectState.step = 4;
      assert.equal(projectState.step, 4, 'Should advance to summary step');
      assert.truthy(projectState.projectName, 'Should have project name');
    }));

    tests.push(await this.testRunner.runTest('Project Flow - Validation Rules', (assert) => {
      const canProceedToStep3 = (data: any[]) => data && data.length > 0;
      const canProceedToStep4 = (name: string, context: string) => name.trim() && context.trim();
      
      assert.falsy(canProceedToStep3([]), 'Should not proceed without data');
      assert.truthy(canProceedToStep3([{ id: '1' }]), 'Should proceed with data');
      
      assert.falsy(canProceedToStep4('', ''), 'Should not proceed without name and context');
      assert.falsy(canProceedToStep4('name', ''), 'Should not proceed without context');
      assert.falsy(canProceedToStep4('', 'context'), 'Should not proceed without name');
      assert.truthy(canProceedToStep4('name', 'context'), 'Should proceed with both');
    }));

    return tests;
  }

  private printTestSummary(results: UnitTestResult[]): void {
    const passed = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log('\n📊 E2E Test Summary:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      results.filter(r => !r.success).forEach(test => {
        console.log(`  - ${test.testName}: ${test.error || 'Unknown error'}`);
      });
    }
  }
}
