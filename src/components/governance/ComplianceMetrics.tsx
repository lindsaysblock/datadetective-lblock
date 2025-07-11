
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface ComplianceMetric {
  id: string;
  name: string;
  score: number;
  status: 'compliant' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
}

interface ComplianceMetricsProps {
  metrics: ComplianceMetric[];
  overallScore: number;
}

export const ComplianceMetrics: React.FC<ComplianceMetricsProps> = ({
  metrics,
  overallScore
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'critical': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Compliance Metrics</span>
          <Badge variant={overallScore >= 80 ? 'default' : 'destructive'}>
            {overallScore}% Overall
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Compliance</span>
              <span className="text-sm text-muted-foreground">{overallScore}%</span>
            </div>
            <Progress value={overallScore} className="h-2" />
          </div>

          <div className="space-y-3">
            {metrics.map((metric) => (
              <div key={metric.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(metric.status)}
                  <span className="text-sm font-medium">{metric.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.score}%
                  </Badge>
                  <TrendingUp className={`w-4 h-4 ${
                    metric.trend === 'up' ? 'text-green-600' : 
                    metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
