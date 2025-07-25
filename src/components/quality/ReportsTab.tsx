/**
 * Reports Tab Component
 * Quality report generation and summary
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ReportsTabProps {
  generateReport: () => any;
  overallHealthScore: number;
  successRate: number;
  lastRunTimestamp: Date | null;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  generateReport,
  overallHealthScore,
  successRate,
  lastRunTimestamp
}) => {
  const getHealthBadge = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comprehensive Quality Report</CardTitle>
        <CardDescription>
          Generate detailed reports for the current quality status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={() => {
              const report = generateReport();
              console.log('Generated report:', report);
            }}
            className="w-full"
          >
            Generate Full Quality Report
          </Button>
          
          <div className="p-4 border rounded-lg">
            <div className="font-medium mb-2">Latest Report Summary</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>• System Health: {getHealthBadge(overallHealthScore)}</div>
              <div>• Test Success Rate: {successRate.toFixed(1)}%</div>
              <div>• Auto-Fix Available: Yes</div>
              <div>• Last Updated: {lastRunTimestamp?.toLocaleString() || 'Never'}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};