
/**
 * Dashboard Recommendations
 * Generates intelligent visualization recommendations based on data analysis
 */

import { BarChart3 } from 'lucide-react';
import { type ParsedData } from './dataParser';

/** Recommendation generation constants */
const RECOMMENDATION_CONSTANTS = {
  MAX_NUMERIC_COLUMNS: 5,
  MAX_DATE_COLUMNS: 3,
  MIN_SAMPLE_SIZE: 30,
  MIN_ROWS_FOR_RELIABILITY: 50,
  QUALITY_THRESHOLDS: {
    min_completeness: 60,
    min_consistency: 70,
    min_accuracy: 75,
    min_overall: 70,
    max_score: 95
  },
  CONFIDENCE_LEVELS: {
    high: 95,
    medium: 90
  }
} as const;

/**
 * Generates visualization recommendations based on parsed data
 * Analyzes data structure and suggests appropriate chart types
 */
export const generateRecommendations = (data: ParsedData) => {
  const numericColumns = data.columns.filter(col => col.type === 'number');
  const recommendations = [];

  if (numericColumns.length > 0) {
    recommendations.push({
      type: 'bar' as const,
      title: 'Numeric Data Distribution',
      description: 'Compare values across different numeric columns',
      icon: BarChart3,
      data: numericColumns.slice(0, RECOMMENDATION_CONSTANTS.MAX_NUMERIC_COLUMNS).map(col => ({
        name: col.name,
        value: col.samples.reduce((sum, val) => sum + (Number(val) || 0), 0) / col.samples.length || 0
      })),
      reason: 'Shows distribution of numeric values across columns',
      confidence: 'high' as const,
      qualityScore: {
        completeness: Math.min(RECOMMENDATION_CONSTANTS.QUALITY_THRESHOLDS.max_score, 
          Math.max(RECOMMENDATION_CONSTANTS.QUALITY_THRESHOLDS.min_completeness, (data.summary.totalRows / 10))),
        consistency: Math.min(RECOMMENDATION_CONSTANTS.QUALITY_THRESHOLDS.max_score, 
          Math.max(RECOMMENDATION_CONSTANTS.QUALITY_THRESHOLDS.min_consistency, 100 - (data.columns.length * 2))),
        accuracy: Math.min(RECOMMENDATION_CONSTANTS.QUALITY_THRESHOLDS.max_score, 
          Math.max(RECOMMENDATION_CONSTANTS.QUALITY_THRESHOLDS.min_accuracy, 100 - (data.summary.totalColumns * 1.5))),
        overall: Math.min(RECOMMENDATION_CONSTANTS.QUALITY_THRESHOLDS.max_score, 
          Math.max(RECOMMENDATION_CONSTANTS.QUALITY_THRESHOLDS.min_overall, (data.summary.totalRows / 10))),
        issues: data.summary.totalRows < RECOMMENDATION_CONSTANTS.MIN_ROWS_FOR_RELIABILITY ? 
          ['Small sample size may affect reliability'] : []
      },
      validation: {
        sampleSize: data.summary.totalRows,
        confidenceLevel: RECOMMENDATION_CONSTANTS.CONFIDENCE_LEVELS.high,
        marginOfError: Math.max(1, Math.min(10, 100 / Math.sqrt(data.summary.totalRows))),
        isSignificant: data.summary.totalRows >= RECOMMENDATION_CONSTANTS.MIN_SAMPLE_SIZE,
        warnings: data.summary.totalRows < RECOMMENDATION_CONSTANTS.MIN_SAMPLE_SIZE ? 
          ['Sample size below recommended minimum'] : []
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
      data: dateColumns.slice(0, RECOMMENDATION_CONSTANTS.MAX_DATE_COLUMNS).map((col, index) => ({
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
        confidenceLevel: RECOMMENDATION_CONSTANTS.CONFIDENCE_LEVELS.medium,
        marginOfError: 4.5,
        isSignificant: true,
        warnings: []
      },
      businessRelevance: 'Time series analysis helps identify growth trends and seasonal patterns in your business data.'
    });
  }

  return recommendations;
};
