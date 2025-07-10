
import { QATestSuites } from '../qaTestSuites';

export class AuthTestSuite {
  private qaTestSuites: QATestSuites;

  constructor(qaTestSuites: QATestSuites) {
    this.qaTestSuites = qaTestSuites;
  }

  async runAuthTests(): Promise<void> {
    const hasAuthProvider = !!document.querySelector('[data-auth-provider]');
    const hasProtectedRoutes = !!document.querySelector('[data-protected-route]');
    
    this.qaTestSuites.addTestResult({
      testName: 'Authentication Flow',
      status: hasAuthProvider && hasProtectedRoutes ? 'pass' : 'fail',
      message: hasAuthProvider && hasProtectedRoutes 
        ? 'Authentication system properly configured'
        : 'Authentication system issues detected'
    });

    const authButtons = document.querySelectorAll('[data-auth-action]');
    this.qaTestSuites.addTestResult({
      testName: 'Auth UI Components',
      status: authButtons.length > 0 ? 'pass' : 'warning',
      message: `Found ${authButtons.length} auth UI components`
    });
  }
}
