
/**
 * Data Quality Analyzer
 * Analyzes data quality metrics and provides recommendations
 * Refactored for consistency and maintainability
 */

import { ANALYSIS_CONFIG } from '@/constants/analysis';

export interface DataQualityMetrics {
  completeness: number;
  consistency: number;
  accuracy: number;
  validity: number;
  uniqueness: number;
  overall: number;
  issues: QualityIssue[];
  recommendations: string[];
}

export interface QualityIssue {
  type: 'missing' | 'duplicate' | 'inconsistent' | 'invalid' | 'outlier';
  severity: 'low' | 'medium' | 'high' | 'critical';
  column: string;
  count: number;
  percentage: number;
  description: string;
  suggestion: string;
}

export interface ColumnQuality {
  name: string;
  completeness: number;
  uniqueness: number;
  validity: number;
  issues: QualityIssue[];
  dataType: string;
  distinctValues: number;
  nullCount: number;
  duplicateCount: number;
}

export const analyzeDataQuality = (data: Record<string, any>[]): DataQualityMetrics => {
  if (!data || data.length === 0) {
    return {
      completeness: 0,
      consistency: 0,
      accuracy: 0,
      validity: 0,
      uniqueness: 0,
      overall: 0,
      issues: [],
      recommendations: ['No data available for analysis']
    };
  }

  const columns = Object.keys(data[0]);
  const totalCells = data.length * columns.length;
  const issues: QualityIssue[] = [];
  const columnQualities: ColumnQuality[] = [];

  // Analyze each column
  columns.forEach(column => {
    const values = data.map(row => row[column]);
    const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
    const uniqueValues = new Set(nonNullValues);
    
    const completeness = (nonNullValues.length / values.length) * 100;
    const uniqueness = values.length > 0 ? (uniqueValues.size / values.length) * 100 : 0;
    const nullCount = values.length - nonNullValues.length;
    const duplicateCount = values.length - uniqueValues.size;

    // Check for missing values
    if (nullCount > 0) {
      issues.push({
        type: 'missing',
        severity: nullCount / values.length > 0.2 ? 'high' : 'medium',
        column,
        count: nullCount,
        percentage: (nullCount / values.length) * 100,
        description: `${nullCount} missing values in ${column}`,
        suggestion: `Consider filling missing values or removing incomplete records`
      });
    }

    // Check for duplicates
    if (duplicateCount > 0) {
      issues.push({
        type: 'duplicate',
        severity: duplicateCount / values.length > 0.1 ? 'medium' : 'low',
        column,
        count: duplicateCount,
        percentage: (duplicateCount / values.length) * 100,
        description: `${duplicateCount} duplicate values in ${column}`,
        suggestion: `Review and remove duplicate entries if appropriate`
      });
    }

    // Data type validation
    let validity = 100;
    const dataType = inferDataType(nonNullValues);
    
    if (dataType === 'number') {
      const invalidNumbers = nonNullValues.filter(v => isNaN(Number(v))).length;
      if (invalidNumbers > 0) {
        validity = ((nonNullValues.length - invalidNumbers) / nonNullValues.length) * 100;
        issues.push({
          type: 'invalid',
          severity: 'medium',
          column,
          count: invalidNumbers,
          percentage: (invalidNumbers / nonNullValues.length) * 100,
          description: `${invalidNumbers} invalid numeric values in ${column}`,
          suggestion: `Convert or clean invalid numeric values`
        });
      }
    }

    // Outlier detection for numeric columns
    if (dataType === 'number') {
      const numericValues = nonNullValues.map(Number).filter(n => !isNaN(n));
      const outliers = detectOutliers(numericValues);
      
      if (outliers.length > 0) {
        issues.push({
          type: 'outlier',
          severity: 'low',
          column,
          count: outliers.length,
          percentage: (outliers.length / numericValues.length) * 100,
          description: `${outliers.length} potential outliers in ${column}`,
          suggestion: `Review outlier values for data entry errors`
        });
      }
    }

    columnQualities.push({
      name: column,
      completeness,
      uniqueness,
      validity,
      issues: issues.filter(i => i.column === column),
      dataType,
      distinctValues: uniqueValues.size,
      nullCount,
      duplicateCount
    });
  });

  // Calculate overall metrics
  const avgCompleteness = columnQualities.reduce((sum, col) => sum + col.completeness, 0) / columns.length;
  const avgUniqueness = columnQualities.reduce((sum, col) => sum + col.uniqueness, 0) / columns.length;
  const avgValidity = columnQualities.reduce((sum, col) => sum + col.validity, 0) / columns.length;

  // Consistency check (similar values in different formats)
  const consistency = calculateConsistency(data, columns);
  
  // Accuracy estimation (based on data type conformity and outliers)
  const accuracy = Math.min(avgValidity, 100 - (issues.filter(i => i.type === 'outlier').length / totalCells * 100));

  const overall = (avgCompleteness + consistency + accuracy + avgValidity + Math.min(avgUniqueness, 90)) / 5;

  // Generate recommendations
  const recommendations = generateRecommendations(issues, overall);

  return {
    completeness: Math.round(avgCompleteness),
    consistency: Math.round(consistency),
    accuracy: Math.round(accuracy),
    validity: Math.round(avgValidity),
    uniqueness: Math.round(avgUniqueness),
    overall: Math.round(overall),
    issues: issues.sort((a, b) => getSeverityScore(b.severity) - getSeverityScore(a.severity)),
    recommendations
  };
};

