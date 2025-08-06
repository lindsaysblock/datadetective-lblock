export interface FailureSignature {
  pattern: RegExp;
  category: 'memory' | 'performance' | 'security' | 'data' | 'ui' | 'api' | 'build';
  severity: 'low' | 'medium' | 'high' | 'critical';
  fixStrategy: string;
  autoFixable: boolean;
}

export interface DetectedIssue {
  id: string;
  title: string;
  description: string;
  category: FailureSignature['category'];
  severity: FailureSignature['severity'];
  autoFixable: boolean;
  fixStrategy: string;
  affectedFiles?: string[];
  codeExample?: string;
  estimatedFixTime: number; // in minutes
  impact: 'low' | 'medium' | 'high';
}

export class SmartFailureDetector {
  private static failureSignatures: FailureSignature[] = [
    {
      pattern: /memory leak|excessive memory usage|heap out of memory/i,
      category: 'memory',
      severity: 'high',
      fixStrategy: 'cleanup-memory-leaks',
      autoFixable: true
    },
    {
      pattern: /component re-render|unnecessary render|render performance/i,
      category: 'performance',
      severity: 'medium',
      fixStrategy: 'optimize-renders',
      autoFixable: true
    },
    {
      pattern: /security vulnerability|xss|injection|unauthorized access/i,
      category: 'security',
      severity: 'critical',
      fixStrategy: 'security-hardening',
      autoFixable: false
    },
    {
      pattern: /data validation|null reference|undefined property/i,
      category: 'data',
      severity: 'high',
      fixStrategy: 'data-validation',
      autoFixable: true
    },
    {
      pattern: /ui inconsistency|layout shift|accessibility/i,
      category: 'ui',
      severity: 'medium',
      fixStrategy: 'ui-standardization',
      autoFixable: true
    },
    {
      pattern: /api timeout|network error|connection failed/i,
      category: 'api',
      severity: 'high',
      fixStrategy: 'api-resilience',
      autoFixable: true
    },
    {
      pattern: /bundle size|build optimization|code splitting/i,
      category: 'build',
      severity: 'medium',
      fixStrategy: 'build-optimization',
      autoFixable: true
    }
  ];

