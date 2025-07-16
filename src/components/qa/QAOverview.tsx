
/**
 * QA Overview Component
 * Displays comprehensive quality assurance metrics and status
 * Refactored for consistency and maintainability
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { QAReport } from '../../utils/qa/types';
import { SPACING, ICON_SIZES } from '@/constants/ui';

interface QAOverviewProps {
  report: QAReport;
}

const QAOverview: React.FC<QAOverviewProps> = ({ report }) => {
  /**
   * Determines semantic color class for QA status
   */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pass': return 'bg-success/10 text-success';
      case 'fail': return 'bg-destructive/10 text-destructive';
      case 'warning': return 'bg-warning/10 text-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className={`space-y-${SPACING.MD}`}>
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-${SPACING.MD} mb-${SPACING.LG}`}>
        <Card className={`p-${SPACING.MD}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Overall Status</p>
              <p className="text-2xl font-bold">
                <Badge className={getStatusColor(report.overall)}>
                  {report.overall.toUpperCase()}
                </Badge>
              </p>
            </div>
          </div>
        </Card>

        <Card className={`p-${SPACING.MD}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tests Passed</p>
              <p className="text-2xl font-bold text-success">
                {report.passed}/{report.totalTests}
              </p>
            </div>
            <CheckCircle className={`w-${ICON_SIZES.LG} h-${ICON_SIZES.LG} text-success`} />
          </div>
          <Progress 
            value={(report.passed / report.totalTests) * 100} 
            className={`mt-${SPACING.SM}`}
          />
        </Card>

        <Card className={`p-${SPACING.MD}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Render Time</p>
              <p className="text-2xl font-bold text-primary">
                {report.performanceMetrics.renderTime.toFixed(0)}ms
              </p>
            </div>
            <TrendingUp className={`w-${ICON_SIZES.LG} h-${ICON_SIZES.LG} text-primary`} />
          </div>
        </Card>
      </div>

      <div className={`flex items-center gap-${SPACING.SM}`}>
        <Clock className={`w-${ICON_SIZES.SM} h-${ICON_SIZES.SM} text-muted-foreground`} />
        <span className="text-sm text-muted-foreground">
          Last run: {report.timestamp.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default QAOverview;
