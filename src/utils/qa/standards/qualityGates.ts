
import { CodeMetrics } from './codeMetrics';
import { ComplianceReport } from './types';

export interface QualityGate {
  id: string;
  name: string;
  description: string;
  threshold: number;
  metric: keyof CodeMetrics | 'complianceScore';
  operator: 'gt' | 'lt' | 'gte' | 'lte' | 'eq';
  severity: 'blocker' | 'critical' | 'major' | 'minor';
}

export interface QualityGateResult {
  gate: QualityGate;
  passed: boolean;
  actualValue: number;
  message: string;
}

export class QualityGateEngine {
  private static defaultGates: QualityGate[] = [
    {
      id: 'complexity-gate',
      name: 'Complexity Gate',
      description: 'Code complexity should not exceed threshold',
      threshold: 15,
      metric: 'complexity',
      operator: 'lte',
      severity: 'major'
    },
    {
      id: 'maintainability-gate', 
      name: 'Maintainability Gate',
      description: 'Maintainability index should be above threshold',
      threshold: 70,
      metric: 'maintainabilityIndex',
      operator: 'gte',
      severity: 'major'
    },
    {
      id: 'size-gate',
      name: 'File Size Gate',
      description: 'File should not exceed maximum lines',
      threshold: 300,
      metric: 'linesOfCode',
      operator: 'lte',
      severity: 'minor'
    },
    {
      id: 'duplication-gate',
      name: 'Code Duplication Gate',
      description: 'Duplicated code should be below threshold',
      threshold: 10,
      metric: 'duplicatedCode', 
      operator: 'lte',
      severity: 'major'
    },
    {
      id: 'compliance-gate',
      name: 'Compliance Gate',
      description: 'Compliance score should be above threshold',
      threshold: 80,
      metric: 'complianceScore',
      operator: 'gte',
      severity: 'blocker'
    }
  ];

  static evaluateGates(
    metrics: CodeMetrics, 
    complianceReport: ComplianceReport,
    customGates: QualityGate[] = []
  ): QualityGateResult[] {
    const allGates = [...this.defaultGates, ...customGates];
    const results: QualityGateResult[] = [];

    for (const gate of allGates) {
      const actualValue = gate.metric === 'complianceScore' 
        ? complianceReport.complianceScore 
        : metrics[gate.metric] as number;

      const passed = this.evaluateCondition(actualValue, gate.threshold, gate.operator);
      
      const message = passed 
        ? `✅ ${gate.name}: ${actualValue} ${this.getOperatorSymbol(gate.operator)} ${gate.threshold}`
        : `❌ ${gate.name}: ${actualValue} violates threshold ${gate.threshold} (${gate.operator})`;

      results.push({
        gate,
        passed,
        actualValue,
        message
      });
    }

    return results;
  }

  private static evaluateCondition(actual: number, threshold: number, operator: string): boolean {
    switch (operator) {
      case 'gt': return actual > threshold;
      case 'gte': return actual >= threshold;
      case 'lt': return actual < threshold;
      case 'lte': return actual <= threshold;
      case 'eq': return actual === threshold;
      default: return false;
    }
  }

  private static getOperatorSymbol(operator: string): string {
    switch (operator) {
      case 'gt': return '>';
      case 'gte': return '>=';
      case 'lt': return '<';
      case 'lte': return '<=';
      case 'eq': return '===';
      default: return operator;
    }
  }

  static generateQualityReport(results: QualityGateResult[]): string {
    const passed = results.filter(r => r.passed).length;
    const failed = results.length - passed;
    const blockers = results.filter(r => !r.passed && r.gate.severity === 'blocker').length;
    
    let report = `
🚪 Quality Gates Report
======================
📊 Gates Passed: ${passed}/${results.length}
🚫 Gates Failed: ${failed}
⛔ Blockers: ${blockers}

📋 Gate Results:
${results.map(result => `  ${result.message}`).join('\n')}
`;

    if (blockers > 0) {
      report += `\n🚨 QUALITY GATE FAILURE: ${blockers} blocker(s) detected. Deployment should be blocked.`;
    } else if (failed > 0) {
      report += `\n⚠️ QUALITY ISSUES: ${failed} gate(s) failed. Consider addressing before deployment.`;
    } else {
      report += `\n✅ ALL QUALITY GATES PASSED: Code meets quality standards.`;
    }

    return report.trim();
  }
}
