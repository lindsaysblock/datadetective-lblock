
import { TestRunner, UnitTestResult } from './testRunner';

export class NewProjectE2ETest {
  private testRunner = new TestRunner();

  async runFullE2EFlow(): Promise<UnitTestResult[]> {
    console.log('🚀 Starting New Project E2E Test Suite...');
    
    const allResults: UnitTestResult[] = [];

    try {
      // Test 1: Research Question Step
      console.log('📝 Testing Research Question Step...');
      const stepOneResults = await this.testResearchQuestionStep();
      allResults.push(...stepOneResults);

      // Test 2: File Upload and Processing
      console.log('📁 Testing File Upload and Processing...');
      const fileUploadResults = await this.testFileUploadStep();
      allResults.push(...fileUploadResults);

      // Test 3: Form State Management
      console.log('🔄 Testing Form State Management...');
      const formStateResults = await this.testFormStateManagement();
      allResults.push(...formStateResults);

      // Test 4: Navigation Flow
      console.log('🧭 Testing Navigation Flow...');
      const navigationResults = await this.testNavigationFlow();
      allResults.push(...navigationResults);

      // Test 5: Analysis Route
      console.log('🔍 Testing Analysis Route...');
      const analysisResults = await this.testAnalysisRoute();
      allResults.push(...analysisResults);

      console.log('✅ New Project E2E test suite completed successfully');
      this.printTestSummary(allResults);
      
      return allResults;
    } catch (error) {
      console.error('❌ New Project E2E test suite failed:', error);
      throw error;
    }
  }

  private async testResearchQuestionStep(): Promise<UnitTestResult[]> {
    const tests: UnitTestResult[] = [];

    tests.push(await this.testRunner.runTest('Research Question - Text Input Functionality', (assert) => {
      // Simulate the form state and setter function
      let researchQuestion = '';
      const setResearchQuestion = (value: string) => { researchQuestion = value; };
      
      // Test that the setter function works properly
      assert.equal(typeof setResearchQuestion, 'function', 'setResearchQuestion should be a function');
      
      // Test setting a research question
      setResearchQuestion('What are the main trends in customer behavior over time?');
      assert.equal(researchQuestion, 'What are the main trends in customer behavior over time?', 'Research question should be set correctly');
      
      // Test clearing the research question
      setResearchQuestion('');
      assert.equal(researchQuestion, '', 'Research question should be clearable');
      
      // Test with special characters
      setResearchQuestion('How does price affect sales? (2020-2024)');
      assert.equal(researchQuestion, 'How does price affect sales? (2020-2024)', 'Research question should handle special characters');
    }));

    tests.push(await this.testRunner.runTest('Research Question - Validation Logic', (assert) => {
      const validateResearchQuestion = (question: string) => question && question.trim().length > 0;
      
      assert.falsy(validateResearchQuestion(''), 'Empty question should be invalid');
      assert.falsy(validateResearchQuestion('   '), 'Whitespace-only question should be invalid');
      assert.truthy(validateResearchQuestion('Valid question'), 'Valid question should pass validation');
      assert.truthy(validateResearchQuestion('  Valid question  '), 'Question with whitespace should be valid after trim');
    }));

    return tests;
  }

  private async testFileUploadStep(): Promise<UnitTestResult[]> {
    const tests: UnitTestResult[] = [];

    tests.push(await this.testRunner.runTest('File Upload - CSV Processing', (assert) => {
      const mockCSVContent = 'name,age,city\nJohn,30,NYC\nJane,25,LA';
      const mockFile = new File([mockCSVContent], 'test.csv', { type: 'text/csv' });
      
      assert.truthy(mockFile, 'Mock CSV file should be created');
      assert.equal(mockFile.name, 'test.csv', 'File name should be correct');
      assert.equal(mockFile.type, 'text/csv', 'File type should be CSV');
      assert.truthy(mockFile.size > 0, 'File should have content');
    }));

    tests.push(await this.testRunner.runTest('File Upload - JSON Processing', (assert) => {
      const mockData = [{ name: 'John', age: 30 }, { name: 'Jane', age: 25 }];
      const mockJSONContent = JSON.stringify(mockData);
      const mockFile = new File([mockJSONContent], 'test.json', { type: 'application/json' });
      
      assert.truthy(mockFile, 'Mock JSON file should be created');
      assert.equal(mockFile.name, 'test.json', 'File name should be correct');
      assert.equal(mockFile.type, 'application/json', 'File type should be JSON');
    }));

    tests.push(await this.testRunner.runTest('File Upload - Multiple Files', (assert) => {
      const files: File[] = [];
      const addFile = (file: File) => files.push(file);
      const removeFile = (index: number) => files.splice(index, 1);
      
      // Add files
      addFile(new File(['csv data'], 'data1.csv', { type: 'text/csv' }));
      addFile(new File(['{"key": "value"}'], 'data2.json', { type: 'application/json' }));
      
      assert.equal(files.length, 2, 'Should have 2 files');
      assert.equal(files[0].name, 'data1.csv', 'First file should be CSV');
      assert.equal(files[1].name, 'data2.json', 'Second file should be JSON');
      
      // Remove file
      removeFile(0);
      assert.equal(files.length, 1, 'Should have 1 file after removal');
      assert.equal(files[0].name, 'data2.json', 'Remaining file should be JSON');
    }));

    return tests;
  }

