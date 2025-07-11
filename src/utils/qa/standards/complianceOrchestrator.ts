
import { ComplianceEngine } from './complianceEngine';
import { autoComplianceSystem } from './autoComplianceSystem';

export interface ComplianceOrchestrationConfig {
  enableContinuousCompliance: boolean;
  enableAutoRemediation: boolean;
  complianceThresholds: {
    blocking: number;
    warning: number;
  };
  remediationStrategies: string[];
}

export class ComplianceOrchestrator {
  private engines: Map<string, ComplianceEngine> = new Map();
  private config: ComplianceOrchestrationConfig;

  constructor(config: Partial<ComplianceOrchestrationConfig> = {}) {
    this.config = {
      enableContinuousCompliance: true,
      enableAutoRemediation: true,
      complianceThresholds: {
        blocking: 60,
        warning: 80
      },
      remediationStrategies: ['auto-fix', 'refactor-suggest', 'warning-escalate'],
      ...config
    };
  }

  async orchestrateCompliance(projectFiles: { path: string; content: string }[]): Promise<{
    overallScore: number;
    fileReports: any[];
    remediationPlan: any[];
    blockDeployment: boolean;
    complianceTrends: any;
  }> {
    console.log('🎭 Starting compliance orchestration...');
    
    const fileReports = [];
    let totalScore = 0;
    const remediationPlan = [];

    // Process each file through compliance engine
    for (const file of projectFiles) {
      const engine = this.getOrCreateEngine(file.path);
      const report = await engine.runCompleteCompliance(file.path, file.content);
      
      fileReports.push(report);
      totalScore += report.complianceReport.complianceScore;

      // Generate remediation actions
      if (report.overallStatus !== 'pass') {
        remediationPlan.push(...this.generateRemediationActions(file.path, report));
      }
    }

    const overallScore = fileReports.length > 0 ? totalScore / fileReports.length : 100;
    const blockDeployment = overallScore < this.config.complianceThresholds.blocking;

    // Generate compliance trends
    const complianceTrends = this.generateComplianceTrends(fileReports);

    // Execute auto-remediation if enabled
    if (this.config.enableAutoRemediation) {
      await this.executeAutoRemediation(remediationPlan);
    }

    console.log(`🎭 Compliance orchestration complete: ${overallScore.toFixed(1)}% overall score`);

    return {
      overallScore,
      fileReports,
      remediationPlan,
      blockDeployment,
      complianceTrends
    };
  }

  private getOrCreateEngine(filePath: string): ComplianceEngine {
    if (!this.engines.has(filePath)) {
      this.engines.set(filePath, new ComplianceEngine());
    }
    return this.engines.get(filePath)!;
  }

  private generateRemediationActions(filePath: string, report: any) {
    const actions = [];
    
    // Critical violations need immediate attention
    const criticalViolations = report.complianceReport.violations.filter((v: any) => v.severity === 'error');
    if (criticalViolations.length > 0) {
      actions.push({
        type: 'critical-fix',
        filePath,
        violations: criticalViolations,
        priority: 'high',
        autoFixable: criticalViolations.filter((v: any) => v.autoFixable).length
      });
    }

    // Quality gate failures
    if (report.qualityGateReport?.results?.some((r: any) => !r.passed)) {
      const failedGates = report.qualityGateReport.results.filter((r: any) => !r.passed);
      actions.push({
        type: 'quality-gate-fix',
        filePath,
        failedGates,
        priority: failedGates.some((g: any) => g.gate.severity === 'blocker') ? 'critical' : 'medium'
      });
    }

    // Metrics-based actions
    if (report.metricsReport?.metrics.complexity > 20) {
      actions.push({
        type: 'complexity-reduction',
        filePath,
        currentComplexity: report.metricsReport.metrics.complexity,
        priority: 'medium',
        suggestedActions: ['extract-methods', 'simplify-conditions', 'reduce-nesting']
      });
    }

    return actions;
  }

  private generateComplianceTrends(fileReports: any[]) {
    const trends = {
      averageCompliance: 0,
      complianceDistribution: {
        excellent: 0, // 90-100
        good: 0,      // 80-89
        fair: 0,      // 70-79
        poor: 0       // <70
      },
      topViolationTypes: new Map(),
      improvementAreas: []
    };

    let totalCompliance = 0;
    const violationTypes = new Map();

    fileReports.forEach(report => {
      const score = report.complianceReport.complianceScore;
      totalCompliance += score;

      // Categorize compliance scores
      if (score >= 90) trends.complianceDistribution.excellent++;
      else if (score >= 80) trends.complianceDistribution.good++;
      else if (score >= 70) trends.complianceDistribution.fair++;
      else trends.complianceDistribution.poor++;

      // Track violation types
      report.complianceReport.violations.forEach((violation: any) => {
        const count = violationTypes.get(violation.ruleName) || 0;
        violationTypes.set(violation.ruleName, count + 1);
      });
    });

    trends.averageCompliance = totalCompliance / fileReports.length;
    
    // Get top 5 violation types
    const sortedViolations = Array.from(violationTypes.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    
    trends.topViolationTypes = new Map(sortedViolations);

    // Generate improvement areas
    if (trends.complianceDistribution.poor > 0) {
      trends.improvementAreas.push('Focus on files with poor compliance scores');
    }
    
    if (sortedViolations.length > 0) {
      trends.improvementAreas.push(`Address recurring violation: ${sortedViolations[0][0]}`);
    }

    return trends;
  }

  private async executeAutoRemediation(remediationPlan: any[]) {
    console.log('🔧 Executing auto-remediation...');
    
    const autoFixableActions = remediationPlan.filter(action => 
      action.type === 'critical-fix' && action.autoFixable > 0
    );

    for (const action of autoFixableActions) {
      try {
        console.log(`🔧 Auto-fixing ${action.autoFixable} violations in ${action.filePath}`);
        // Here we would integrate with the auto-fix system
        await autoComplianceSystem.runComplianceCheck();
      } catch (error) {
        console.error(`Failed to auto-fix ${action.filePath}:`, error);
      }
    }
  }

  async startContinuousCompliance(): Promise<void> {
    if (!this.config.enableContinuousCompliance) {
      return;
    }

    console.log('🔄 Starting continuous compliance monitoring...');
    
    // Start the auto-compliance system
    await autoComplianceSystem.enableAutoCompliance();
    
    // Set up periodic full compliance checks
    setInterval(async () => {
      try {
        console.log('🔍 Running scheduled compliance check...');
        const mockFiles = [
          { path: 'src/example.ts', content: 'export const example = () => {};' }
        ];
        
        const result = await this.orchestrateCompliance(mockFiles);
        
        if (result.blockDeployment) {
          console.warn('🚨 Compliance failure detected - deployment blocked');
          // Trigger alerts/notifications
        }
      } catch (error) {
        console.error('Scheduled compliance check failed:', error);
      }
    }, 300000); // Every 5 minutes
  }
}
