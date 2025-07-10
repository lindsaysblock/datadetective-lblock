
import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import { PerformanceMetrics } from '../../utils/qa/types';

interface QAPerformanceMetricsProps {
  metrics: PerformanceMetrics;
}

const QAPerformanceMetrics: React.FC<QAPerformanceMetricsProps> = ({ metrics }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <h4 className="font-semibold text-gray-700">Render Time</h4>
          <p className="text-2xl font-bold text-blue-600">
            {metrics.renderTime.toFixed(0)}ms
          </p>
        </Card>
        
        <Card className="p-4 text-center">
          <h4 className="font-semibold text-gray-700">Memory Usage</h4>
          <p className="text-2xl font-bold text-green-600">
            {(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB
          </p>
        </Card>
        
        <Card className="p-4 text-center">
          <h4 className="font-semibold text-gray-700">Bundle Size</h4>
          <p className="text-2xl font-bold text-orange-600">
            {metrics.bundleSize}KB
          </p>
        </Card>
        
        <Card className="p-4 text-center">
          <h4 className="font-semibold text-gray-700">Components</h4>
          <p className="text-2xl font-bold text-purple-600">
            {metrics.componentCount}
          </p>
        </Card>
      </div>

      <Card className="p-4">
        <h4 className="font-semibold mb-3">Large Files</h4>
        <div className="space-y-2">
          {metrics.largeFiles.map((file, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm">{file}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default QAPerformanceMetrics;
