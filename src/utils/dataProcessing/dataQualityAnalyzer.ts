
export interface DataQualityReport {
  completeness: number;
  consistency: number;
  accuracy: number;
  duplicates: number;
  outliers: string[];
  recommendations: string[];
}

export interface ColumnProfile {
  name: string;
  type: 'numeric' | 'categorical' | 'datetime' | 'text' | 'boolean';
  nullCount: number;
  uniqueCount: number;
  duplicateCount: number;
  sampleValues: any[];
  statistics?: {
    min?: number;
    max?: number;
    mean?: number;
    median?: number;
    standardDeviation?: number;
  };
}

export class DataQualityAnalyzer {
  private data: any[];
  private columns: string[];

  constructor(data: any[]) {
    this.data = data;
    this.columns = data.length > 0 ? Object.keys(data[0]) : [];
  }

  analyzeDataQuality(): DataQualityReport {
    const completeness = this.calculateCompleteness();
    const consistency = this.calculateConsistency();
    const accuracy = this.calculateAccuracy();
    const duplicates = this.findDuplicates();
    const outliers = this.detectOutliers();
    const recommendations = this.generateRecommendations(completeness, consistency, accuracy, duplicates, outliers);

    return {
      completeness,
      consistency,
      accuracy,
      duplicates,
      outliers,
      recommendations
    };
  }

  profileColumns(): ColumnProfile[] {
    return this.columns.map(columnName => this.profileColumn(columnName));
  }

  private profileColumn(columnName: string): ColumnProfile {
    const values = this.data.map(row => row[columnName]).filter(val => val !== null && val !== undefined);
    const nullCount = this.data.length - values.length;
    const uniqueValues = [...new Set(values)];
    const uniqueCount = uniqueValues.length;
    const duplicateCount = values.length - uniqueCount;
    
    const type = this.inferColumnType(values);
    const sampleValues = uniqueValues.slice(0, 10);

    const profile: ColumnProfile = {
      name: columnName,
      type,
      nullCount,
      uniqueCount,
      duplicateCount,
      sampleValues
    };

    if (type === 'numeric') {
      profile.statistics = this.calculateNumericStatistics(values);
    }

    return profile;
  }

  private inferColumnType(values: any[]): ColumnProfile['type'] {
    if (values.length === 0) return 'text';

    const numericCount = values.filter(val => !isNaN(Number(val))).length;
    const dateCount = values.filter(val => !isNaN(Date.parse(val))).length;
    const booleanCount = values.filter(val => typeof val === 'boolean' || val === 'true' || val === 'false').length;

    const total = values.length;
    const numericRatio = numericCount / total;
    const dateRatio = dateCount / total;
    const booleanRatio = booleanCount / total;

    if (booleanRatio > 0.8) return 'boolean';
    if (numericRatio > 0.8) return 'numeric';
    if (dateRatio > 0.8) return 'datetime';
    
    const uniqueRatio = new Set(values).size / total;
    if (uniqueRatio < 0.3) return 'categorical';
    
    return 'text';
  }

  private calculateNumericStatistics(values: any[]) {
    const numbers = values.map(Number).filter(n => !isNaN(n));
    if (numbers.length === 0) return undefined;

    const sorted = numbers.sort((a, b) => a - b);
    const sum = numbers.reduce((acc, val) => acc + val, 0);
    const mean = sum / numbers.length;
    const median = sorted[Math.floor(sorted.length / 2)];
    const variance = numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numbers.length;
    const standardDeviation = Math.sqrt(variance);

    return {
      min: Math.min(...numbers),
      max: Math.max(...numbers),
      mean,
      median,
      standardDeviation
    };
  }

  private calculateCompleteness(): number {
    if (this.data.length === 0) return 0;

    const totalCells = this.data.length * this.columns.length;
    const nonNullCells = this.data.reduce((count, row) => {
      return count + this.columns.filter(col => row[col] !== null && row[col] !== undefined && row[col] !== '').length;
    }, 0);

    return (nonNullCells / totalCells) * 100;
  }

  private calculateConsistency(): number {
    // Simplified consistency check - in practice, this would be more sophisticated
    const typeConsistency = this.columns.map(col => {
      const values = this.data.map(row => row[col]).filter(val => val !== null && val !== undefined);
      const types = [...new Set(values.map(val => typeof val))];
      return types.length === 1 ? 1 : 0;
    });

    return (typeConsistency.reduce((sum, score) => sum + score, 0) / this.columns.length) * 100;
  }

  private calculateAccuracy(): number {
    // Simplified accuracy metric - would need domain-specific rules
    return 90; // Placeholder
  }

  private findDuplicates(): number {
    const uniqueRows = new Set(this.data.map(row => JSON.stringify(row)));
    return this.data.length - uniqueRows.size;
  }

  private detectOutliers(): string[] {
    const outliers: string[] = [];
    
    this.columns.forEach(col => {
      const values = this.data.map(row => row[col]).filter(val => !isNaN(Number(val))).map(Number);
      if (values.length < 4) return;

      const sorted = values.sort((a, b) => a - b);
      const q1 = sorted[Math.floor(sorted.length * 0.25)];
      const q3 = sorted[Math.floor(sorted.length * 0.75)];
      const iqr = q3 - q1;
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;

      const columnOutliers = values.filter(val => val < lowerBound || val > upperBound);
      if (columnOutliers.length > 0) {
        outliers.push(`${col}: ${columnOutliers.length} outliers detected`);
      }
    });

    return outliers;
  }

  private generateRecommendations(completeness: number, consistency: number, accuracy: number, duplicates: number, outliers: string[]): string[] {
    const recommendations: string[] = [];

    if (completeness < 90) {
      recommendations.push('Consider data imputation techniques for missing values');
    }

    if (consistency < 95) {
      recommendations.push('Review data types and standardize format consistency');
    }

    if (duplicates > 0) {
      recommendations.push(`Remove ${duplicates} duplicate records to improve data quality`);
    }

    if (outliers.length > 0) {
      recommendations.push('Investigate outliers - they may indicate data quality issues or interesting patterns');
    }

    if (recommendations.length === 0) {
      recommendations.push('Data quality looks good! Consider advanced analytics or visualization.');
    }

    return recommendations;
  }
}
