
import { CodingStandards } from './codingStandards';
import { ComplianceReport } from './types';

export class AutoComplianceSystem {
  private static instance: AutoComplianceSystem;
  private readonly COMPLIANCE_THRESHOLD = 80;
  private readonly CHECK_INTERVAL = 30000; // 30 seconds
  private monitoringActive = false;
  private intervalId: NodeJS.Timeout | null = null;

  static getInstance(): AutoComplianceSystem {
    if (!this.instance) {
      this.instance = new AutoComplianceSystem();
    }
    return this.instance;
  }

  async runComplianceCheck(): Promise<ComplianceReport> {
    console.log('🔍 Running comprehensive compliance check...');
    
    try {
      // Mock file analysis - in a real implementation, this would scan actual files
      const mockFiles = this.getMockFileList();
      const reports: ComplianceReport[] = [];

      for (const file of mockFiles) {
        const report = CodingStandards.checkCompliance(file.content, file.path);
        reports.push(report);
      }

      const aggregatedReport = this.aggregateReports(reports);
      
      if (aggregatedReport.overallScore < this.COMPLIANCE_THRESHOLD) {
        console.log(`⚠️ Compliance score (${aggregatedReport.overallScore}%) below threshold (${this.COMPLIANCE_THRESHOLD}%)`);
        await this.triggerAutoFixes(aggregatedReport);
      } else {
        console.log(`✅ Compliance check passed: ${aggregatedReport.overallScore}%`);
      }

      return aggregatedReport;
    } catch (error) {
      console.error('❌ Compliance check failed:', error);
      throw error;
    }
  }

  startMonitoring(): void {
    if (this.monitoringActive) return;
    
    this.monitoringActive = true;
    console.log('🤖 Auto-compliance monitoring started');
    
    this.intervalId = setInterval(() => {
      this.runComplianceCheck().catch(console.error);
    }, this.CHECK_INTERVAL);
  }

  stopMonitoring(): void {
    if (!this.monitoringActive) return;
    
    this.monitoringActive = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('⏹️ Auto-compliance monitoring stopped');
  }

  private getMockFileList() {
    return [
      {
        path: 'src/components/Example.tsx',
        content: `
          import React from 'react';
          export const Example = ({ data }: { data: any }) => {
            return <div>{data}</div>;
          };
        `
      }
    ];
  }

  private aggregateReports(reports: ComplianceReport[]): ComplianceReport {
    if (reports.length === 0) {
      return {
        overallScore: 0,
        totalRules: 0,
        passedRules: 0,
        failedRules: 0,
        categories: {},
        violations: []
      };
    }

    const totalRules = reports.reduce((sum, report) => sum + report.totalRules, 0);
    const passedRules = reports.reduce((sum, report) => sum + report.passedRules, 0);
    const overallScore = Math.round((passedRules / totalRules) * 100);

    const allViolations = reports.flatMap(report => report.violations);
    const categories = this.mergeCategoryData(reports);

    return {
      overallScore,
      totalRules,
      passedRules,
      failedRules: totalRules - passedRules,
      categories,
      violations: allViolations
    };
  }

  private mergeCategoryData(reports: ComplianceReport[]) {
    const merged: { [key: string]: { score: number; passed: number; failed: number } } = {};
    
    for (const report of reports) {
      for (const [category, data] of Object.entries(report.categories)) {
        if (!merged[category]) {
          merged[category] = { score: 0, passed: 0, failed: 0 };
        }
        merged[category].passed += data.passed;
        merged[category].failed += data.failed;
      }
    }

    // Recalculate scores
    for (const category in merged) {
      const total = merged[category].passed + merged[category].failed;
      merged[category].score = Math.round((merged[category].passed / total) * 100);
    }

    return merged;
  }

  private async triggerAutoFixes(report: ComplianceReport): Promise<void> {
    const criticalViolations = CodingStandards.getHighPriorityViolations(report);
    
    console.log(`🔧 Triggering auto-fixes for ${criticalViolations.length} critical violations`);
    
    for (const violation of criticalViolations) {
      console.log(`🔧 Auto-fixing: ${violation.ruleName}`);
      // In a real implementation, this would apply automated fixes
    }
  }
}

// Export singleton instance
export const autoComplianceSystem = AutoComplianceSystem.getInstance();
