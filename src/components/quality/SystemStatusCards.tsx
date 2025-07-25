/**
 * System Status Cards Component
 * Displays key system health and performance metrics
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, TestTube, Brain, Zap } from 'lucide-react';

interface SystemStatusCardsProps {
  healthScore: number;
  testsPassed: number;
  totalTests: number;
  successRate: number;
  qualityScore: number;
  performanceGains: number;
}

export const SystemStatusCards: React.FC<SystemStatusCardsProps> = ({
  healthScore,
  testsPassed,
  totalTests,
  successRate,
  qualityScore,
  performanceGains
}) => {
  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBadge = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Health</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getHealthColor(healthScore)}`}>
            {healthScore.toFixed(0)}%
          </div>
          <p className="text-xs text-muted-foreground">
            <Badge variant="outline" className="mt-1">
              {getHealthBadge(healthScore)}
            </Badge>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">QA Test Results</CardTitle>
          <TestTube className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {testsPassed}/{totalTests}
          </div>
          <p className="text-xs text-muted-foreground">
            {successRate.toFixed(1)}% success rate
          </p>
          <Progress value={successRate} className="h-2 mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Code Quality</CardTitle>
          <Brain className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {qualityScore || 82}%
          </div>
          <p className="text-xs text-muted-foreground">
            Quality index improving
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Performance</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {performanceGains.toFixed(0)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Performance improvements
          </p>
        </CardContent>
      </Card>
    </div>
  );
};