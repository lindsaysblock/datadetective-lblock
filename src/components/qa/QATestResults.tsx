
/**
 * QA Test Results Component
 * Displays test execution results with detailed status information
 * Refactored for consistency and maintainability
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { QATestResult } from '../../utils/qa/types';
import { SPACING, ICON_SIZES } from '@/constants/ui';

interface QATestResultsProps {
  results: QATestResult[];
}

const QATestResults: React.FC<QATestResultsProps> = ({ results }) => {
  /**
   * Returns appropriate status icon for test result
   */
  const getStatusIcon = (status: QATestResult['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className={`w-${ICON_SIZES.SM} h-${ICON_SIZES.SM} text-success`} />;
      case 'fail': return <XCircle className={`w-${ICON_SIZES.SM} h-${ICON_SIZES.SM} text-destructive`} />;
      case 'warning': return <AlertTriangle className={`w-${ICON_SIZES.SM} h-${ICON_SIZES.SM} text-warning`} />;
    }
  };

  /**
   * Returns semantic color class for test status
   */
  const getStatusColor = (status: QATestResult['status']): string => {
    switch (status) {
      case 'pass': return 'bg-success/10 text-success';
      case 'fail': return 'bg-destructive/10 text-destructive';
      case 'warning': return 'bg-warning/10 text-warning';
    }
  };

  return (
    <div className={`grid gap-${SPACING.SM}`}>
      {results.map((result, index) => (
        <Card key={index} className={`p-${SPACING.MD}`}>
          <div className="flex items-start justify-between">
            <div className={`flex items-start gap-${SPACING.SM} flex-1`}>
              {getStatusIcon(result.status)}
              <div className="flex-1">
                <div className={`flex items-center gap-${SPACING.SM} mb-${SPACING.XS}`}>
                  <h4 className="font-semibold">{result.testName}</h4>
                  <Badge className={`text-xs ${getStatusColor(result.status)}`}>
                    {result.status}
                  </Badge>
                </div>
                <p className={`text-sm text-muted-foreground mb-${SPACING.SM}`}>{result.message}</p>
                {result.performance && (
                  <p className="text-xs text-primary">
                    Performance: {result.performance.toFixed(2)}ms
                  </p>
                )}
                {result.suggestions && (
                  <div className={`mt-${SPACING.SM}`}>
                    <p className={`text-xs font-medium text-foreground mb-${SPACING.XS}`}>Suggestions:</p>
                    <ul className="text-xs text-muted-foreground list-disc list-inside">
                      {result.suggestions.map((suggestion, i) => (
                        <li key={i}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default QATestResults;
