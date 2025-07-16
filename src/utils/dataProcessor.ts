
/**
 * Data Processor Utility Class
 * Refactored to meet coding standards with proper constants and error handling
 */

import { ParsedDataFile, ParsedDataRow } from '@/types/data';

export class DataProcessor {
  private static readonly SAMPLE_SIZE_LIMIT = 100;
  private static readonly MIN_SAMPLE_SIZE = 5;
  static extractAnalysisData(parsedData: ParsedDataFile[]): {
    allRows: ParsedDataRow[];
    allColumns: string[];
    totalRows: number;
    fileCount: number;
  } {
    console.log('📊 Extracting analysis data from:', parsedData?.length || 0, 'files');
    
    if (!parsedData || !Array.isArray(parsedData) || parsedData.length === 0) {
      console.log('⚠️ No valid parsed data provided');
      return {
        allRows: [],
        allColumns: [],
        totalRows: 0,
        fileCount: 0
      };
    }

    let allRows: ParsedDataRow[] = [];
    const columnSet = new Set<string>();
    let totalRows = 0;

    for (const file of parsedData) {
      if (file && typeof file === 'object') {
        // Extract rows from different possible structures
        let fileRows: ParsedDataRow[] = [];
        
        if (file.rows && Array.isArray(file.rows)) {
          fileRows = file.rows;
        } else if (file.data && Array.isArray(file.data)) {
          fileRows = file.data;
        }

        if (fileRows.length > 0) {
          allRows = allRows.concat(fileRows);
          totalRows += fileRows.length;
          
          // Extract column names
          if (file.columns && Array.isArray(file.columns)) {
            file.columns.forEach(col => columnSet.add(col));
          } else if (fileRows.length > 0) {
            Object.keys(fileRows[0]).forEach(col => columnSet.add(col));
          }
        }
      }
    }

    const result = {
      allRows,
      allColumns: Array.from(columnSet),
      totalRows,
      fileCount: parsedData.length
    };

    console.log('✅ Data extraction complete:', {
      totalRows: result.totalRows,
      uniqueColumns: result.allColumns.length,
      files: result.fileCount
    });

    return result;
  }

  static analyzeDataStructure(rows: ParsedDataRow[], columns: string[]) {
    if (rows.length === 0) return null;

    const structure = {
      sampleSize: Math.min(rows.length, DataProcessor.SAMPLE_SIZE_LIMIT),
      columnTypes: {} as Record<string, string>,
      nullCounts: {} as Record<string, number>,
      uniqueValues: {} as Record<string, number>
    };

    // Analyze each column
    columns.forEach(column => {
      const values = rows.slice(0, structure.sampleSize).map(row => row[column]);
      const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
      
      structure.nullCounts[column] = structure.sampleSize - nonNullValues.length;
      structure.uniqueValues[column] = new Set(nonNullValues).size;
      
      // Infer column type
      if (nonNullValues.length > 0) {
        const firstValue = nonNullValues[0];
        if (typeof firstValue === 'number' || !isNaN(Number(firstValue))) {
          structure.columnTypes[column] = 'number';
        } else if (typeof firstValue === 'boolean') {
          structure.columnTypes[column] = 'boolean';
        } else if (this.isDateString(String(firstValue))) {
          structure.columnTypes[column] = 'date';
        } else {
          structure.columnTypes[column] = 'string';
        }
      } else {
        structure.columnTypes[column] = 'unknown';
      }
    });

    return structure;
  }

  private static isDateString(value: string): boolean {
    const datePatterns = [
      /^\d{4}-\d{2}-\d{2}/,
      /^\d{2}\/\d{2}\/\d{4}/,
      /^\d{4}\/\d{2}\/\d{2}/,
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
    ];
    
    return datePatterns.some(pattern => pattern.test(value)) && !isNaN(Date.parse(value));
  }
}
