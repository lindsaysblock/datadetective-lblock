
import { ParsedDataFile } from '@/types/data';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  score: number; // 0-100
  metadata: {
    rowCount: number;
    columnCount: number;
    completeness: number;
    consistency: number;
  };
}

export class DataValidator {
  static validate(data: ParsedDataFile[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let score = 100;

    if (!data || data.length === 0) {
      errors.push('No data provided for analysis');
      return {
        isValid: false,
        errors,
        warnings,
        score: 0,
        metadata: { rowCount: 0, columnCount: 0, completeness: 0, consistency: 0 }
      };
    }

    let totalRows = 0;
    let totalColumns = 0;
    let emptyValues = 0;
    let totalValues = 0;

    for (const file of data) {
      if (!file.data || !Array.isArray(file.data)) {
        errors.push(`Invalid data structure in file: ${file.name}`);
        score -= 20;
        continue;
      }

      totalRows += file.data.length;
      
      if (file.data.length === 0) {
        warnings.push(`Empty dataset: ${file.name}`);
        score -= 10;
        continue;
      }

      const columns = Object.keys(file.data[0] || {});
      totalColumns = Math.max(totalColumns, columns.length);

      if (columns.length === 0) {
        errors.push(`No columns found in: ${file.name}`);
        score -= 15;
        continue;
      }

      // Check data completeness
      for (const row of file.data) {
        for (const value of Object.values(row)) {
          totalValues++;
          if (value === null || value === undefined || value === '') {
            emptyValues++;
          }
        }
      }

      // Validate data consistency
      if (file.data.length < 10) {
        warnings.push(`Small dataset (${file.data.length} rows) in: ${file.name}`);
        score -= 5;
      }
    }

    const completeness = totalValues > 0 ? ((totalValues - emptyValues) / totalValues) * 100 : 0;
    const consistency = Math.max(0, 100 - (warnings.length * 10));

    if (completeness < 70) {
      warnings.push(`Low data completeness: ${completeness.toFixed(1)}%`);
      score -= 15;
    }

    if (totalRows < 5) {
      errors.push('Insufficient data for meaningful analysis (minimum 5 rows required)');
      score -= 25;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      score: Math.max(0, score),
      metadata: {
        rowCount: totalRows,
        columnCount: totalColumns,
        completeness,
        consistency
      }
    };
  }
}
