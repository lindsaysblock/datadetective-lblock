
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { QAReport } from '../../utils/qa/types';

interface QAOverviewProps {
  report: QAReport;
}

const QAOverview: React.FC<QAOverviewProps> = ({ report }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-700';
      case 'fail': return 'bg-red-100 text-red-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overall Status</p>
              <p className="text-2xl font-bold">
                <Badge className={getStatusColor(report.overall)}>
                  {report.overall.toUpperCase()}
                </Badge>
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tests Passed</p>
              <p className="text-2xl font-bold text-green-600">
                {report.passed}/{report.totalTests}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <Progress 
            value={(report.passed / report.totalTests) * 100} 
            className="mt-2"
          />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Render Time</p>
              <p className="text-2xl font-bold text-blue-600">
                {report.performanceMetrics.renderTime.toFixed(0)}ms
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">
          Last run: {report.timestamp.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default QAOverview;
