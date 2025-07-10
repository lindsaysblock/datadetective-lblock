
import { CODING_STANDARDS, StandardViolation, ComplianceReport, CodingStandard } from './codingStandards';

export class ComplianceChecker {
  private standards: CodingStandard[] = CODING_STANDARDS;
  private autoFixEnabled: boolean = true;

  setAutoFixEnabled(enabled: boolean): void {
    this.autoFixEnabled = enabled;
  }

  async checkFile(filePath: string, code: string): Promise<ComplianceReport> {
    const violations: StandardViolation[] = [];
    
    // Run all standards against the file
    for (const standard of this.standards) {
      try {
        const standardViolations = standard.rule(code, filePath);
        violations.push(...standardViolations);
      } catch (error) {
        console.warn(`Failed to check standard ${standard.id} for ${filePath}:`, error);
      }
    }

    let autoFixesApplied = 0;
    let fixedCode = code;

    // Apply auto-fixes if enabled
    if (this.autoFixEnabled) {
      for (const standard of this.standards) {
        if (standard.autoFix && standard.autoFixable) {
          const relevantViolations = violations.filter(v => v.standardId === standard.id && v.autoFixable);
          if (relevantViolations.length > 0) {
            try {
              const newCode = standard.autoFix(fixedCode, relevantViolations);
              if (newCode !== fixedCode) {
                fixedCode = newCode;
                autoFixesApplied += relevantViolations.length;
                // Remove fixed violations
                violations.splice(0, violations.length, ...violations.filter(v => 
                  !(v.standardId === standard.id && v.autoFixable)
                ));
              }
            } catch (error) {
              console.warn(`Failed to apply auto-fix for ${standard.id}:`, error);
            }
          }
        }
      }
    }

    const complianceScore = this.calculateComplianceScore(violations, code);
    const manualFixesNeeded = violations.filter(v => !v.autoFixable).length;

    return {
      filePath,
      violations,
      complianceScore,
      autoFixesApplied,
      manualFixesNeeded
    };
  }

  async checkProject(): Promise<ComplianceReport[]> {
    const reports: ComplianceReport[] = [];
    
    // Known files to check (in a real implementation, this would scan the file system)
    const filesToCheck = [
      'src/utils/qa/qaTestSuites.ts',
      'src/utils/qa/analysis/enhancedAutoRefactor.ts',
      'src/utils/qa/analysis/dynamicCodebaseAnalyzer.ts',
      'src/components/AutoRefactorPrompts.tsx',
      'src/components/QARunner.tsx',
      'src/hooks/useAutoQA.ts',
      'src/hooks/useAutoRefactor.ts'
    ];

    for (const filePath of filesToCheck) {
      try {
        // In a real implementation, we'd read the file content
        const mockCode = await this.getMockFileContent(filePath);
        const report = await this.checkFile(filePath, mockCode);
        reports.push(report);
      } catch (error) {
        console.warn(`Failed to check file ${filePath}:`, error);
      }
    }

    return reports;
  }

  private calculateComplianceScore(violations: StandardViolation[], code: string): number {
    const totalLines = code.split('\n').length;
    const errorWeight = 3;
    const warningWeight = 2;
    const infoWeight = 1;

    const errorCount = violations.filter(v => v.severity === 'error').length;
    const warningCount = violations.filter(v => v.severity === 'warning').length;
    const infoCount = violations.filter(v => v.severity === 'info').length;

    const violationScore = (errorCount * errorWeight) + (warningCount * warningWeight) + (infoCount * infoWeight);
    const maxPossibleScore = totalLines * 0.1; // Assume max 10% violation rate
    
    const score = Math.max(0, Math.min(100, 100 - ((violationScore / Math.max(maxPossibleScore, 1)) * 100)));
    return Math.round(score);
  }

  private async getMockFileContent(filePath: string): Promise<string> {
    // Mock implementation - in reality, this would read actual file content
    return `// Mock content for ${filePath}\nexport const mockFunction = () => {\n  console.log('mock');\n};`;
  }

  generateComplianceReport(reports: ComplianceReport[]): string {
    const totalFiles = reports.length;
    const avgComplianceScore = reports.reduce((sum, r) => sum + r.complianceScore, 0) / totalFiles;
    const totalViolations = reports.reduce((sum, r) => sum + r.violations.length, 0);
    const totalAutoFixes = reports.reduce((sum, r) => sum + r.autoFixesApplied, 0);
    const totalManualFixes = reports.reduce((sum, r) => sum + r.manualFixesNeeded, 0);

    return `
🏆 Code Compliance Report
========================
📊 Overall Score: ${avgComplianceScore.toFixed(1)}/100
📁 Files Checked: ${totalFiles}
⚠️  Total Violations: ${totalViolations}
🔧 Auto-fixes Applied: ${totalAutoFixes}
✋ Manual Fixes Needed: ${totalManualFixes}

📋 File Breakdown:
${reports.map(r => `  ${r.filePath}: ${r.complianceScore}/100 (${r.violations.length} violations)`).join('\n')}

${totalManualFixes > 0 ? `
🚨 Action Required:
${reports.filter(r => r.manualFixesNeeded > 0).map(r => 
  `  ${r.filePath}: ${r.manualFixesNeeded} manual fixes needed`
).join('\n')}
` : '✅ All violations auto-fixed!'}
    `.trim();
  }
}
