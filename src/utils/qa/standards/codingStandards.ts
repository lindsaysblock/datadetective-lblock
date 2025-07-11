import { PerformanceStandards } from './core/performanceStandards';
import { SecurityStandards } from './core/securityStandards';
import { TypeStandards } from './core/typeStandards';
import { CodeQualityRule, ComplianceReport, CodingStandard, StandardViolation } from './types';

export type { ComplianceReport, StandardViolation, CodingStandard } from './types';

export class CodingStandards {
  private static allRules: CodeQualityRule[] = [
    ...PerformanceStandards.getPerformanceRules(),
    ...SecurityStandards.getSecurityRules(),
    ...TypeStandards.getTypeRules()
  ];

  static getAllRules(): CodeQualityRule[] {
    return this.allRules;
  }

  static checkCompliance(code: string, filePath?: string): ComplianceReport {
    const results = this.allRules.map(rule => ({
      rule,
      result: rule.check(code)
    }));

    const passedRules = results.filter(r => r.result.passed).length;
    const failedRules = results.length - passedRules;
    const overallScore = Math.round((passedRules / results.length) * 100);

    const categories: { [key: string]: { score: number; passed: number; failed: number } } = {};
    
    for (const { rule, result } of results) {
      if (!categories[rule.category]) {
        categories[rule.category] = { score: 0, passed: 0, failed: 0 };
      }
      
      if (result.passed) {
        categories[rule.category].passed++;
      } else {
        categories[rule.category].failed++;
      }
    }

    for (const category in categories) {
      const total = categories[category].passed + categories[category].failed;
      categories[category].score = Math.round((categories[category].passed / total) * 100);
    }

    const violations: StandardViolation[] = results
      .filter(r => !r.result.passed)
      .map(({ rule, result }) => ({
        standardId: rule.id,
        ruleName: rule.name,
        severity: rule.severity === 'critical' ? 'error' : rule.severity === 'high' ? 'warning' : 'info',
        message: result.message,
        line: 1,
        autoFixable: rule.autoFix,
        suggestions: result.suggestions || []
      }));

    return {
      filePath: filePath || 'unknown',
      violations,
      complianceScore: overallScore,
      autoFixesApplied: 0,
      manualFixesNeeded: violations.filter(v => !v.autoFixable).length,
      overallScore,
      totalRules: results.length,
      passedRules,
      failedRules,
      categories
    };
  }

  static getHighPriorityViolations(report: ComplianceReport) {
    return report.violations.filter(v => 
      v.severity === 'error' || v.severity === 'warning'
    );
  }
}

// Export the standards for backward compatibility
export const CODING_STANDARDS: CodingStandard[] = [];
