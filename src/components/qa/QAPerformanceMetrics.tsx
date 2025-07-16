
/**
 * QA Performance Metrics Component
 * Displays detailed performance metrics for quality assurance
 * Refactored for consistency and maintainability
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { PerformanceMetrics } from '../../utils/qa/types';
import { SPACING, ICON_SIZES } from '@/constants/ui';

interface QAPerformanceMetricsProps {
  metrics: PerformanceMetrics;
}

const QAPerformanceMetrics: React.FC<QAPerformanceMetricsProps> = ({ metrics }) => {
  return (
    <div className={`space-y-${SPACING.MD}`}>
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-${SPACING.MD}`}>
        <Card className={`p-${SPACING.MD} text-center`}>
          <h4 className="font-semibold text-muted-foreground">Render Time</h4>
          <p className="text-2xl font-bold text-primary">
            {metrics.renderTime.toFixed(0)}ms
          </p>
        </Card>
        
        <Card className={`p-${SPACING.MD} text-center`}>
          <h4 className="font-semibold text-muted-foreground">Memory Usage</h4>
          <p className="text-2xl font-bold text-success">
            {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB
          </p>
        </Card>
        
        <Card className={`p-${SPACING.MD} text-center`}>
          <h4 className="font-semibold text-muted-foreground">Bundle Size</h4>
          <p className="text-2xl font-bold text-warning">
            {metrics.bundleSize}KB
          </p>
        </Card>
        
        <Card className={`p-${SPACING.MD} text-center`}>
          <h4 className="font-semibold text-muted-foreground">Components</h4>
          <p className="text-2xl font-bold text-accent">
            {metrics.componentCount}
          </p>
        </Card>
      </div>

      <Card className={`p-${SPACING.MD}`}>
        <h4 className={`font-semibold mb-${SPACING.SM}`}>Large Files</h4>
        <div className={`space-y-${SPACING.SM}`}>
          {metrics.largeFiles.map((file, index) => (
            <div key={index} className={`flex items-center gap-${SPACING.SM} p-${SPACING.SM} bg-warning/10 rounded`}>
              <AlertTriangle className={`w-${ICON_SIZES.SM} h-${ICON_SIZES.SM} text-warning`} />
              <span className="text-sm">{file}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default QAPerformanceMetrics;
