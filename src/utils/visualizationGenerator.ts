
import { ParsedData } from './dataParser';

export interface DataPoint {
  name: string;
  value: number;
  percentage?: number;
  color?: string;
}

export interface VisualizationRecommendation {
  type: 'bar' | 'line' | 'pie' | 'comparison';
  title: string;
  description: string;
  icon: string;
  data: DataPoint[];
  reason: string;
}

export const generateVisualizationRecommendations = (
  query: string,
  data: ParsedData,
  context?: string
): VisualizationRecommendation[] => {
  const recommendations: VisualizationRecommendation[] = [];
  const lowerQuery = query.toLowerCase();
  
  // Sample data generation based on common user behavior patterns
  if (lowerQuery.includes('behavior') || lowerQuery.includes('activity') || lowerQuery.includes('usage')) {
    // Bar chart for activity comparison
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
      reason: 'Bar charts are perfect for comparing different user activities side by side'
    });
  }

  if (lowerQuery.includes('trend') || lowerQuery.includes('time') || lowerQuery.includes('over time')) {
    // Line chart for trends
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
      reason: 'Line charts excel at showing trends and patterns over time periods'
    });
  }

  if (lowerQuery.includes('segment') || lowerQuery.includes('group') || lowerQuery.includes('distribution')) {
    // Pie chart for segments
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
      reason: 'Pie charts clearly show proportional relationships and distributions'
    });
  }

  if (lowerQuery.includes('compare') || lowerQuery.includes('vs') || lowerQuery.includes('versus')) {
    // Comparison chart
    recommendations.push({
      type: 'comparison',
      title: 'Feature Comparison',
      description: 'Compare usage between different features or user groups',
      icon: 'TrendingUp',
      data: [
        { name: 'Feature A', value: 78, percentage: 78 },
        { name: 'Feature B', value: 65, percentage: 65 }
      ],
      reason: 'Comparison charts highlight differences between key metrics'
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
      reason: 'A good starting point to understand your data distribution'
    });
  }

  return recommendations;
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