  static detectIssues(testName: string, errorMessage?: string, testResults?: any[]): DetectedIssue[] {
    const issues: DetectedIssue[] = [];
    const context = `${testName} ${errorMessage || ''}`.toLowerCase();
    
    // Analyze test results for patterns
    if (testResults) {
      const failedTests = testResults.filter(t => t.status === 'fail');
      const warningTests = testResults.filter(t => t.status === 'warning');
      
      // High failure rate indicates systemic issues
      if (failedTests.length > testResults.length * 0.3) {
        issues.push({
          id: 'systemic-failure',
          title: 'Systemic Test Failures',
          description: `${failedTests.length} out of ${testResults.length} tests failing indicates underlying architecture issues`,
          category: 'performance',
          severity: 'critical',
          autoFixable: false,
          fixStrategy: 'architecture-review',
          estimatedFixTime: 120,
          impact: 'high'
        });
      }
      
      // Memory-related failures
      const memoryIssues = failedTests.filter(t => 
        /memory|heap|leak|allocation/i.test(t.error || t.message || '')
      );
      if (memoryIssues.length > 0) {
        issues.push({
          id: 'memory-optimization',
          title: 'Memory Management Issues',
          description: 'Multiple tests failing due to memory usage patterns',
          category: 'memory',
          severity: 'high',
          autoFixable: true,
          fixStrategy: 'cleanup-memory-leaks',
          affectedFiles: ['src/hooks/*.ts', 'src/components/*.tsx'],
          codeExample: 'useEffect(() => { /* cleanup */ return () => cleanup(); }, [])',
          estimatedFixTime: 15,
          impact: 'high'
        });
      }
      
      // Performance issues
      const performanceIssues = failedTests.filter(t => 
        /slow|timeout|performance|render/i.test(t.error || t.message || '')
      );
      if (performanceIssues.length > 0) {
        issues.push({
          id: 'performance-optimization',
          title: 'Performance Bottlenecks',
          description: 'Tests indicate slow rendering and processing times',
          category: 'performance',
          severity: 'medium',
          autoFixable: true,
          fixStrategy: 'optimize-renders',
          affectedFiles: ['src/components/*.tsx', 'src/utils/*.ts'],
          codeExample: 'const memoizedComponent = React.memo(Component)',
          estimatedFixTime: 20,
          impact: 'medium'
        });
      }
    }
    
    // Pattern-based detection
    for (const signature of this.failureSignatures) {
      if (signature.pattern.test(context)) {
        issues.push(this.createIssueFromSignature(signature, testName));
      }
    }
    
    // Smart context-based detection
    if (testName.includes('Authentication')) {
      issues.push({
        id: 'auth-security',
        title: 'Authentication Security Enhancement',
        description: 'Strengthen authentication flows with additional security measures',
        category: 'security',
        severity: 'high',
        autoFixable: true,
        fixStrategy: 'security-hardening',
        affectedFiles: ['src/hooks/useAuth.ts', 'src/components/auth/*.tsx'],
        estimatedFixTime: 30,
        impact: 'high'
      });
    }
    
    if (testName.includes('Data') || testName.includes('Analytics')) {
      issues.push({
        id: 'data-validation',
        title: 'Data Validation Improvements',
        description: 'Add comprehensive data validation and error handling',
        category: 'data',
        severity: 'medium',
        autoFixable: true,
        fixStrategy: 'data-validation',
        affectedFiles: ['src/utils/dataProcessing.ts', 'src/types/*.ts'],
        codeExample: 'const schema = z.object({ /* validation rules */ })',
        estimatedFixTime: 25,
        impact: 'medium'
      });
    }
    
    return issues;
  }
  
  private static createIssueFromSignature(signature: FailureSignature, testName: string): DetectedIssue {
    const issueMap = {
      'cleanup-memory-leaks': {
        title: 'Memory Leak Detection',
        description: 'Clean up event listeners, subscriptions, and component references',
        estimatedFixTime: 15,
        impact: 'high' as const
      },
      'optimize-renders': {
        title: 'Render Optimization',
        description: 'Implement memoization and reduce unnecessary re-renders',
        estimatedFixTime: 20,
        impact: 'medium' as const
      },
      'security-hardening': {
        title: 'Security Hardening',
        description: 'Implement security best practices and vulnerability fixes',
        estimatedFixTime: 45,
        impact: 'high' as const
      },
      'data-validation': {
        title: 'Data Validation',
        description: 'Add robust data validation and error handling',
        estimatedFixTime: 25,
        impact: 'medium' as const
      },
      'ui-standardization': {
        title: 'UI Consistency',
        description: 'Standardize UI components and improve accessibility',
        estimatedFixTime: 30,
        impact: 'medium' as const
      },
      'api-resilience': {
        title: 'API Resilience',
        description: 'Add retry logic, error handling, and timeout management',
        estimatedFixTime: 35,
        impact: 'high' as const
      },
      'build-optimization': {
        title: 'Build Optimization',
        description: 'Optimize bundle size and build performance',
        estimatedFixTime: 40,
        impact: 'medium' as const
      }
    };
    
    const issueDetails = issueMap[signature.fixStrategy as keyof typeof issueMap] || {
      title: 'Generic Fix',
      description: 'Apply standard fix for detected issue',
      estimatedFixTime: 15,
      impact: 'medium' as const
    };
    
    return {
      id: `${signature.category}-${signature.fixStrategy}`,
      title: issueDetails.title,
      description: issueDetails.description,
      category: signature.category,
      severity: signature.severity,
      autoFixable: signature.autoFixable,
      fixStrategy: signature.fixStrategy,
      estimatedFixTime: issueDetails.estimatedFixTime,
      impact: issueDetails.impact
    };
  }
}