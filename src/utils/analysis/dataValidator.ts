import { ParsedData } from '../dataParser';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  confidence: 'high' | 'medium' | 'low';
  completeness?: number;
}

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

      if (this.enableLogging && (errors.length > 0 || warnings.length > 0)) {
        console.log('📊 Data validation completed:', {
          errors: errors.length,
          warnings: warnings.length,
          confidence
        });
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        confidence
      };
    } catch (error) {
      if (this.enableLogging) {
        console.error('❌ Data validation failed:', error);
      }
      
      return {
        isValid: false,
        errors: [`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: [],
        confidence: 'low'
      };
    }
  }

  private validateStructure(errors: string[], warnings: string[]): void {
    if (!this.data) {
      errors.push('No data provided for validation');
      return;
    }

    if (!this.data.columns || this.data.columns.length === 0) {
      errors.push('No columns found in dataset');
    }

    if (!this.data.rows || this.data.rows.length === 0) {
      errors.push('No rows found in dataset');
      return;
    }

    if (this.data.rows.length < 3) {
      warnings.push('Dataset has very few rows (< 3), analysis may be limited');
    } else if (this.data.rows.length < 10) {
      warnings.push('Dataset has fewer than 10 rows, analysis may be limited');
    }

    // Check for consistent row structure
    if (this.data.rows.length > 0 && this.data.columns.length > 0) {
      const expectedKeys = this.data.columns.map(col => col.name);
      const inconsistentRows = this.data.rows.filter(row => {
        const rowKeys = Object.keys(row);
        return expectedKeys.some(key => !rowKeys.includes(key));
      });

      if (inconsistentRows.length > 0) {
        warnings.push(`${inconsistentRows.length} rows have inconsistent structure`);
      }
    }
  }

  private validateDataQuality(errors: string[], warnings: string[]): void {
    if (!this.data.rows || !this.data.columns || this.data.rows.length === 0) return;

    const totalCells = this.data.rows.length * this.data.columns.length;
    let emptyCells = 0;
    let nullCells = 0;

    this.data.rows.forEach(row => {
      this.data.columns!.forEach(col => {
        const value = row[col.name];
        if (this.isEmpty(value)) {
          emptyCells++;
        }
        if (value === null || value === undefined) {
          nullCells++;
        }
      });
    });

    const completeness = ((totalCells - emptyCells) / totalCells) * 100;
    
    if (completeness < 30) {
      errors.push(`Data completeness is critically low: ${completeness.toFixed(1)}%`);
    } else if (completeness < 50) {
      errors.push(`Data completeness is too low: ${completeness.toFixed(1)}%`);
    } else if (completeness < 70) {
      warnings.push(`Data completeness could be improved: ${completeness.toFixed(1)}%`);
    } else if (completeness < 90) {
      warnings.push(`Good data completeness: ${completeness.toFixed(1)}%`);
    }

    // Check for completely empty columns
    const emptyColumns = this.data.columns.filter(col => {
      return this.data.rows!.every(row => this.isEmpty(row[col.name]));
    });

    if (emptyColumns.length > 0) {
      warnings.push(`${emptyColumns.length} columns are completely empty: ${emptyColumns.map(col => col.name).join(', ')}`);
    }
  }

  private validateColumns(errors: string[], warnings: string[]): void {
    if (!this.data.columns || this.data.columns.length === 0) return;

    const columnNames = this.data.columns.map(col => col.name);
    const duplicateColumns = columnNames.filter((name, index) => 
      columnNames.indexOf(name) !== index
    );

    if (duplicateColumns.length > 0) {
      errors.push(`Duplicate column names found: ${[...new Set(duplicateColumns)].join(', ')}`);
    }

    // Check for columns with suspicious names
    const suspiciousColumns = columnNames.filter(name => 
      /^(unnamed|column\d+|field\d+)$/i.test(name.trim())
    );

    if (suspiciousColumns.length > 0) {
      warnings.push(`Found columns with generic names: ${suspiciousColumns.join(', ')}`);
    }

    // Check for essential analytics columns
    const hasTimestamp = columnNames.some(name => 
      /timestamp|date|time|created_at|updated_at/i.test(name)
    );
    
    if (!hasTimestamp) {
      warnings.push('No timestamp column detected, time-based analysis will be limited');
    }

    // Check for ID columns
    const hasId = columnNames.some(name => 
      /^id$|_id$|identifier/i.test(name)
    );
    
    if (!hasId && this.data.rows && this.data.rows.length > 100) {
      warnings.push('No ID column detected in large dataset, consider adding unique identifiers');
    }
  }

  private validateRows(errors: string[], warnings: string[]): void {
    if (!this.data.rows || this.data.rows.length === 0) return;

    // Check for completely empty rows
    const emptyRows = this.data.rows.filter(row => 
      Object.values(row).every(value => this.isEmpty(value))
    );

    if (emptyRows.length > 0) {
      if (emptyRows.length === this.data.rows.length) {
        errors.push('All rows are empty');
      } else {
        warnings.push(`${emptyRows.length} completely empty rows found`);
      }
    }

    // Check for duplicate rows (sample first 1000 rows for performance)
    const sampleSize = Math.min(1000, this.data.rows.length);
    const sampleRows = this.data.rows.slice(0, sampleSize);
    const rowStrings = sampleRows.map(row => JSON.stringify(row));
    const uniqueRowStrings = new Set(rowStrings);

    if (uniqueRowStrings.size < rowStrings.length) {
      const duplicateCount = rowStrings.length - uniqueRowStrings.size;
      warnings.push(`Found ${duplicateCount} duplicate rows in sample of ${sampleSize} rows`);
    }
  }

  private calculateConfidence(errors: string[], warnings: string[]): 'high' | 'medium' | 'low' {
    if (errors.length > 0) return 'low';
    if (warnings.length > 4) return 'low';
    if (warnings.length > 2) return 'medium';
    if (warnings.length > 0) return 'medium';
    return 'high';
  }

  private isEmpty(value: unknown): boolean {
    return value === null || 
           value === undefined || 
           value === '' || 
           value === 'null' || 
           value === 'undefined' ||
           value === 'N/A' ||
           value === 'n/a' ||
           (typeof value === 'string' && value.trim() === '');
  }
}
