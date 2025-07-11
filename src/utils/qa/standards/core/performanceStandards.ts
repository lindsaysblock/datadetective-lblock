
import { CodeQualityRule, QualityCheck } from '../types';

export class PerformanceStandards {
  static getPerformanceRules(): CodeQualityRule[] {
    return [
      {
        id: 'performance-001',
        name: 'Component Re-render Optimization',
        description: 'Components should use React.memo, useMemo, or useCallback to prevent unnecessary re-renders',
        severity: 'medium',
        category: 'performance',
        check: (code: string) => this.checkMemoization(code),
        autoFix: false
      },
      {
        id: 'performance-002',
        name: 'Bundle Size Optimization',
        description: 'Individual files should not exceed 50KB to maintain optimal bundle performance',
        severity: 'high',
        category: 'performance',
        check: (code: string) => this.checkFileSize(code),
        autoFix: false
      },
      {
        id: 'performance-003',
        name: 'Lazy Loading Implementation',
        description: 'Large components should be lazy loaded to improve initial page load',
        severity: 'medium',
        category: 'performance',
        check: (code: string) => this.checkLazyLoading(code),
        autoFix: false
      }
    ];
  }

  private static checkMemoization(code: string): QualityCheck {
    const hasExpensiveOperations = /\.map\(|\.filter\(|\.reduce\(/.test(code);
    const hasMemoization = /React\.memo|useMemo|useCallback/.test(code);
    
    if (hasExpensiveOperations && !hasMemoization) {
      return {
        passed: false,
        message: 'Component contains expensive operations but lacks memoization',
        suggestions: ['Add React.memo wrapper', 'Use useMemo for expensive calculations', 'Use useCallback for function props']
      };
    }
    
    return { passed: true, message: 'Memoization properly implemented' };
  }

  private static checkFileSize(code: string): QualityCheck {
    const sizeInKB = new Blob([code]).size / 1024;
    
    if (sizeInKB > 50) {
      return {
        passed: false,
        message: `File size (${sizeInKB.toFixed(1)}KB) exceeds 50KB limit`,
        suggestions: ['Break into smaller components', 'Extract utilities to separate files', 'Use code splitting']
      };
    }
    
    return { passed: true, message: `File size (${sizeInKB.toFixed(1)}KB) is within limits` };
  }

  private static checkLazyLoading(code: string): QualityCheck {
    const hasLargeComponent = code.split('\n').length > 200;
    const hasLazyImport = /React\.lazy|import\(/.test(code);
    
    if (hasLargeComponent && !hasLazyImport) {
      return {
        passed: false,
        message: 'Large component should implement lazy loading',
        suggestions: ['Use React.lazy for component', 'Implement dynamic imports', 'Add Suspense boundaries']
      };
    }
    
    return { passed: true, message: 'Lazy loading properly implemented' };
  }
}
