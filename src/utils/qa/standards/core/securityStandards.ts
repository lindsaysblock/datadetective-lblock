
import { CodeQualityRule, QualityCheck } from '../types';

export class SecurityStandards {
  static getSecurityRules(): CodeQualityRule[] {
    return [
      {
        id: 'security-001',
        name: 'XSS Prevention',
        description: 'Prevent cross-site scripting vulnerabilities',
        severity: 'critical',
        category: 'security',
        check: (code: string) => this.checkXSSPrevention(code),
        autoFix: false
      },
      {
        id: 'security-002',
        name: 'Sensitive Data Exposure',
        description: 'Ensure no sensitive data is exposed in client-side code',
        severity: 'critical',
        category: 'security',
        check: (code: string) => this.checkSensitiveData(code),
        autoFix: false
      },
      {
        id: 'security-003',
        name: 'Input Validation',
        description: 'All user inputs should be properly validated',
        severity: 'high',
        category: 'security',
        check: (code: string) => this.checkInputValidation(code),
        autoFix: false
      }
    ];
  }

  private static checkXSSPrevention(code: string): QualityCheck {
    const dangerousPatterns = [
      /dangerouslySetInnerHTML/,
      /innerHTML\s*=/,
      /document\.write/,
      /eval\(/
    ];

    const hasDangerousPattern = dangerousPatterns.some(pattern => pattern.test(code));
    
    if (hasDangerousPattern) {
      return {
        passed: false,
        message: 'Potential XSS vulnerability detected',
        suggestions: [
          'Use React JSX instead of dangerouslySetInnerHTML',
          'Sanitize HTML content before rendering',
          'Avoid eval() and similar functions',
          'Use textContent instead of innerHTML'
        ]
      };
    }
    
    return { passed: true, message: 'No XSS vulnerabilities detected' };
  }

  private static checkSensitiveData(code: string): QualityCheck {
    const sensitivePatterns = [
      /password\s*[:=]\s*['"]/i,
      /api[_-]?key\s*[:=]\s*['"]/i,
      /secret\s*[:=]\s*['"]/i,
      /token\s*[:=]\s*['"]/i
    ];

    const hasSensitiveData = sensitivePatterns.some(pattern => pattern.test(code));
    
    if (hasSensitiveData) {
      return {
        passed: false,
        message: 'Potential sensitive data exposure in client code',
        suggestions: [
          'Move sensitive data to environment variables',
          'Use server-side API calls for sensitive operations',
          'Implement proper secret management'
        ]
      };
    }
    
    return { passed: true, message: 'No sensitive data exposure detected' };
  }

  private static checkInputValidation(code: string): QualityCheck {
    const hasFormInputs = /input|textarea|select/i.test(code);
    const hasValidation = /validate|schema|yup|zod/i.test(code);
    
    if (hasFormInputs && !hasValidation) {
      return {
        passed: false,
        message: 'Form inputs detected without validation',
        suggestions: [
          'Add input validation using schema libraries',
          'Implement client-side validation',
          'Add server-side validation'
        ]
      };
    }
    
    return { passed: true, message: 'Input validation properly implemented' };
  }
}
