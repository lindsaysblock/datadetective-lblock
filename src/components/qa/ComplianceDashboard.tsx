/**
 * Compliance Dashboard Component
 * Real-time code standards monitoring and auto-compliance system
 * Refactored for consistency and maintainability
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, Settings, Zap } from 'lucide-react';
import { autoComplianceSystem } from '@/utils/qa/standards/autoComplianceSystem';
import { ComplianceReport } from '@/utils/qa/standards/types';
import { SPACING, ICON_SIZES } from '@/constants/ui';

const ComplianceDashboard: React.FC = () => {
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    const status = autoComplianceSystem.getComplianceStatus();
    setIsEnabled(status.enabled);
    setLastCheck(status.lastCheck);

    const handleComplianceUpdate = (event: CustomEvent) => {
      const { reports: newReports } = event.detail;
      setReports(newReports);
      setLastCheck(new Date());
    };

    window.addEventListener('qa-compliance-update', handleComplianceUpdate as EventListener);
    
    return () => {
      window.removeEventListener('qa-compliance-update', handleComplianceUpdate as EventListener);
    };
  }, []);

  const handleToggleCompliance = async () => {
    if (isEnabled) {
      autoComplianceSystem.disableAutoCompliance();
      setIsEnabled(false);
    } else {
      await autoComplianceSystem.enableAutoCompliance();
      setIsEnabled(true);
    }
  };

  const handleRunCheck = async () => {
    setIsRunning(true);
    try {
      const newReports = await autoComplianceSystem.runComplianceCheck();
      setReports(newReports);
      setLastCheck(new Date());
    } finally {
      setIsRunning(false);
    }
  };

  const avgComplianceScore = reports.length > 0 
    ? reports.reduce((sum, r) => sum + r.complianceScore, 0) / reports.length 
    : 100;

  const totalViolations = reports.reduce((sum, r) => sum + r.violations.length, 0);
  const totalAutoFixes = reports.reduce((sum, r) => sum + r.autoFixesApplied, 0);

  /**
   * Determines the semantic color class for compliance score
   */
  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  /**
   * Determines the badge variant for compliance score
   */
  const getScoreBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  return (
    <div className={`space-y-${SPACING.LG}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Code Compliance Dashboard</h2>
          <p className="text-muted-foreground">
            Automated code standards enforcement and optimization
          </p>
        </div>
        <div className={`flex items-center gap-${SPACING.MD}`}>
          <div className={`flex items-center gap-${SPACING.SM}`}>
            <Settings className={`h-${ICON_SIZES.SM} w-${ICON_SIZES.SM}`} />
            <span className="text-sm">Auto-Compliance</span>
            <Switch 
              checked={isEnabled} 
              onCheckedChange={handleToggleCompliance}
            />
          </div>
          <Button 
            onClick={handleRunCheck} 
            disabled={isRunning}
            className={`gap-${SPACING.SM}`}
          >
            <Zap className={`h-${ICON_SIZES.SM} w-${ICON_SIZES.SM}`} />
            {isRunning ? 'Checking...' : 'Run Check'}
          </Button>
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-4 gap-${SPACING.MD}`}>
        <Card>
          <CardHeader className={`pb-${SPACING.SM}`}>
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`flex items-center gap-${SPACING.SM}`}>
              <span className={`text-2xl font-bold ${getScoreColor(avgComplianceScore)}`}>
                {avgComplianceScore.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
            <Progress value={avgComplianceScore} className={`mt-${SPACING.SM}`} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={`pb-${SPACING.SM}`}>
            <CardTitle className="text-sm font-medium">Files Checked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">
              {lastCheck ? `Last: ${lastCheck.toLocaleTimeString()}` : 'Not checked yet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={`pb-${SPACING.SM}`}>
            <CardTitle className="text-sm font-medium">Violations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`flex items-center gap-${SPACING.SM}`}>
              <span className="text-2xl font-bold">{totalViolations}</span>
              {totalViolations > 0 ? (
                <AlertTriangle className={`h-${ICON_SIZES.SM} w-${ICON_SIZES.SM} text-warning`} />
              ) : (
                <CheckCircle className={`h-${ICON_SIZES.SM} w-${ICON_SIZES.SM} text-success`} />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={`pb-${SPACING.SM}`}>
            <CardTitle className="text-sm font-medium">Auto-Fixes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{totalAutoFixes}</div>
            <p className="text-xs text-muted-foreground">Issues resolved</p>
          </CardContent>
        </Card>
      </div>

      {reports.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>File Compliance Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`space-y-${SPACING.MD}`}>
              {reports.map((report, index) => (
                <div key={index} className={`flex items-center justify-between p-${SPACING.SM} border rounded-lg`}>
                  <div className="flex-1">
                    <div className="font-medium">{report.filePath.split('/').pop()}</div>
                    <div className="text-sm text-muted-foreground">{report.filePath}</div>
                    {report.violations.length > 0 && (
                      <div className={`mt-${SPACING.XS} text-xs`}>
                        {report.violations.slice(0, 2).map((violation, vIndex) => (
                          <div key={vIndex} className="text-warning">
                            Line {violation.line}: {violation.message}
                          </div>
                        ))}
                        {report.violations.length > 2 && (
                          <div className="text-muted-foreground">
                            +{report.violations.length - 2} more issues
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className={`flex items-center gap-${SPACING.SM}`}>
                    {report.autoFixesApplied > 0 && (
                      <Badge variant="outline" className="text-success">
                        {report.autoFixesApplied} auto-fixed
                      </Badge>
                    )}
                    <Badge variant={getScoreBadgeVariant(report.complianceScore)}>
                      {report.complianceScore}/100
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ComplianceDashboard;
