/**
 * QA Overview Statistics Component
 * Displays high-level test statistics and progress
 */

import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface QAOverviewStatsProps {
  overallStats: {
    total: number;
    passed: number;
    failed: number;
    warning: number;
    pending: number;
  };
  overallCoverage: number;
}

export const QAOverviewStats: React.FC<QAOverviewStatsProps> = ({
  overallStats,
  overallCoverage
}) => {
  const successRate = overallStats.total > 0 
    ? (overallStats.passed / overallStats.total) * 100 
    : 0;

  return (
    <CardContent>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{overallStats.total}</div>
          <div className="text-sm text-muted-foreground">Total Tests</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{overallStats.passed}</div>
          <div className="text-sm text-muted-foreground">Passed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{overallStats.failed}</div>
          <div className="text-sm text-muted-foreground">Failed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{overallStats.warning}</div>
          <div className="text-sm text-muted-foreground">Warnings</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">{overallStats.pending}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Test Coverage</span>
          <span>{overallCoverage.toFixed(1)}%</span>
        </div>
        <Progress value={overallCoverage} className="h-2" />
      </div>

      <div className="space-y-2 mt-4">
        <div className="flex justify-between text-sm">
          <span>Success Rate</span>
          <span>{successRate.toFixed(1)}%</span>
        </div>
        <Progress value={successRate} className="h-2" />
      </div>
    </CardContent>
  );
};