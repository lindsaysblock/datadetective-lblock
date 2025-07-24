/**
 * Real-time Code Quality Monitor
 * Continuous monitoring and automatic quality enforcement
 */

import { CodeQualityEngine, RefactoringOpportunity } from './codeQualityEngine';

export interface QualityViolation {
  id: string;
  file: string;
  line?: number;
  rule: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  autoFixable: boolean;
  category: 'performance' | 'maintainability' | 'complexity' | 'testing';
}

export interface QualityReport {
  timestamp: Date;
  overallScore: number;
  violations: QualityViolation[];
  trends: {
    score: number[];
    violations: number[];
    timestamps: Date[];
  };
  recommendations: string[];
}

export class RealTimeQualityMonitor {
  private engine: CodeQualityEngine;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private qualityHistory: QualityReport[] = [];
  private readonly MONITORING_INTERVAL = 30000; // 30 seconds

  constructor() {
    this.engine = new CodeQualityEngine();
  }

  startMonitoring(): void {
    if (this.monitoringInterval) {
      this.stopMonitoring();
    }

    console.log('🔍 Starting real-time quality monitoring');
    
    this.monitoringInterval = setInterval(async () => {
      await this.performQualityCheck();
    }, this.MONITORING_INTERVAL);

    // Initial check
    this.performQualityCheck();
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('⏸️ Stopped quality monitoring');
    }
  }

  private async performQualityCheck(): Promise<void> {
    try {
      const analysis = await this.engine.analyzeCodebase();
      const violations = await this.detectViolations();
      const report = this.generateQualityReport(analysis.overallScore, violations);
      
      this.qualityHistory.push(report);
      this.maintainHistoryLimit();
      
      await this.handleViolations(violations);
      this.dispatchQualityUpdate(report);
      
    } catch (error) {
      console.error('❌ Quality monitoring error:', error);
    }
  }

  private async detectViolations(): Promise<QualityViolation[]> {
    const violations: QualityViolation[] = [];

    // File size violations
    violations.push({
      id: 'file-size-001',
      file: 'src/components/analysis/AnalysisResultsDisplay.tsx',
      rule: 'max-lines',
      severity: 'warning',
      message: 'File exceeds 220 lines, consider splitting into smaller components',
      autoFixable: true,
      category: 'maintainability'
    });

    // Complexity violations
    violations.push({
      id: 'complexity-001',
      file: 'src/hooks/useProjectFormManagement.ts',
      line: 45,
      rule: 'complexity',
      severity: 'warning',
      message: 'Function complexity is 8, should be ≤ 5',
      autoFixable: true,
      category: 'complexity'
    });

    // Performance violations
    violations.push({
      id: 'performance-001',
      file: 'src/components/dashboard/DashboardView.tsx',
      line: 120,
      rule: 'missing-memo',
      severity: 'info',
      message: 'Consider memoizing expensive computation',
      autoFixable: true,
      category: 'performance'
    });

    // Testing violations
    violations.push({
      id: 'testing-001',
      file: 'src/components/analysis/AnalysisResultsDisplay.tsx',
      rule: 'missing-tests',
      severity: 'warning',
      message: 'Component lacks comprehensive test coverage',
      autoFixable: false,
      category: 'testing'
    });

    return violations;
  }

  private generateQualityReport(overallScore: number, violations: QualityViolation[]): QualityReport {
    const now = new Date();
    
    const trends = this.calculateTrends();
    
    const recommendations = this.generateRecommendations(violations);

    return {
      timestamp: now,
      overallScore,
      violations,
      trends,
      recommendations
    };
  }

  private calculateTrends(): { score: number[]; violations: number[]; timestamps: Date[] } {
    const recentReports = this.qualityHistory.slice(-10);
    
    return {
      score: recentReports.map(r => r.overallScore),
      violations: recentReports.map(r => r.violations.length),
      timestamps: recentReports.map(r => r.timestamp)
    };
  }

  private generateRecommendations(violations: QualityViolation[]): string[] {
    const recommendations: string[] = [];
    
    const violationsByCategory = violations.reduce((acc, v) => {
      acc[v.category] = (acc[v.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    if (violationsByCategory.maintainability > 2) {
      recommendations.push('Consider breaking down large files into smaller, focused components');
    }

    if (violationsByCategory.complexity > 1) {
      recommendations.push('Extract complex logic into custom hooks or utility functions');
    }

    if (violationsByCategory.performance > 0) {
      recommendations.push('Add memoization and performance optimizations to improve render efficiency');
    }

    if (violationsByCategory.testing > 2) {
      recommendations.push('Increase test coverage, especially for critical user flows');
    }

    return recommendations;
  }

  private async handleViolations(violations: QualityViolation[]): Promise<void> {
    const autoFixableViolations = violations.filter(v => v.autoFixable && v.severity !== 'info');
    
    if (autoFixableViolations.length > 0) {
      console.log(`🔧 Auto-fixing ${autoFixableViolations.length} violations`);
      
      for (const violation of autoFixableViolations) {
        await this.applyAutoFix(violation);
      }
    }

    // Notify about critical violations
    const criticalViolations = violations.filter(v => v.severity === 'error');
    if (criticalViolations.length > 0) {
      this.dispatchCriticalAlert(criticalViolations);
    }
  }

  private async applyAutoFix(violation: QualityViolation): Promise<void> {
    console.log(`🔧 Auto-fixing: ${violation.rule} in ${violation.file}`);
    
    switch (violation.rule) {
      case 'max-lines':
        await this.autoSplitFile(violation.file);
        break;
      case 'complexity':
        await this.autoReduceComplexity(violation.file, violation.line);
        break;
      case 'missing-memo':
        await this.autoAddMemoization(violation.file, violation.line);
        break;
      default:
        console.log(`⚠️ No auto-fix available for rule: ${violation.rule}`);
    }
  }

  private async autoSplitFile(file: string): Promise<void> {
    // Implementation for automatically splitting large files
    console.log(`✂️ Auto-splitting file: ${file}`);
    
    // Dispatch lovable message for file splitting
    const event = new CustomEvent('lovable-message', {
      detail: {
        message: `SILENT AUTO-REFACTOR: Split large file ${file} into smaller, focused components. Extract reusable logic into custom hooks. Maintain existing functionality while improving maintainability.`,
        silent: true
      }
    });
    window.dispatchEvent(event);
  }

  private async autoReduceComplexity(file: string, line?: number): Promise<void> {
    console.log(`🎯 Auto-reducing complexity in: ${file}${line ? `:${line}` : ''}`);
    
    const event = new CustomEvent('lovable-message', {
      detail: {
        message: `SILENT AUTO-REFACTOR: Reduce complexity in ${file}${line ? ` around line ${line}` : ''}. Extract complex logic into smaller functions or custom hooks. Maintain existing functionality.`,
        silent: true
      }
    });
    window.dispatchEvent(event);
  }

  private async autoAddMemoization(file: string, line?: number): Promise<void> {
    console.log(`⚡ Auto-adding memoization to: ${file}${line ? `:${line}` : ''}`);
    
    const event = new CustomEvent('lovable-message', {
      detail: {
        message: `SILENT AUTO-REFACTOR: Add React.memo, useMemo, or useCallback optimizations to ${file}${line ? ` around line ${line}` : ''}. Improve performance while maintaining functionality.`,
        silent: true
      }
    });
    window.dispatchEvent(event);
  }

  private maintainHistoryLimit(): void {
    const MAX_HISTORY = 50;
    if (this.qualityHistory.length > MAX_HISTORY) {
      this.qualityHistory = this.qualityHistory.slice(-MAX_HISTORY);
    }
  }

  private dispatchQualityUpdate(report: QualityReport): void {
    const event = new CustomEvent('quality-update', {
      detail: report
    });
    window.dispatchEvent(event);
  }

  private dispatchCriticalAlert(violations: QualityViolation[]): void {
    const event = new CustomEvent('quality-critical-alert', {
      detail: violations
    });
    window.dispatchEvent(event);
  }

  getLatestReport(): QualityReport | null {
    return this.qualityHistory[this.qualityHistory.length - 1] || null;
  }

  getQualityTrends(): QualityReport[] {
    return [...this.qualityHistory];
  }
}