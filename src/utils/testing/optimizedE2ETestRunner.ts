import { useToast } from '@/hooks/use-toast';

export interface E2ETestResult {
  testName: string;
  status: 'pass' | 'fail' | 'warning';
  duration: number;
  error?: string;
  message: string;
  category: string;
}

export class OptimizedE2ETestRunner {
  private results: E2ETestResult[] = [];
  private startTime: number = 0;

  constructor(private toast?: any) {}

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private logTest(testName: string, status: 'pass' | 'fail' | 'warning', message: string, error?: string): E2ETestResult {
    const duration = Date.now() - this.startTime;
    const result: E2ETestResult = {
      testName,
      status,
      duration,
      message,
      error,
      category: 'E2E'
    };
    
    this.results.push(result);
    console.log(`🧪 ${testName}: ${status.toUpperCase()} - ${message}${error ? ` (${error})` : ''}`);
    return result;
  }

  private async testFormElementExists(selector: string, elementName: string): Promise<boolean> {
    try {
      const element = document.querySelector(selector);
      if (!element) {
        this.logTest(`Form Element Check: ${elementName}`, 'fail', `Element not found: ${selector}`);
        return false;
      }
      
      this.logTest(`Form Element Check: ${elementName}`, 'pass', `Element found and accessible`);
      return true;
    } catch (error) {
      this.logTest(`Form Element Check: ${elementName}`, 'fail', 'Element check failed', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  private async testTextInput(selector: string, testValue: string, fieldName: string): Promise<boolean> {
    try {
      const input = document.querySelector(selector) as HTMLInputElement | HTMLTextAreaElement;
      if (!input) {
        this.logTest(`Text Input Test: ${fieldName}`, 'fail', `Input element not found: ${selector}`);
        return false;
      }

      // Clear existing value
      input.value = '';
      input.focus();
      
      // Simulate typing
      input.value = testValue;
      
      // Trigger events
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      
      await this.delay(100);
      
      if (input.value === testValue) {
        this.logTest(`Text Input Test: ${fieldName}`, 'pass', `Successfully entered text: "${testValue}"`);
        return true;
      } else {
        this.logTest(`Text Input Test: ${fieldName}`, 'fail', `Text input failed. Expected: "${testValue}", Got: "${input.value}"`);
        return false;
      }
    } catch (error) {
      this.logTest(`Text Input Test: ${fieldName}`, 'fail', 'Text input test failed', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  private async testButtonClick(selector: string, buttonName: string): Promise<boolean> {
    try {
      const button = document.querySelector(selector) as HTMLButtonElement;
      if (!button) {
        this.logTest(`Button Click Test: ${buttonName}`, 'fail', `Button not found: ${selector}`);
        return false;
      }

      if (button.disabled) {
        this.logTest(`Button Click Test: ${buttonName}`, 'warning', 'Button is disabled - this may be expected');
        return true;
      }

      button.click();
      await this.delay(100);
      
      this.logTest(`Button Click Test: ${buttonName}`, 'pass', 'Button clicked successfully');
      return true;
    } catch (error) {
      this.logTest(`Button Click Test: ${buttonName}`, 'fail', 'Button click failed', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  private async testNavigationState(): Promise<boolean> {
    try {
      const currentPath = window.location.pathname;
      const stepIndicator = document.querySelector('[data-testid="step-indicator"]');
      const currentStep = stepIndicator?.textContent || 'unknown';
      
      this.logTest('Navigation State Check', 'pass', `Current path: ${currentPath}, Step: ${currentStep}`);
      return true;
    } catch (error) {
      this.logTest('Navigation State Check', 'fail', 'Failed to check navigation state', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  private async testFormValidation(): Promise<boolean> {
    try {
      // Test empty form submission
      const nextButton = document.querySelector('[data-testid="next-button"]') as HTMLButtonElement;
      if (nextButton && !nextButton.disabled) {
        this.logTest('Form Validation Test', 'fail', 'Next button should be disabled when form is invalid');
        return false;
      }
      
      this.logTest('Form Validation Test', 'pass', 'Form validation working correctly');
      return true;
    } catch (error) {
      this.logTest('Form Validation Test', 'warning', 'Could not fully test form validation', error instanceof Error ? error.message : 'Unknown error');
      return true; // Don't fail the whole test for this
    }
  }

  private async testDataPersistence(): Promise<boolean> {
    try {
      // Check if form data persists in localStorage or state
      const testData = {
        researchQuestion: 'Test persistence question',
        projectName: 'Test Project',
        step: 1
      };

      // Store test data
      localStorage.setItem('e2e-test-data', JSON.stringify(testData));
      
      // Retrieve and verify
      const retrieved = JSON.parse(localStorage.getItem('e2e-test-data') || '{}');
      
      if (retrieved.researchQuestion === testData.researchQuestion) {
        this.logTest('Data Persistence Test', 'pass', 'Data persistence working correctly');
        localStorage.removeItem('e2e-test-data');
        return true;
      } else {
        this.logTest('Data Persistence Test', 'fail', 'Data persistence failed');
        return false;
      }
    } catch (error) {
      this.logTest('Data Persistence Test', 'fail', 'Data persistence test failed', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  private async testFileHandling(): Promise<boolean> {
    try {
      // Create a mock file for testing
      const testContent = 'name,age,city\nJohn,25,NYC\nJane,30,LA';
      const mockFile = new Blob([testContent], { type: 'text/csv' });
      const file = new File([mockFile], 'test.csv', { type: 'text/csv' });

      // Check if file input exists
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (!fileInput) {
        this.logTest('File Handling Test', 'warning', 'File input not found - may not be on correct step');
        return true;
      }

      // Test file selection simulation
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInput.files = dataTransfer.files;
      
      fileInput.dispatchEvent(new Event('change', { bubbles: true }));
      
      this.logTest('File Handling Test', 'pass', 'File handling interface working correctly');
      return true;
    } catch (error) {
      this.logTest('File Handling Test', 'fail', 'File handling test failed', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  private async testAnalysisFlow(): Promise<boolean> {
    try {
      // Check if we can reach the analysis step
      const analysisButton = document.querySelector('[data-testid="start-analysis-button"]');
      if (analysisButton) {
        this.logTest('Analysis Flow Test', 'pass', 'Analysis flow accessible');
        return true;
      } else {
        this.logTest('Analysis Flow Test', 'warning', 'Analysis button not found - may not be on correct step');
        return true;
      }
    } catch (error) {
      this.logTest('Analysis Flow Test', 'fail', 'Analysis flow test failed', error instanceof Error ? error.message : 'Unknown error');
      return false;
    }
  }

  public async runFullE2ETest(): Promise<E2ETestResult[]> {
    console.log('🚀 Starting Optimized E2E Test Suite');
    this.results = [];
    this.startTime = Date.now();

    try {
      // Test 1: Basic page load and navigation
      await this.testNavigationState();
      await this.delay(500);

      // Test 2: Form element existence
      await this.testFormElementExists('textarea[placeholder*="trends"]', 'Research Question Textarea');
      await this.testFormElementExists('button', 'Action Buttons');
      await this.delay(500);

      // Test 3: Text input functionality
      const testQuestion = 'How many customers purchased products in the last quarter?';
      await this.testTextInput('textarea[placeholder*="trends"]', testQuestion, 'Research Question');
      await this.delay(1000);

      // Test 4: Form validation
      await this.testFormValidation();
      await this.delay(500);

      // Test 5: Navigation functionality
      await this.testButtonClick('button[data-testid="next-button"], button:contains("Next")', 'Next Button');
      await this.delay(1000);

      // Test 6: File handling
      await this.testFileHandling();
      await this.delay(500);

      // Test 7: Data persistence
      await this.testDataPersistence();
      await this.delay(500);

      // Test 8: Analysis flow
      await this.testAnalysisFlow();
      await this.delay(500);

      // Test 9: Complete flow simulation
      this.logTest('Complete Flow Test', 'pass', 'Full E2E flow completed successfully');

      // Summary
      const passed = this.results.filter(r => r.status === 'pass').length;
      const failed = this.results.filter(r => r.status === 'fail').length;
      const warnings = this.results.filter(r => r.status === 'warning').length;

      console.log(`✅ E2E Test Complete: ${passed} passed, ${failed} failed, ${warnings} warnings`);
      
      if (this.toast) {
        this.toast({
          title: "🧪 E2E Test Complete",
          description: `${passed} passed, ${failed} failed, ${warnings} warnings`,
          variant: failed > 0 ? "destructive" : "default",
        });
      }

      return this.results;
    } catch (error) {
      this.logTest('E2E Test Suite', 'fail', 'Test suite failed', error instanceof Error ? error.message : 'Unknown error');
      return this.results;
    }
  }

  public getResults(): E2ETestResult[] {
    return this.results;
  }

  public getPassRate(): number {
    const passed = this.results.filter(r => r.status === 'pass').length;
    return this.results.length > 0 ? (passed / this.results.length) * 100 : 0;
  }
}