
import { CodingStandards } from './codingStandards';
import { CodeMetricsAnalyzer } from './codeMetrics';
import { QualityGateEngine } from './qualityGates';
import type { ComplianceReport } from './types';

export interface ComplianceEngineConfig {
  enableQualityGates: boolean;
  enableMetrics: boolean;
  enableAutoFix: boolean;
  customRules?: any[];
  customGates?: any[];
}

export class ComplianceEngine {
  private config: ComplianceEngineConfig;

  constructor(config: Partial<ComplianceEngineConfig> = {}) {
    this.config = {
      enableQualityGates: true,
      enableMetrics: true,
      enableAutoFix: true,
      ...config
    };
  }

  async runCompleteCompliance(filePath: string, code: string): Promise<{
    complianceReport: ComplianceReport;
    metricsReport?: any;
    qualityGateReport?: any;
    overallStatus: 'pass' | 'warning' | 'fail';
    recommendations: string[];
  }> {
    console.log(`🔍 Running complete compliance check for ${filePath}`);

    // 1. Basic compliance check
    const complianceReport = CodingStandards.checkCompliance(code, filePath);
    
    let metricsReport;
    let qualityGateReport;
    const recommendations: string[] = [];

    // 2. Code metrics analysis
    if (this.config.enableMetrics) {
      const metrics = CodeMetricsAnalyzer.analyzeCode(code);
      metricsReport = {
        metrics,
        analysis: this.generateMetricsAnalysis(metrics)
      };

      // 3. Quality gates evaluation
      if (this.config.enableQualityGates) {
        const gateResults = QualityGateEngine.evaluateGates(
          metrics, 
          complianceReport, 
          this.config.customGates
        );
        
        qualityGateReport = {
          results: gateResults,
          summary: QualityGateEngine.generateQualityReport(gateResults)
        };
      }
    }

    // 4. Generate recommendations
    recommendations.push(...this.generateRecommendations(complianceReport, metricsReport));

    // 5. Determine overall status
    const overallStatus = this.determineOverallStatus(complianceReport, qualityGateReport);

    console.log(`✅ Compliance check complete for ${filePath}: ${overallStatus}`);

    return {
      complianceReport,
      metricsReport,
      qualityGateReport,
      overallStatus,
      recommendations
    };
  }

  private generateMetricsAnalysis(metrics: any) {
    const analysis = [];
    
    if (metrics.complexity > 15) {
      analysis.push('High complexity detected - consider refactoring');
    }
    
    if (metrics.maintainabilityIndex < 70) {
      analysis.push('Low maintainability - code may be hard to maintain');
    }
    
    if (metrics.linesOfCode > 300) {
      analysis.push('Large file detected - consider breaking into smaller modules');
    }
    
    if (metrics.duplicatedCode > 10) {
      analysis.push('Code duplication detected - consider extracting common functionality');
    }

    return analysis;
  }

  private generateRecommendations(complianceReport: ComplianceReport, metricsReport?: any): string[] {
    const recommendations = [];
    
    // Compliance-based recommendations
    if (complianceReport.complianceScore < 80) {
      recommendations.push('Focus on fixing high-priority compliance violations');
    }
    
    const criticalViolations = complianceReport.violations.filter(v => v.severity === 'error');
    if (criticalViolations.length > 0) {
      recommendations.push(`Address ${criticalViolations.length} critical violations immediately`);
    }

    // Metrics-based recommendations
    if (metricsReport?.metrics.complexity > 20) {
      recommendations.push('Consider breaking down complex functions into smaller, focused functions');
    }
    
    if (metricsReport?.metrics.linesOfCode > 250) {
      recommendations.push('File is getting large - consider refactoring into multiple files');
    }

    return recommendations;
  }

  private determineOverallStatus(complianceReport: ComplianceReport, qualityGateReport?: any): 'pass' | 'warning' | 'fail' {
    // Check for blockers in quality gates
    if (qualityGateReport?.results?.some((r: any) => !r.passed && r.gate.severity === 'blocker')) {
      return 'fail';
    }
    
    // Check compliance score
    if (complianceReport.complianceScore < 60) {
      return 'fail';
    }
    
    if (complianceReport.complianceScore < 80) {
      return 'warning';
    }
    
    // Check for critical violations
    const criticalViolations = complianceReport.violations.filter(v => v.severity === 'error');
    if (criticalViolations.length > 5) {
      return 'fail';
    }
    
    if (criticalViolations.length > 0) {
      return 'warning';
    }
    
    return 'pass';
  }
}
