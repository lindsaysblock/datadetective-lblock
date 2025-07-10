
import { ParsedData } from './dataParser';

export interface DataPoint {
  name: string;
  value: number;
  percentage?: number;
  color?: string;
}

export interface DataQualityScore {
  completeness: number; // 0-100
  consistency: number; // 0-100
  accuracy: number; // 0-100
  overall: number; // 0-100
  issues: string[];
}

export interface StatisticalValidation {
  sampleSize: number;
  confidenceLevel: number;
  marginOfError: number;
  isSignificant: boolean;
  warnings: string[];
}

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
      data: [
        { name: 'Login', value: 85, percentage: 85 },
        { name: 'Page Views', value: 92, percentage: 92 },
        { name: 'Feature Use', value: 67, percentage: 67 },
        { name: 'Engagement', value: 73, percentage: 73 }
      ],
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
      data: [
        { name: 'Week 1', value: 45 },
        { name: 'Week 2', value: 52 },
        { name: 'Week 3', value: 48 },
        { name: 'Week 4', value: 61 },
        { name: 'Week 5', value: 58 }
      ],
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
      data: [
        { name: 'Power Users', value: 25, percentage: 25 },
        { name: 'Regular Users', value: 45, percentage: 45 },
        { name: 'Casual Users', value: 20, percentage: 20 },
        { name: 'New Users', value: 10, percentage: 10 }
      ],
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
      data: [
        { name: 'Feature A', value: 78, percentage: 78 },
        { name: 'Feature B', value: 65, percentage: 65 }
      ],
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

const calculateDataQuality = (data: ParsedData): DataQualityScore => {
  const issues: string[] = [];
  
  // Check completeness
  const totalCells = data.summary.totalRows * data.summary.totalColumns;
  const emptyCells = data.rows.reduce((count, row) => {
    return count + Object.values(row).filter(val => val === null || val === undefined || val === '').length;
  }, 0);
  const completeness = Math.max(0, ((totalCells - emptyCells) / totalCells) * 100);
  
  if (completeness < 80) {
    issues.push(`${Math.round(100 - completeness)}% of data is missing or empty`);
  }
  
  // Check consistency (basic checks)
  let consistency = 100;
  if (data.summary.totalRows < 10) {
    consistency -= 30;
    issues.push('Small sample size may lead to unreliable insights');
  }
  
  // Check for potential accuracy issues
  let accuracy = 90; // Base accuracy score
  if (data.summary.possibleUserIdColumns.length === 0) {
    accuracy -= 20;
    issues.push('No clear user identifier columns detected');
  }
  
  if (data.summary.possibleTimestampColumns.length === 0) {
    accuracy -= 10;
    issues.push('No timestamp columns detected - time-based analysis may be limited');
  }
  
  const overall = Math.round((completeness + consistency + accuracy) / 3);
  
  return {
    completeness: Math.round(completeness),
    consistency: Math.round(consistency),
    accuracy: Math.round(accuracy),
    overall,
    issues
  };
};

const calculateStatisticalValidation = (data: ParsedData): StatisticalValidation => {
  const sampleSize = data.summary.totalRows;
  const warnings: string[] = [];
  
  // Basic statistical validation
  let confidenceLevel = 95;
  let marginOfError = 5;
  let isSignificant = true;
  
  if (sampleSize < 30) {
    confidenceLevel = 80;
    marginOfError = 15;
    isSignificant = false;
    warnings.push('Sample size is too small for reliable statistical analysis');
  } else if (sampleSize < 100) {
    confidenceLevel = 90;
    marginOfError = 10;
    warnings.push('Moderate sample size - results should be interpreted with caution');
  }
  
  if (data.summary.totalColumns < 3) {
    warnings.push('Limited data dimensions may restrict analysis depth');
  }
  
  return {
    sampleSize,
    confidenceLevel,
    marginOfError,
    isSignificant,
    warnings
  };
};

const generateSampleData = (data: ParsedData): DataPoint[] => {
  // Generate sample data based on the actual dataset structure
  const numericColumns = data.columns.filter(col => col.type === 'number');
  
  if (numericColumns.length > 0) {
    return numericColumns.slice(0, 5).map((col, index) => ({
      name: col.name,
      value: Math.floor(Math.random() * 100) + 1,
      percentage: Math.floor(Math.random() * 100) + 1
    }));
  }

  // Default sample data
  return [
    { name: 'Category A', value: 65, percentage: 65 },
    { name: 'Category B', value: 78, percentage: 78 },
    { name: 'Category C', value: 45, percentage: 45 },
    { name: 'Category D', value: 82, percentage: 82 }
  ];
};
