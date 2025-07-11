
import { ParsedData } from '@/utils/dataParser';

export interface ColumnTypeInfo {
  name: string;
  type: 'numerical' | 'categorical' | 'temporal' | 'boolean';
  confidence: number;
  sampleValues: any[];
}

export class DataTypeAnalyzer {
  static analyzeColumns(data: ParsedData): {
    numericalColumns: ColumnTypeInfo[];
    categoricalColumns: ColumnTypeInfo[];
    temporalColumns: ColumnTypeInfo[];
    booleanColumns: ColumnTypeInfo[];
  } {
    const numericalColumns: ColumnTypeInfo[] = [];
    const categoricalColumns: ColumnTypeInfo[] = [];
    const temporalColumns: ColumnTypeInfo[] = [];
    const booleanColumns: ColumnTypeInfo[] = [];

    data.columns.forEach(col => {
      const sampleValues = data.rows
        .slice(0, 20)
        .map(row => row[col.name])
        .filter(val => val !== null && val !== undefined && val !== '');

      if (sampleValues.length === 0) return;

      const typeInfo = this.inferColumnType(col.name, sampleValues);
      
      switch (typeInfo.type) {
        case 'numerical':
          numericalColumns.push(typeInfo);
          break;
        case 'categorical':
          categoricalColumns.push(typeInfo);
          break;
        case 'temporal':
          temporalColumns.push(typeInfo);
          break;
        case 'boolean':
          booleanColumns.push(typeInfo);
          break;
      }
    });

    return { numericalColumns, categoricalColumns, temporalColumns, booleanColumns };
  }

  private static inferColumnType(columnName: string, sampleValues: any[]): ColumnTypeInfo {
    const numericCount = sampleValues.filter(val => {
      const num = Number(val);
      return !isNaN(num) && isFinite(num);
    }).length;

    const dateCount = sampleValues.filter(val => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date.getFullYear() > 1900;
    }).length;

    const booleanCount = sampleValues.filter(val => {
      const str = String(val).toLowerCase();
      return ['true', 'false', '1', '0', 'yes', 'no'].includes(str);
    }).length;

    const totalSamples = sampleValues.length;
    const numericRatio = numericCount / totalSamples;
    const dateRatio = dateCount / totalSamples;
    const booleanRatio = booleanCount / totalSamples;

    if (numericRatio > 0.8) {
      return {
        name: columnName,
        type: 'numerical',
        confidence: numericRatio,
        sampleValues: sampleValues.slice(0, 5)
      };
    }

    if (dateRatio > 0.7 || /date|time|timestamp|created|updated/i.test(columnName)) {
      return {
        name: columnName,
        type: 'temporal',
        confidence: Math.max(dateRatio, 0.7),
        sampleValues: sampleValues.slice(0, 5)
      };
    }

    if (booleanRatio > 0.8) {
      return {
        name: columnName,
        type: 'boolean',
        confidence: booleanRatio,
        sampleValues: sampleValues.slice(0, 5)
      };
    }

    return {
      name: columnName,
      type: 'categorical',
      confidence: 1 - Math.max(numericRatio, dateRatio, booleanRatio),
      sampleValues: sampleValues.slice(0, 5)
    };
  }
}
