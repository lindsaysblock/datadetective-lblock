
import { ParsedData } from '../dataParser';

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

export const calculateDataQuality = (data: ParsedData): DataQualityScore => {
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

export const calculateStatisticalValidation = (data: ParsedData): StatisticalValidation => {
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
