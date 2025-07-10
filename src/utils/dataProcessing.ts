
import { type ParsedData } from './dataParser';

export const generateMockFindings = (data: ParsedData) => {
  const findings = [];
  
  if (data.summary.possibleUserIdColumns.length > 0) {
    findings.push({
      id: '1',
      title: 'User Identification Patterns',
      description: 'Analysis of user identifier distribution in the dataset',
      chartType: 'Bar Chart',
      insight: `Found ${data.summary.possibleUserIdColumns.length} potential user ID columns. This suggests good data structure for user behavior analysis.`,
      confidence: 'high' as const,
      timestamp: new Date(),
      chartData: data.summary.possibleUserIdColumns.map(col => ({
        name: col,
        value: Math.floor(Math.random() * 100) + 50
      }))
    });
  }

  if (data.summary.totalRows > 100) {
    findings.push({
      id: '2',
      title: 'Dataset Size Analysis',
      description: 'Statistical significance assessment of the dataset',
      chartType: 'Line Chart',
      insight: `Dataset contains ${data.summary.totalRows} rows, which provides good statistical power for analysis. Confidence intervals will be reliable.`,
      confidence: 'high' as const,
      timestamp: new Date(),
      chartData: [
        { name: 'Sample Size', value: data.summary.totalRows },
        { name: 'Recommended Min', value: 100 },
        { name: 'Statistical Power', value: Math.min(data.summary.totalRows / 10, 95) }
      ]
    });
  }

  return findings;
};

export const calculateEstimatedTime = (fileSizeInMB: number): number => {
  return Math.max(5000, fileSizeInMB * 2000);
};

export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return 'Unknown size';
  const kb = bytes / 1024;
  const mb = kb / 1024;
  
  if (mb >= 1) {
    return `${mb.toFixed(1)} MB`;
  } else if (kb >= 1) {
    return `${kb.toFixed(1)} KB`;
  } else {
    return `${bytes} bytes`;
  }
};
