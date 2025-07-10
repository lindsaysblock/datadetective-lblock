
import { ParsedData } from '../dataParser';
import { DataQualityScore, StatisticalValidation, calculateDataQuality, calculateStatisticalValidation } from './dataQualityAnalyzer';
import { DataPoint, generateBehavioralSampleData, generateTrendSampleData, generateSegmentSampleData, generateComparisonSampleData, generateSampleData } from './sampleDataGenerator';

export interface VisualizationRecommendation {
  type: 'bar' | 'line' | 'pie' | 'comparison';
  title: string;
  description: string;
  icon: string;
  data: DataPoint[];
  reason: string;
  confidence: 'high' | 'medium' | 'low';
  qualityScore: DataQualityScore;
  validation: StatisticalValidation;
  businessRelevance: string;
}

export const generateVisualizationRecommendations = (
  query: string,
  data: ParsedData,
  context?: string
): VisualizationRecommendation[] => {
  const recommendations: VisualizationRecommendation[] = [];
  const lowerQuery = query.toLowerCase();
  
  // Calculate data quality for all recommendations
  const baseQuality = calculateDataQuality(data);
  const baseValidation = calculateStatisticalValidation(data);
  
  // Sample data generation based on common user behavior patterns
  if (lowerQuery.includes('behavior') || lowerQuery.includes('activity') || lowerQuery.includes('usage')) {
    recommendations.push({
      type: 'bar',
      title: 'User Activity Comparison',
      description: 'Compare different user activities or features',
      icon: 'BarChart3',
      data: generateBehavioralSampleData(),
      reason: 'Bar charts are perfect for comparing different user activities side by side',
      confidence: baseQuality.overall > 80 ? 'high' : baseQuality.overall > 60 ? 'medium' : 'low',
      qualityScore: baseQuality,
      validation: baseValidation,
      businessRelevance: 'Understanding user activity patterns helps prioritize feature development and identify engagement opportunities'
    });
  }

  if (lowerQuery.includes('trend') || lowerQuery.includes('time') || lowerQuery.includes('over time')) {
    const trendValidation = {
      ...baseValidation,
      warnings: [
        ...baseValidation.warnings,
        data.summary.possibleTimestampColumns.length === 0 ? 'No clear timestamp columns detected - trend analysis may be inaccurate' : ''
      ].filter(Boolean)
    };

    recommendations.push({
      type: 'line',
      title: 'Activity Trends Over Time',
      description: 'Show how user behavior changes over time',
      icon: 'LineChartIcon',
      data: generateTrendSampleData(),
      reason: 'Line charts excel at showing trends and patterns over time periods',
      confidence: data.summary.possibleTimestampColumns.length > 0 ? 'high' : 'low',
      qualityScore: baseQuality,
      validation: trendValidation,
      businessRelevance: 'Trend analysis reveals seasonal patterns and growth opportunities, crucial for forecasting and resource planning'
    });
  }

  if (lowerQuery.includes('segment') || lowerQuery.includes('group') || lowerQuery.includes('distribution')) {
    recommendations.push({
      type: 'pie',
      title: 'User Segment Distribution',
      description: 'Visualize how users are distributed across segments',
      icon: 'PieChartIcon',
      data: generateSegmentSampleData(),
      reason: 'Pie charts clearly show proportional relationships and distributions',
      confidence: baseQuality.overall > 70 ? 'high' : 'medium',
      qualityScore: baseQuality,
      validation: baseValidation,
      businessRelevance: 'User segmentation enables targeted marketing strategies and personalized user experiences'
    });
  }

  if (lowerQuery.includes('compare') || lowerQuery.includes('vs') || lowerQuery.includes('versus')) {
    recommendations.push({
      type: 'comparison',
      title: 'Feature Comparison',
      description: 'Compare usage between different features or user groups',
      icon: 'TrendingUp',
      data: generateComparisonSampleData(),
      reason: 'Comparison charts highlight differences between key metrics',
      confidence: 'medium',
      qualityScore: baseQuality,
      validation: baseValidation,
      businessRelevance: 'Feature comparison drives product decisions and helps identify which features deliver the most value'
    });
  }

  // Default recommendations if no specific patterns detected
  if (recommendations.length === 0) {
    recommendations.push({
      type: 'bar',
      title: 'Data Overview',
      description: 'General overview of your key metrics',
      icon: 'BarChart3',
      data: generateSampleData(data),
      reason: 'A good starting point to understand your data distribution',
      confidence: 'medium',
      qualityScore: baseQuality,
      validation: baseValidation,
      businessRelevance: 'Data overview provides foundational insights for strategic decision-making'
    });
  }

  return recommendations;
};