const inferDataType = (values: any[]): string => {
  if (values.length === 0) return 'unknown';
  
  const sample = values.slice(0, Math.min(100, values.length));
  const numericCount = sample.filter(v => !isNaN(Number(v))).length;
  const dateCount = sample.filter(v => !isNaN(Date.parse(v))).length;
  const booleanCount = sample.filter(v => 
    v === 'true' || v === 'false' || v === true || v === false
  ).length;

  if (numericCount / sample.length > 0.8) return 'number';
  if (dateCount / sample.length > 0.8) return 'date';
  if (booleanCount / sample.length > 0.8) return 'boolean';
  return 'string';
};

const detectOutliers = (values: number[]): number[] => {
  if (values.length < 4) return [];
  
  const sorted = [...values].sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;
  
  return values.filter(v => v < lowerBound || v > upperBound);
};

const calculateConsistency = (data: Record<string, any>[], columns: string[]): number => {
  let consistencyScore = 100;
  
  // Check for inconsistent formatting (e.g., different date formats, case variations)
  columns.forEach(column => {
    const values = data.map(row => row[column]).filter(v => v !== null && v !== undefined && v !== '');
    const stringValues = values.map(v => String(v));
    
    // Check case consistency for string values
    if (stringValues.length > 1) {
      const hasUpperCase = stringValues.some(v => v !== v.toLowerCase());
      const hasLowerCase = stringValues.some(v => v !== v.toUpperCase());
      
      if (hasUpperCase && hasLowerCase) {
        consistencyScore -= 5; // Penalty for mixed case
      }
    }
    
    // Check for multiple date formats
    const dateValues = stringValues.filter(v => !isNaN(Date.parse(v)));
    if (dateValues.length > 1) {
      const formats = new Set(dateValues.map(v => {
        if (v.includes('/')) return 'slash';
        if (v.includes('-')) return 'dash';
        if (v.includes('.')) return 'dot';
        return 'other';
      }));
      
      if (formats.size > 1) {
        consistencyScore -= 10; // Penalty for mixed date formats
      }
    }
  });
  
  return Math.max(0, consistencyScore);
};

const generateRecommendations = (issues: QualityIssue[], overallScore: number): string[] => {
  const recommendations: string[] = [];
  
  if (overallScore < 70) {
    recommendations.push('🚨 Overall data quality is below acceptable threshold');
  }
  
  const criticalIssues = issues.filter(i => i.severity === 'critical');
  if (criticalIssues.length > 0) {
    recommendations.push(`🔴 Address ${criticalIssues.length} critical data quality issues immediately`);
  }
  
  const missingDataIssues = issues.filter(i => i.type === 'missing');
  if (missingDataIssues.length > 0) {
    recommendations.push('📋 Implement data validation rules to prevent missing values');
  }
  
  const duplicateIssues = issues.filter(i => i.type === 'duplicate');
  if (duplicateIssues.length > 0) {
    recommendations.push('🔍 Set up duplicate detection and removal processes');
  }
  
  if (overallScore >= 90) {
    recommendations.push('✅ Excellent data quality! Consider automated monitoring');
  } else if (overallScore >= 80) {
    recommendations.push('👍 Good data quality with room for minor improvements');
  }
  
  return recommendations;
};

const getSeverityScore = (severity: string): number => {
  switch (severity) {
    case 'critical': return 4;
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1;
    default: return 0;
  }
};
