
import { ParsedData } from '../dataParser';
import { ValidationResult } from '../../types/analytics';

export class DataValidator {
  private readonly data: ParsedData;
  private readonly enableLogging: boolean;

  constructor(data: ParsedData, enableLogging = true) {
    this.data = data;
    this.enableLogging = enableLogging;
  }

  validate(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Basic structure validation
      this.validateStructure(errors, warnings);
      
      // Data quality validation
      this.validateDataQuality(errors, warnings);
      
      // Column validation
      this.validateColumns(errors, warnings);
      
      // Row validation
      this.validateRows(errors, warnings);

      const confidence = this.calculateConfidence(errors, warnings);

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        confidence
      };
    } catch (error) {
      if (this.enableLogging) {
        console.error('Data validation failed:', error);
      }
      
      return {
        isValid: false,
        errors: [`Validation failed: ${error}`],
        warnings: [],
        confidence: 'low'
      };
    }
  }

  private validateStructure(errors: string[], warnings: string[]): void {
    if (!this.data.columns || this.data.columns.length === 0) {
      errors.push('No columns found in dataset');
    }

    if (!this.data.rows || this.data.rows.length === 0) {
      errors.push('No rows found in dataset');
    }

    if (this.data.rows && this.data.rows.length < 10) {
      warnings.push('Dataset has fewer than 10 rows, analysis may be limited');
    }
  }

  private validateDataQuality(errors: string[], warnings: string[]): void {
    if (!this.data.rows || !this.data.columns) return;

    const totalCells = this.data.rows.length * this.data.columns.length;
    let emptyCells = 0;

    this.data.rows.forEach(row => {
      this.data.columns!.forEach(col => {
        const value = row[col.name];
        if (this.isEmpty(value)) {
          emptyCells++;
        }
      });
    });

    const completeness = ((totalCells - emptyCells) / totalCells) * 100;
    
    if (completeness < 50) {
      errors.push(`Data completeness is too low: ${completeness.toFixed(1)}%`);
    } else if (completeness < 80) {
      warnings.push(`Data completeness could be improved: ${completeness.toFixed(1)}%`);
    }
  }

  private validateColumns(errors: string[], warnings: string[]): void {
    if (!this.data.columns) return;

    const columnNames = this.data.columns.map(col => col.name);
    const duplicateColumns = columnNames.filter((name, index) => 
      columnNames.indexOf(name) !== index
    );

    if (duplicateColumns.length > 0) {
      errors.push(`Duplicate column names found: ${duplicateColumns.join(', ')}`);
    }

    // Check for essential analytics columns
    const hasTimestamp = columnNames.some(name => 
      /timestamp|date|time|created_at/i.test(name)
    );
    
    if (!hasTimestamp) {
      warnings.push('No timestamp column detected, time-based analysis will be limited');
    }
  }

  private validateRows(errors: string[], warnings: string[]): void {
    if (!this.data.rows || this.data.rows.length === 0) return;

    // Check for completely empty rows
    const emptyRows = this.data.rows.filter(row => 
      Object.values(row).every(value => this.isEmpty(value))
    );

    if (emptyRows.length > 0) {
      warnings.push(`${emptyRows.length} completely empty rows found`);
    }
  }

  private calculateConfidence(errors: string[], warnings: string[]): 'high' | 'medium' | 'low' {
    if (errors.length > 0) return 'low';
    if (warnings.length > 3) return 'low';
    if (warnings.length > 1) return 'medium';
    return 'high';
  }

  private isEmpty(value: unknown): boolean {
    return value === null || value === undefined || value === '' || 
           value === 'null' || value === 'undefined';
  }
}
