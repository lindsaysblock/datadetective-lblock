/**
 * Overview Tab Component
 * System overview with integration status and recent activity
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Shield, TestTube, Zap, AlertTriangle } from 'lucide-react';

interface OverviewTabProps {
  systemIntegrity: Record<string, boolean>;
  hasFailures: boolean;
  totalTestsFailed: number;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  systemIntegrity,
  hasFailures,
  totalTestsFailed
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* System Integration Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Integration Status</CardTitle>
            <CardDescription>Current status of all quality systems</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(systemIntegrity).map(([system, status]) => (
                <div key={system} className="flex items-center justify-between">
                  <span className="capitalize">{system.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <Badge variant={status ? "default" : "destructive"}>
                    {status ? "Online" : "Offline"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest quality improvements and actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm">Auto-refactoring applied to 15 files</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-sm">Security scan completed - 2 issues found</span>
              </div>
              <div className="flex items-center space-x-2">
                <TestTube className="w-4 h-4 text-purple-500" />
                <span className="text-sm">Auto-fix process running on failed tests</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">Performance optimizations applied</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Issues */}
      {hasFailures && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <span>Critical Issues Requiring Attention</span>
            </CardTitle>
            <CardDescription>
              {totalTestsFailed} test failures detected - Auto-fix process available
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-3 border border-red-200 rounded-lg bg-red-50">
                <div className="font-medium text-red-800">Integration Test Failures</div>
                <div className="text-sm text-red-600">Multiple integration tests failing</div>
              </div>
              <div className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                <div className="font-medium text-yellow-800">Performance Issues</div>
                <div className="text-sm text-yellow-600">Load testing shows response time issues</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};