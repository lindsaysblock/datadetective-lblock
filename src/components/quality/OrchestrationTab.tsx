/**
 * Orchestration Tab Component
 * Quality orchestration control and metrics
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OrchestrationTabProps {
  isFullyInitialized: boolean;
  isSystemHealthy: boolean;
  globalMetrics: {
    totalLinesAnalyzed: number;
    optimizationsApplied: number;
    testsExecuted: number;
    qualityScore: number;
  };
}

export const OrchestrationTab: React.FC<OrchestrationTabProps> = ({
  isFullyInitialized,
  isSystemHealthy,
  globalMetrics
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Quality Orchestration Control</CardTitle>
          <CardDescription>
            Manage and monitor the unified quality orchestration system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">System Status</div>
                <div className="text-sm text-muted-foreground">
                  {isFullyInitialized ? 'Fully operational' : 'Initializing...'}
                </div>
              </div>
              <Badge variant={isSystemHealthy ? "default" : "destructive"}>
                {isSystemHealthy ? 'Healthy' : 'Issues Detected'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{globalMetrics.totalLinesAnalyzed}</div>
                <div className="text-sm text-muted-foreground">Lines Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{globalMetrics.optimizationsApplied}</div>
                <div className="text-sm text-muted-foreground">Optimizations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{globalMetrics.testsExecuted}</div>
                <div className="text-sm text-muted-foreground">Tests Run</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{globalMetrics.qualityScore.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Quality Score</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};