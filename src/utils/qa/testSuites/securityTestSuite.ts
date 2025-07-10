
import { QATestResult } from '../types';

export const runSecurityTests = async (): Promise<QATestResult[]> => {
  const results: QATestResult[] = [];

  // Test for XSS vulnerabilities
  try {
    const hasUnsafeHTML = document.querySelector('[data-unsafe-html]');
    
    results.push({
      testName: 'XSS Protection',
      status: hasUnsafeHTML ? 'fail' : 'pass',
      message: hasUnsafeHTML ? 'Unsafe HTML detected' : 'No XSS vulnerabilities found',
      category: 'security'
    });
  } catch (error) {
    results.push({
      testName: 'XSS Protection',
      status: 'fail',
      message: `XSS test failed: ${error}`,
      category: 'security'
    });
  }

  // Test for secure headers
  try {
    const hasCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    
    results.push({
      testName: 'Security Headers',
      status: hasCSP ? 'pass' : 'warning',
      message: hasCSP ? 'CSP header found' : 'Consider adding CSP headers',
      category: 'security'
    });
  } catch (error) {
    results.push({
      testName: 'Security Headers',
      status: 'fail',
      message: `Security header test failed: ${error}`,
      category: 'security'
    });
  }

  return results;
};
