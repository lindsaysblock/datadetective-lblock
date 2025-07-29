/**
 * System Metrics Display Component
 * Displays real-time system optimization metrics
 */

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Database, HardDrive, Network } from 'lucide-react';

interface SystemMetricsProps {
  metrics: {
    systemEfficiency: number;
    memoryUsage: number;
    ioOptimizations: number;
    bandwidthSaved: number;
  };
}

const SystemMetricsDisplay: React.FC<SystemMetricsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {metrics.systemEfficiency.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">System Efficiency</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-green-600">
                {metrics.memoryUsage.toFixed(1)}MB
              </div>
              <div className="text-xs text-muted-foreground">Memory Usage</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-purple-500" />
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {metrics.ioOptimizations}
              </div>
              <div className="text-xs text-muted-foreground">I/O Optimizations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-orange-500" />
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {metrics.bandwidthSaved}KB
              </div>
              <div className="text-xs text-muted-foreground">Bandwidth Saved</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemMetricsDisplay;