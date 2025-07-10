
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { analyzeDataQuality, type DataQualityMetrics, type QualityIssue } from '../utils/dataQualityAnalyzer';
import { type ParsedData } from '../utils/dataParser';

interface DataQualityDashboardProps {
  data: ParsedData;
}

const DataQualityDashboard: React.FC<DataQualityDashboardProps> = ({ data }) => {
  const qualityMetrics = analyzeDataQuality(data.rows);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-50 border-green-200';
    if (score >= 80) return 'bg-yellow-50 border-yellow-200';
    if (score >= 70) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  const getSeverityIcon = (severity: QualityIssue['severity']) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      case 'medium':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'low':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: QualityIssue['severity']) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overall Quality Score */}
      <Card className={`p-6 ${getScoreBgColor(qualityMetrics.overall)}`}>
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            {qualityMetrics.overall >= 80 ? (
              <CheckCircle className="w-12 h-12 text-green-500" />
            ) : (
              <AlertTriangle className="w-12 h-12 text-orange-500" />
            )}
          </div>
          <h2 className="text-3xl font-bold mb-2">
            <span className={getScoreColor(qualityMetrics.overall)}>
              {qualityMetrics.overall}%
            </span>
          </h2>
          <p className="text-lg text-gray-600 mb-4">Overall Data Quality Score</p>
          <div className="max-w-md mx-auto">
            <Progress 
              value={qualityMetrics.overall} 
              className="h-3"
            />
          </div>
        </div>
      </Card>

      {/* Quality Metrics Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className={`text-2xl font-bold mb-1 ${getScoreColor(qualityMetrics.completeness)}`}>
              {qualityMetrics.completeness}%
            </div>
            <div className="text-sm text-gray-600 mb-2">Completeness</div>
            <Progress value={qualityMetrics.completeness} className="h-2" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <div className={`text-2xl font-bold mb-1 ${getScoreColor(qualityMetrics.consistency)}`}>
              {qualityMetrics.consistency}%
            </div>
            <div className="text-sm text-gray-600 mb-2">Consistency</div>
            <Progress value={qualityMetrics.consistency} className="h-2" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <div className={`text-2xl font-bold mb-1 ${getScoreColor(qualityMetrics.accuracy)}`}>
              {qualityMetrics.accuracy}%
            </div>
            <div className="text-sm text-gray-600 mb-2">Accuracy</div>
            <Progress value={qualityMetrics.accuracy} className="h-2" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <div className={`text-2xl font-bold mb-1 ${getScoreColor(qualityMetrics.validity)}`}>
              {qualityMetrics.validity}%
            </div>
            <div className="text-sm text-gray-600 mb-2">Validity</div>
            <Progress value={qualityMetrics.validity} className="h-2" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <div className={`text-2xl font-bold mb-1 ${getScoreColor(qualityMetrics.uniqueness)}`}>
              {qualityMetrics.uniqueness}%
            </div>
            <div className="text-sm text-gray-600 mb-2">Uniqueness</div>
            <Progress value={qualityMetrics.uniqueness} className="h-2" />
          </div>
        </Card>
      </div>

      {/* Issues and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Quality Issues */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Data Quality Issues ({qualityMetrics.issues.length})
          </h3>
          
          {qualityMetrics.issues.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p>No data quality issues detected!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {qualityMetrics.issues.map((issue, index) => (
                <div key={index} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(issue.severity)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getSeverityColor(issue.severity) as any} className="text-xs">
                          {issue.severity.toUpperCase()}
                        </Badge>
                        <span className="font-medium text-sm">{issue.column}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{issue.description}</p>
                      <p className="text-xs text-blue-600">{issue.suggestion}</p>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      {issue.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recommendations */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Recommendations
          </h3>
          
          <div className="space-y-3">
            {qualityMetrics.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">{recommendation}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Data Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Dataset Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{data.summary.totalRows.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Rows</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{data.summary.totalColumns}</div>
            <div className="text-sm text-gray-600">Columns</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {(data.summary.totalRows * data.summary.totalColumns).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Cells</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {qualityMetrics.issues.filter(i => i.severity === 'critical' || i.severity === 'high').length}
            </div>
            <div className="text-sm text-gray-600">Critical Issues</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DataQualityDashboard;
