
export interface CodeQualityRule {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'performance' | 'security' | 'types' | 'structure' | 'style';
  check: (code: string) => QualityCheck;
  autoFix: boolean;
}

export interface QualityCheck {
  passed: boolean;
  message: string;
  suggestions?: string[];
}

export interface ComplianceReport {
  filePath: string;
  violations: StandardViolation[];
  complianceScore: number;
  autoFixesApplied: number;
  manualFixesNeeded: number;
  overallScore?: number;
  totalRules?: number;
  passedRules?: number;
  failedRules?: number;
  categories?: {
    [key: string]: {
      score: number;
      passed: number;
      failed: number;
    };
  };
}

export interface StandardViolation {
  standardId: string;
  ruleName: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  line: number;
  autoFixable: boolean;
  suggestions?: string[];
}

export interface CodingStandard {
  id: string;
  name: string;
  description: string;
  severity: 'error' | 'warning' | 'info';
  autoFixable: boolean;
  rule: (code: string, filePath: string) => StandardViolation[];
  autoFix?: (code: string, violations: StandardViolation[]) => string;
}
