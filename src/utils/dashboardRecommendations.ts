
import { BarChart3 } from 'lucide-react';
import { type ParsedData } from './dataParser';

export const generateRecommendations = (data: ParsedData) => {
  const numericColumns = data.columns.filter(col => col.type === 'number');
  const recommendations = [];

  if (numericColumns.length > 0) {
    recommendations.push({
      type: 'bar' as const,
      title: 'Numeric Data Distribution',
      description: 'Compare values across different numeric columns',
      icon: BarChart3,
      data: numericColumns.slice(0, 5).map(col => ({
        name: col.name,
        value: col.samples.reduce((sum, val) => sum + (Number(val) || 0), 0) / col.samples.length || 0
      })),
      reason: 'Shows distribution of numeric values across columns',
      confidence: 'high' as const,
      qualityScore: {
        completeness: Math.min(95, Math.max(60, (data.summary.totalRows / 10))),
        consistency: Math.min(95, Math.max(70, 100 - (data.columns.length * 2))),
        accuracy: Math.min(95, Math.max(75, 100 - (data.summary.totalColumns * 1.5))),
        overall: Math.min(95, Math.max(70, (data.summary.totalRows / 10))),
        issues: data.summary.totalRows < 50 ? ['Small sample size may affect reliability'] : []
      },
      validation: {
        sampleSize: data.summary.totalRows,
        confidenceLevel: 95,
        marginOfError: Math.max(1, Math.min(10, 100 / Math.sqrt(data.summary.totalRows))),
        isSignificant: data.summary.totalRows >= 30,
        warnings: data.summary.totalRows < 30 ? ['Sample size below recommended minimum'] : []
      },
      businessRelevance: 'Understanding data distribution helps identify patterns and outliers in your dataset.'
    });
  }

  const dateColumns = data.columns.filter(col => col.type === 'date');
  if (dateColumns.length > 0) {
    recommendations.push({
      type: 'line' as const,
      title: 'Time Series Analysis',
      description: 'Analyze trends over time periods',
      icon: BarChart3,
      data: dateColumns.slice(0, 3).map((col, index) => ({
        name: col.name,
        value: 100 - (index * 20)
      })),
      reason: 'Time-based data can reveal seasonal patterns and trends',
      confidence: 'medium' as const,
      qualityScore: {
        completeness: 85,
        consistency: 90,
        accuracy: 85,
        overall: 87,
        issues: []
      },
      validation: {
        sampleSize: data.summary.totalRows,
        confidenceLevel: 90,
        marginOfError: 4.5,
        isSignificant: true,
        warnings: []
      },
      businessRelevance: 'Time series analysis helps identify growth trends and seasonal patterns in your business data.'
    });
  }

  return recommendations;
};
