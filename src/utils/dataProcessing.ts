
/**
 * Data Processing Utilities
 * Refactored to meet coding standards with proper constants and error handling
 */

import { type ParsedData } from './dataParser';

const MINIMUM_ROWS_FOR_ANALYSIS = 100;
const STATISTICAL_POWER_RATIO = 10;
const MAX_STATISTICAL_POWER = 95;
const MIN_PROCESSING_TIME = 5000;
const TIME_PER_MB = 2000;

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

  if (data.summary.totalRows > MINIMUM_ROWS_FOR_ANALYSIS) {
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
        { name: 'Recommended Min', value: MINIMUM_ROWS_FOR_ANALYSIS },
        { name: 'Statistical Power', value: Math.min(data.summary.totalRows / STATISTICAL_POWER_RATIO, MAX_STATISTICAL_POWER) }
      ]
    });
  }

  return findings;
};

export const calculateEstimatedTime = (fileSizeInMB: number): number => {
  return Math.max(MIN_PROCESSING_TIME, fileSizeInMB * TIME_PER_MB);
};

export const formatFileSize = (bytes?: number): string => {
  const BYTES_PER_KB = 1024;
  const BYTES_PER_MB = BYTES_PER_KB * 1024;
  
  if (!bytes) return 'Unknown size';
  
  const kb = bytes / BYTES_PER_KB;
  const mb = kb / BYTES_PER_KB;
  
  if (mb >= 1) {
    return `${mb.toFixed(1)} MB`;
  } else if (kb >= 1) {
    return `${kb.toFixed(1)} KB`;
  } else {
    return `${bytes} bytes`;
  }
};
