
import { QATestSuites } from '../qaTestSuites';

export class RoutingTestSuite {
  private qaTestSuites: QATestSuites;

  constructor(qaTestSuites: QATestSuites) {
    this.qaTestSuites = qaTestSuites;
  }

  async runRoutingTests(): Promise<void> {
    const currentPath = window.location.pathname;
    const validRoutes = ['/', '/dashboard', '/auth', '/not-found'];
    const isValidRoute = validRoutes.includes(currentPath);
    
    this.qaTestSuites.addTestResult({
      testName: 'Route Navigation',
      status: isValidRoute ? 'pass' : 'fail',
      message: isValidRoute 
        ? `Current route ${currentPath} is valid`
        : `Invalid route detected: ${currentPath}`
    });

    const navLinks = document.querySelectorAll('nav a, [data-nav-link]');
    this.qaTestSuites.addTestResult({
      testName: 'Navigation Links',
      status: navLinks.length > 0 ? 'pass' : 'warning',
      message: `Found ${navLinks.length} navigation links`
    });
  }
}
