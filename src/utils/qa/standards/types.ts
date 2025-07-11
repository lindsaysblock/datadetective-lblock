
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
  overallScore: number;
  totalRules: number;
  passedRules: number;
  failedRules: number;
  categories: {
    [key: string]: {
      score: number;
      passed: number;
      failed: number;
    };
  };
  violations: Array<{
    ruleId: string;
    ruleName: string;
    severity: string;
    message: string;
    suggestions: string[];
  }>;
}
