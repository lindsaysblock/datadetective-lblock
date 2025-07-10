
import { ParsedData } from '../dataParser';

export interface DataPoint {
  name: string;
  value: number;
  percentage?: number;
  color?: string;
}

export const generateSampleData = (data: ParsedData): DataPoint[] => {
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

export const generateBehavioralSampleData = (): DataPoint[] => {
  return [
    { name: 'Login', value: 85, percentage: 85 },
    { name: 'Page Views', value: 92, percentage: 92 },
    { name: 'Feature Use', value: 67, percentage: 67 },
    { name: 'Engagement', value: 73, percentage: 73 }
  ];
};

export const generateTrendSampleData = (): DataPoint[] => {
  return [
    { name: 'Week 1', value: 45 },
    { name: 'Week 2', value: 52 },
    { name: 'Week 3', value: 48 },
    { name: 'Week 4', value: 61 },
    { name: 'Week 5', value: 58 }
  ];
};

export const generateSegmentSampleData = (): DataPoint[] => {
  return [
    { name: 'Power Users', value: 25, percentage: 25 },
    { name: 'Regular Users', value: 45, percentage: 45 },
    { name: 'Casual Users', value: 20, percentage: 20 },
    { name: 'New Users', value: 10, percentage: 10 }
  ];
};

export const generateComparisonSampleData = (): DataPoint[] => {
  return [
    { name: 'Feature A', value: 78, percentage: 78 },
    { name: 'Feature B', value: 65, percentage: 65 }
  ];
};
