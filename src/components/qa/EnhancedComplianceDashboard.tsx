
/**
 * Enhanced Compliance Dashboard Component
 * Advanced compliance orchestration with comprehensive reporting
 * Refactored for consistency and maintainability
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, Settings, TrendingUp, FileText, Zap } from 'lucide-react';
import { ComplianceOrchestrator } from '@/utils/qa/standards/complianceOrchestrator';
import { ComplianceReportGenerator } from '@/utils/qa/standards/complianceReporting';
import { SPACING, ICON_SIZES } from '@/constants/ui';

const EnhancedComplianceDashboard: React.FC = () => {
  const [orchestrationResult, setOrchestrationResult] = useState<any>(null);
  const [reportSummary, setReportSummary] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [orchestrator] = useState(() => new ComplianceOrchestrator());

  useEffect(() => {
    // Initialize with sample data
    runComplianceOrchestration();
  }, []);

  const runComplianceOrchestration = async () => {
    setIsRunning(true);
    try {
      // Mock file data for demonstration
      const mockFiles = [
        { path: 'src/components/Example.tsx', content: 'export const Example = () => <div>Hello</div>;' },
        { path: 'src/utils/helper.ts', content: 'export const helper = (x: any) => { if (x) { if (x.length) { return x.map(i => i); } } };' }
      ];
      
      const result = await orchestrator.orchestrateCompliance(mockFiles);
      setOrchestrationResult(result);
      
      // Generate report summary
      const summary = ComplianceReportGenerator.generateExecutiveSummary(
        result.fileReports.map((r: any) => r.complianceReport)
      );
      setReportSummary(summary);
      
    } catch (error) {
      console.error('Compliance orchestration failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  /**
   * Determines semantic color class for compliance score
   */
  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-success';
    if (score >= 80) return 'text-primary';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  /**
   * Determines badge variant for compliance score
   */
  const getScoreBadgeVariant = (score: number): 'default' | 'secondary' | 'outline' | 'destructive' => {
    if (score >= 90) return 'default';
    if (score >= 80) return 'secondary';
    if (score >= 70) return 'outline';
    return 'destructive';
  };

  if (!orchestrationResult || !reportSummary) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Initializing Enhanced Compliance Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-${SPACING.LG}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Enhanced Compliance Dashboard</h2>
          <p className="text-muted-foreground">
            Advanced code quality orchestration and compliance monitoring
          </p>
        </div>
        <div className={`flex items-center gap-${SPACING.MD}`}>
          <Button 
            onClick={runComplianceOrchestration} 
            disabled={isRunning}
            className={`gap-${SPACING.SM}`}
          >
            <Zap className={`h-${ICON_SIZES.SM} w-${ICON_SIZES.SM}`} />
            {isRunning ? 'Running...' : 'Run Analysis'}
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      {orchestrationResult.blockDeployment && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className={`pt-${SPACING.LG}`}>
            <div className={`flex items-center gap-${SPACING.SM} text-destructive`}>
              <AlertTriangle className={`h-${ICON_SIZES.MD} w-${ICON_SIZES.MD}`} />
              <span className="font-semibold">Deployment Blocked</span>
            </div>
            <p className={`text-destructive mt-${SPACING.XS}`}>
              Compliance score is below blocking threshold. Address critical issues before deployment.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-${SPACING.MD}`}>
        <Card>
          <CardHeader className={`pb-${SPACING.SM}`}>
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`flex items-center gap-${SPACING.SM}`}>
              <span className={`text-2xl font-bold ${getScoreColor(orchestrationResult.overallScore)}`}>
                {orchestrationResult.overallScore.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
            <Progress value={orchestrationResult.overallScore} className={`mt-${SPACING.SM}`} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Files Analyzed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportSummary.totalFiles}</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">{reportSummary.complianceDistribution.excellent}</span> excellent,{' '}
              <span className="text-red-600">{reportSummary.complianceDistribution.poor}</span> poor
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Action Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportSummary.actionItems.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {reportSummary.actionItems.filter((item: any) => item.priority === 'critical').length} critical
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Est. Effort</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportSummary.actionItems.reduce((sum: number, item: any) => sum + item.estimatedEffort, 0).toFixed(1)}h
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              To address all issues
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="violations">Violations</TabsTrigger>
          <TabsTrigger value="remediation">Remediation</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Quality Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(reportSummary.complianceDistribution).map(([level, count]) => (
                    <div key={level} className="flex items-center justify-between">
                      <span className="capitalize">{level}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{count as number}</span>
                        <Progress 
                          value={(count as number / reportSummary.totalFiles) * 100} 
                          className="w-20 h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Top Violations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {reportSummary.topViolations.slice(0, 5).map((violation: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{violation.rule}</span>
                      <Badge variant={violation.severity === 'error' ? 'destructive' : 'outline'}>
                        {violation.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="violations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Violation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orchestrationResult.fileReports.map((report: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{report.complianceReport.filePath}</h4>
                      <Badge variant={getScoreBadgeVariant(report.complianceReport.complianceScore)}>
                        {report.complianceReport.complianceScore}/100
                      </Badge>
                    </div>
                    {report.complianceReport.violations.length > 0 ? (
                      <div className="space-y-1">
                        {report.complianceReport.violations.slice(0, 3).map((violation: any, vIndex: number) => (
                          <div key={vIndex} className="text-sm text-muted-foreground">
                            Line {violation.line}: {violation.message}
                          </div>
                        ))}
                        {report.complianceReport.violations.length > 3 && (
                          <div className="text-sm text-muted-foreground">
                            +{report.complianceReport.violations.length - 3} more violations
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">No violations found</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="remediation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Remediation Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportSummary.actionItems.map((item: any, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Badge 
                      variant={
                        item.priority === 'critical' ? 'destructive' :
                        item.priority === 'high' ? 'default' :
                        item.priority === 'medium' ? 'secondary' : 'outline'
                      }
                    >
                      {item.priority}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm">{item.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Estimated effort: {item.estimatedEffort}h
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Improvement Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {reportSummary.trends.improvementAreas.map((area: string, index: number) => (
                  <div key={index} className="p-2 bg-muted rounded">
                    <p className="text-sm">{area}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedComplianceDashboard;