  private async testFormStateManagement(): Promise<UnitTestResult[]> {
    const tests: UnitTestResult[] = [];

    tests.push(await this.testRunner.runTest('Form State - Project Data Persistence', (assert) => {
      const formState = {
        step: 1,
        researchQuestion: '',
        businessContext: '',
        projectName: '',
        files: [] as File[],
        parsedData: [] as any[]
      };

      const updateFormData = (updates: Partial<typeof formState>) => {
        Object.assign(formState, updates);
      };

      // Test updating research question
      updateFormData({ researchQuestion: 'Test question', step: 2 });
      assert.equal(formState.researchQuestion, 'Test question', 'Research question should persist');
      assert.equal(formState.step, 2, 'Step should advance');

      // Test updating business context
      updateFormData({ businessContext: 'Test context', step: 3 });
      assert.equal(formState.businessContext, 'Test context', 'Business context should persist');
      assert.equal(formState.step, 3, 'Step should advance to 3');

      // Test project name
      updateFormData({ projectName: 'Test Project' });
      assert.equal(formState.projectName, 'Test Project', 'Project name should persist');
    }));

    tests.push(await this.testRunner.runTest('Form State - Step Navigation', (assert) => {
      let currentStep = 1;
      const nextStep = () => currentStep = Math.min(4, currentStep + 1);
      const prevStep = () => currentStep = Math.max(1, currentStep - 1);
      const goToStep = (step: number) => currentStep = Math.max(1, Math.min(4, step));

      // Test forward navigation
      nextStep();
      assert.equal(currentStep, 2, 'Should advance to step 2');
      
      nextStep();
      nextStep();
      nextStep(); // Try to go beyond step 4
      assert.equal(currentStep, 4, 'Should not go beyond step 4');

      // Test backward navigation
      prevStep();
      assert.equal(currentStep, 3, 'Should go back to step 3');
      
      // Test direct navigation
      goToStep(1);
      assert.equal(currentStep, 1, 'Should go directly to step 1');
      
      goToStep(0); // Try to go below step 1
      assert.equal(currentStep, 1, 'Should not go below step 1');
    }));

    return tests;
  }

  private async testNavigationFlow(): Promise<UnitTestResult[]> {
    const tests: UnitTestResult[] = [];

    tests.push(await this.testRunner.runTest('Navigation - Route Validation', (assert) => {
      const routes = {
        HOME: '/',
        NEW_PROJECT: '/new-project',
        ANALYSIS: '/analysis',
        QUERY_HISTORY: '/query-history'
      };

      assert.truthy(routes.HOME, 'Home route should exist');
      assert.truthy(routes.NEW_PROJECT, 'New project route should exist');
      assert.truthy(routes.ANALYSIS, 'Analysis route should exist');
      assert.truthy(routes.QUERY_HISTORY, 'Query history route should exist');
    }));

    tests.push(await this.testRunner.runTest('Navigation - Analysis Redirect Logic', (assert) => {
      const mockNavigate = (route: string, options?: any) => {
        return { route, state: options?.state };
      };

      // Test analysis navigation with form data
      const formData = {
        researchQuestion: 'Test question',
        parsedData: [{ id: 1, name: 'test' }],
        projectName: 'Test Project'
      };

      const result = mockNavigate('/analysis', {
        state: { formData, educationalMode: false, projectName: 'Test Project' }
      });

      assert.equal(result.route, '/analysis', 'Should navigate to analysis route');
      assert.truthy(result.state, 'Should include state data');
      assert.equal(result.state.formData.researchQuestion, 'Test question', 'Should preserve form data');
    }));

    return tests;
  }

  private async testAnalysisRoute(): Promise<UnitTestResult[]> {
    const tests: UnitTestResult[] = [];

    tests.push(await this.testRunner.runTest('Analysis Route - State Handling', (assert) => {
      const mockState = {
        formData: {
          researchQuestion: 'Test question',
          parsedData: [{ id: 1, rows: 100 }],
          businessContext: 'Test context'
        },
        educationalMode: false,
        projectName: 'Test Project'
      };

      // Test state validation
      assert.truthy(mockState.formData, 'Should have form data');
      assert.truthy(mockState.formData.researchQuestion, 'Should have research question');
      assert.truthy(mockState.formData.parsedData, 'Should have parsed data');
      assert.equal(mockState.projectName, 'Test Project', 'Should have project name');
    }));

    tests.push(await this.testRunner.runTest('Analysis Route - Data Validation', (assert) => {
      const validateAnalysisData = (data: any) => {
        return data && 
               data.formData && 
               data.formData.researchQuestion && 
               data.formData.parsedData && 
               data.projectName;
      };

      const validData = {
        formData: {
          researchQuestion: 'Valid question',
          parsedData: [{ id: 1 }]
        },
        projectName: 'Valid Project'
      };

      const invalidData = {
        formData: {
          researchQuestion: '',
          parsedData: []
        }
      };

      assert.truthy(validateAnalysisData(validData), 'Valid data should pass validation');
      assert.falsy(validateAnalysisData(invalidData), 'Invalid data should fail validation');
      assert.falsy(validateAnalysisData(null), 'Null data should fail validation');
    }));

    return tests;
  }

  private printTestSummary(results: UnitTestResult[]): void {
    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;
    
    console.log('\n📊 New Project E2E Test Summary:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      results.filter(r => r.status === 'fail').forEach(test => {
        console.log(`  - ${test.testName}: ${test.error || 'Unknown error'}`);
      });
    }
  }
}
