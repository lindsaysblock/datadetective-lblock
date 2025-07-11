import { ComplianceChecker } from './complianceChecker';
import { ComplianceReport } from './codingStandards';

export class AutoComplianceSystem {
  private checker = new ComplianceChecker();
  private isEnabled = true;
  private lastCheck: Date | null = null;
  private checkInterval = 5 * 60 * 1000; // 5 minutes
  private autoRefactorEnabled = true;

  async enableAutoCompliance(): Promise<void> {
    this.isEnabled = true;
    this.autoRefactorEnabled = true;
    this.checker.setAutoFixEnabled(true);
    console.log('🤖 Auto-compliance system enabled with auto-refactoring');
    
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

    console.log('🔍 Running compliance check with auto-refactoring...');
    
    try {
      const reports = await this.checker.checkProject();
      const complianceReport = this.checker.generateComplianceReport(reports);
      
      console.log(complianceReport);
      
      // Trigger auto-fixes for critical violations
      await this.handleCriticalViolations(reports);
      
      // Auto-refactor if enabled
      if (this.autoRefactorEnabled) {
        await this.performAutoRefactoring(reports);
      }
      
      this.lastCheck = new Date();
      return reports;
      
    } catch (error) {
      console.error('❌ Compliance check failed:', error);
      return [];
    }
  }

  private async performAutoRefactoring(reports: ComplianceReport[]): Promise<void> {
    const { EnhancedAutoRefactor } = await import('../analysis/enhancedAutoRefactor');
    const autoRefactor = new EnhancedAutoRefactor();
    
    try {
      const decision = await autoRefactor.analyzeAndDecide();
      
      if (decision.shouldExecute && decision.confidence > 75) {
        console.log(`🔧 Auto-executing refactoring with ${decision.confidence}% confidence`);
        
        // Generate refactoring messages for high-confidence suggestions
        const messages = decision.suggestions
          .filter(s => s.autoRefactor && s.urgencyScore > 70)
          .slice(0, 2) // Limit to 2 files at a time
          .map(suggestion => this.generateRefactoringMessage(suggestion));
        
        // Dispatch refactoring events
        messages.forEach((message, index) => {
          setTimeout(() => {
            const event = new CustomEvent('qa-auto-refactor-execute', {
              detail: { message, autoExecute: true }
            });
            window.dispatchEvent(event);
          }, index * 2000); // Stagger executions
        });
        
        console.log(`✅ Auto-refactoring initiated for ${messages.length} files`);
      }
    } catch (error) {
      console.warn('⚠️ Auto-refactoring failed:', error);
    }
  }

  private generateRefactoringMessage(suggestion: any): string {
    const urgencyPrefix = suggestion.priority === 'critical' ? 'URGENT: ' : 
                         suggestion.priority === 'high' ? 'HIGH PRIORITY: ' : '';
    
    return `${urgencyPrefix}Auto-refactor ${suggestion.file} (${suggestion.currentLines} lines, complexity: ${suggestion.complexity}). Break into smaller, focused components. Maintain exact functionality. Priority actions: ${suggestion.suggestedActions.slice(0, 2).join(', ')}.`;
  }

  enableAutoRefactoring(): void {
    this.autoRefactorEnabled = true;
    console.log('🔧 Auto-refactoring enabled');
  }

  disableAutoRefactoring(): void {
    this.autoRefactorEnabled = false;
    console.log('🔧 Auto-refactoring disabled');
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
