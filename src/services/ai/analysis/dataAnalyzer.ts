import { AnalysisContext } from '@/services/intelligentQAService';

export interface DataInsights {
  rowCount: number;
  columnCount: number;
  columnTypes: string[];
  sampleData: any[];
  patterns: string[];
  dataQuality: {
    completeness: number;
    consistency: number;
    uniqueness: number;
    validity: number;
  };
}

export class DataAnalyzer {
  static analyzeDataContext(context: AnalysisContext): DataInsights {
    const data = context.data;
    
    if (!data || (!data.rows && !Array.isArray(data))) {
      return {
        rowCount: 0,
        columnCount: 0,
        columnTypes: [],
        sampleData: [],
        patterns: ['No data available for analysis'],
        dataQuality: {
          completeness: 0,
          consistency: 0,
          uniqueness: 0,
          validity: 0
        }
      };
    }

    const rows = data.rows || data;
    const columns = data.columns || (rows.length > 0 ? Object.keys(rows[0]) : []);
    
    return {
      rowCount: rows.length,
      columnCount: columns.length,
      columnTypes: this.inferColumnTypes(rows, columns),
      sampleData: rows.slice(0, 3),
      patterns: this.identifyDataPatterns(rows, columns),
      dataQuality: this.assessDataQuality(rows, columns)
    };
  }

  private static inferColumnTypes(rows: any[], columns: string[]): string[] {
    return columns.map(col => {
      const sample = rows.slice(0, 20).map(row => row[col]).filter(val => val != null);
      
      if (sample.length === 0) return 'empty';
      
      // Check for numeric data
      if (sample.every(val => typeof val === 'number' || (!isNaN(Number(val)) && val !== ''))) {
        const numericValues = sample.map(val => Number(val));
        const hasDecimals = numericValues.some(val => val % 1 !== 0);
        return hasDecimals ? 'decimal' : 'integer';
      }
      
      // Check for date data
      if (sample.every(val => !isNaN(Date.parse(val)) && val.length > 4)) {
        return 'date';
      }
      
      // Check for boolean data
      if (sample.every(val => 
        typeof val === 'boolean' || 
        ['true', 'false', '1', '0', 'yes', 'no'].includes(String(val).toLowerCase())
      )) {
        return 'boolean';
      }
      
      // Check for categorical data (limited unique values)
      const uniqueValues = new Set(sample.map(val => String(val).toLowerCase()));
      if (uniqueValues.size <= Math.min(10, sample.length * 0.5)) {
        return 'categorical';
      }
      
      return 'text';
    });
  }

  private static identifyDataPatterns(rows: any[], columns: string[]): string[] {
    const patterns: string[] = [];
    
    // Missing data analysis
    const missingDataAnalysis = this.analyzeMissingData(rows, columns);
    patterns.push(...missingDataAnalysis);
    
    // Unique identifier detection
    const idColumns = this.detectIdColumns(rows, columns);
    if (idColumns.length > 0) {
      patterns.push(`Unique identifier columns detected: ${idColumns.join(', ')}`);
    }
    
    // Temporal data detection
    const temporalColumns = this.detectTemporalColumns(rows, columns);
    if (temporalColumns.length > 0) {
      patterns.push(`Time-series data available in: ${temporalColumns.join(', ')}`);
    }
    
    // Correlation potential
    const numericColumns = this.getNumericColumns(rows, columns);
    if (numericColumns.length >= 2) {
      patterns.push(`Correlation analysis possible between ${numericColumns.length} numeric columns`);
    }
    
    // Data distribution insights
    const distributionInsights = this.analyzeDistributions(rows, columns);
    patterns.push(...distributionInsights);
    
    return patterns;
  }

  private static analyzeMissingData(rows: any[], columns: string[]): string[] {
    const patterns: string[] = [];
    const totalRows = rows.length;
    
    const missingDataCols = columns.map(col => {
      const missing = rows.filter(row => row[col] == null || row[col] === '').length;
      const percentage = (missing / totalRows) * 100;
      return { column: col, missing, percentage };
    }).filter(item => item.percentage > 0);
    
    if (missingDataCols.length === 0) {
      patterns.push('Complete dataset: No missing values detected');
    } else {
      const highMissing = missingDataCols.filter(item => item.percentage > 10);
      const lowMissing = missingDataCols.filter(item => item.percentage <= 10);
      
      if (highMissing.length > 0) {
        patterns.push(`High missing data (>10%) in: ${highMissing.map(item => `${item.column} (${item.percentage.toFixed(1)}%)`).join(', ')}`);
      }
      
      if (lowMissing.length > 0) {
        patterns.push(`Minor missing data in: ${lowMissing.map(item => item.column).join(', ')}`);
      }
    }
    
    return patterns;
  }

