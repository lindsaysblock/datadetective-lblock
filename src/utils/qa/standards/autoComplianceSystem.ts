
import { ComplianceChecker } from './complianceChecker';
import { ComplianceReport } from './codingStandards';

export class AutoComplianceSystem {
  private checker = new ComplianceChecker();
  private isEnabled = true;
  private lastCheck: Date | null = null;
  private checkInterval = 5 * 60 * 1000; // 5 minutes

  async enableAutoCompliance(): Promise<void> {
    this.isEnabled = true;
    this.checker.setAutoFixEnabled(true);
    console.log('🤖 Auto-compliance system enabled');
    
    // Run initial check
    await this.runComplianceCheck();
    
    // Set up periodic checks
    this.startPeriodicChecks();
  }

  disableAutoCompliance(): void {
    this.isEnabled = false;
    this.checker.setAutoFixEnabled(false);
    console.log('🤖 Auto-compliance system disabled');
  }

  async runComplianceCheck(): Promise<ComplianceReport[]> {
    if (!this.isEnabled) return [];

    console.log('🔍 Running compliance check...');
    
    try {
      const reports = await this.checker.checkProject();
      const complianceReport = this.checker.generateComplianceReport(reports);
      
      console.log(complianceReport);
      
      // Trigger auto-fixes for critical violations
      await this.handleCriticalViolations(reports);
      
      this.lastCheck = new Date();
      return reports;
      
    } catch (error) {
      console.error('❌ Compliance check failed:', error);
      return [];
    }
  }

  private async handleCriticalViolations(reports: ComplianceReport[]): Promise<void> {
    const criticalReports = reports.filter(r => 
      r.complianceScore < 70 || 
      r.violations.some(v => v.severity === 'error')
    );

    if (criticalReports.length > 0) {
      console.log(`🚨 Found ${criticalReports.length} files with critical compliance issues`);
      
      // Dispatch event for auto-refactoring system
      const event = new CustomEvent('qa-compliance-critical', {
        detail: {
          reports: criticalReports,
          suggestions: this.generateRefactoringSuggestions(criticalReports)
        }
      });
      window.dispatchEvent(event);
    }
  }

  private generateRefactoringSuggestions(reports: ComplianceReport[]): Array<{
    file: string;
    message: string;
    autoExecute: boolean;
  }> {
    return reports.map(report => ({
      file: report.filePath,
      message: `Auto-fix compliance violations in ${report.filePath} (${report.violations.length} issues, score: ${report.complianceScore}/100). Apply coding standards and optimize for maintainability.`,
      autoExecute: report.complianceScore < 50 // Auto-execute for very low scores
    }));
  }

  private startPeriodicChecks(): void {
    if (!this.isEnabled) return;

    setInterval(async () => {
      if (this.isEnabled && this.shouldRunCheck()) {
        await this.runComplianceCheck();
      }
    }, this.checkInterval);
  }

  private shouldRunCheck(): boolean {
    if (!this.lastCheck) return true;
    
    const timeSinceLastCheck = Date.now() - this.lastCheck.getTime();
    return timeSinceLastCheck >= this.checkInterval;
  }

  getComplianceStatus(): {
    enabled: boolean;
    lastCheck: Date | null;
    nextCheck: Date | null;
  } {
    const nextCheck = this.lastCheck 
      ? new Date(this.lastCheck.getTime() + this.checkInterval)
      : new Date();

    return {
      enabled: this.isEnabled,
      lastCheck: this.lastCheck,
      nextCheck
    };
  }
}

// Global instance
export const autoComplianceSystem = new AutoComplianceSystem();

// Auto-start the system
if (typeof window !== 'undefined') {
  // Enable auto-compliance by default in development
  if (import.meta.env.DEV) {
    autoComplianceSystem.enableAutoCompliance().catch(console.error);
  }
}