  private static detectIdColumns(rows: any[], columns: string[]): string[] {
    return columns.filter(col => {
      const lowerCol = col.toLowerCase();
      const hasIdNaming = lowerCol.includes('id') || lowerCol.includes('key') || lowerCol.includes('uuid');
      const values = rows.map(row => row[col]).filter(val => val != null);
      const isUnique = new Set(values).size === values.length && values.length > 0;
      
      return hasIdNaming && isUnique;
    });
  }

  private static detectTemporalColumns(rows: any[], columns: string[]): string[] {
    return columns.filter(col => {
      const lowerCol = col.toLowerCase();
      const hasTemporalNaming = ['date', 'time', 'created', 'updated', 'timestamp'].some(term => lowerCol.includes(term));
      
      if (hasTemporalNaming) return true;
      
      // Check if values are parseable as dates
      const sample = rows.slice(0, 10).map(row => row[col]).filter(val => val != null);
      return sample.length > 0 && sample.every(val => !isNaN(Date.parse(val)));
    });
  }

  private static getNumericColumns(rows: any[], columns: string[]): string[] {
    return columns.filter(col => {
      const sample = rows.slice(0, 10).map(row => row[col]).filter(val => val != null);
      return sample.length > 0 && sample.every(val => !isNaN(Number(val)));
    });
  }

  private static analyzeDistributions(rows: any[], columns: string[]): string[] {
    const patterns: string[] = [];
    const numericColumns = this.getNumericColumns(rows, columns);
    
    numericColumns.forEach(col => {
      const values = rows.map(row => Number(row[col])).filter(val => !isNaN(val));
      if (values.length < 5) return;
      
      const sorted = [...values].sort((a, b) => a - b);
      const q1 = sorted[Math.floor(sorted.length * 0.25)];
      const q3 = sorted[Math.floor(sorted.length * 0.75)];
      const iqr = q3 - q1;
      
      // Detect outliers
      const outliers = values.filter(val => val < q1 - 1.5 * iqr || val > q3 + 1.5 * iqr);
      if (outliers.length > 0) {
        patterns.push(`Potential outliers detected in ${col}: ${outliers.length} values`);
      }
      
      // Check for skewness
      const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
      const median = sorted[Math.floor(sorted.length / 2)];
      const skewRatio = Math.abs(mean - median) / (sorted[sorted.length - 1] - sorted[0]);
      
      if (skewRatio > 0.1) {
        patterns.push(`${col} shows ${mean > median ? 'right' : 'left'}-skewed distribution`);
      }
    });
    
    return patterns;
  }

  private static assessDataQuality(rows: any[], columns: string[]): DataInsights['dataQuality'] {
    const totalCells = rows.length * columns.length;
    if (totalCells === 0) {
      return { completeness: 0, consistency: 0, uniqueness: 0, validity: 0 };
    }
    
    // Completeness: percentage of non-null values
    const nonNullCells = rows.reduce((count, row) => {
      return count + columns.filter(col => row[col] != null && row[col] !== '').length;
    }, 0);
    const completeness = nonNullCells / totalCells;
    
    // Consistency: check for consistent data types within columns
    let consistentColumns = 0;
    columns.forEach(col => {
      const values = rows.map(row => row[col]).filter(val => val != null);
      if (values.length === 0) return;
      
      const types = new Set(values.map(val => typeof val));
      if (types.size === 1) consistentColumns++;
    });
    const consistency = columns.length > 0 ? consistentColumns / columns.length : 0;
    
    // Uniqueness: average uniqueness across all columns
    const uniquenessScores = columns.map(col => {
      const values = rows.map(row => row[col]).filter(val => val != null);
      if (values.length === 0) return 0;
      return new Set(values).size / values.length;
    });
    const uniqueness = uniquenessScores.length > 0 
      ? uniquenessScores.reduce((sum, score) => sum + score, 0) / uniquenessScores.length 
      : 0;
    
    // Validity: percentage of values that seem valid for their inferred type
    let validCells = 0;
    const columnTypes = this.inferColumnTypes(rows, columns);
    
    rows.forEach(row => {
      columns.forEach((col, index) => {
        const value = row[col];
        if (value == null || value === '') {
          validCells++; // null/empty is considered valid
          return;
        }
        
        const expectedType = columnTypes[index];
        const isValid = this.isValidForType(value, expectedType);
        if (isValid) validCells++;
      });
    });
    const validity = validCells / totalCells;
    
    return {
      completeness: Math.round(completeness * 100) / 100,
      consistency: Math.round(consistency * 100) / 100,
      uniqueness: Math.round(uniqueness * 100) / 100,
      validity: Math.round(validity * 100) / 100
    };
  }

  private static isValidForType(value: any, expectedType: string): boolean {
    switch (expectedType) {
      case 'integer':
      case 'decimal':
        return !isNaN(Number(value));
      case 'date':
        return !isNaN(Date.parse(value));
      case 'boolean':
        return ['true', 'false', '1', '0', 'yes', 'no', true, false].includes(String(value).toLowerCase());
      case 'text':
      case 'categorical':
      default:
        return true; // Text can be anything
    }
  }
}