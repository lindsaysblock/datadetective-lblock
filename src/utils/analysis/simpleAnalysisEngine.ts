
import { ParsedData } from '../dataParser';
import { AnalysisResult } from './types';

export class SimpleAnalysisEngine {
  static analyzeRowCount(data: ParsedData): AnalysisResult[] {
    console.log('🚀 Running simple row count analysis');
    
    const results: AnalysisResult[] = [];
    
    // Basic row count
    results.push({
      id: 'total-rows',
      title: 'Total Rows',
      description: 'Total number of rows in your dataset',
      value: data.rowCount,
      insight: `Your CSV file contains ${data.rowCount.toLocaleString()} rows of data`,
      confidence: 'high'
    });
    
    // Column count
    results.push({
      id: 'total-columns',
      title: 'Total Columns',
      description: 'Number of columns in your dataset',
      value: data.columns.length,
      insight: `Dataset has ${data.columns.length} columns: ${data.columns.slice(0, 3).map(c => c.name).join(', ')}${data.columns.length > 3 ? '...' : ''}`,
      confidence: 'high'
    });
    
    // Data completeness
    const totalCells = data.rowCount * data.columns.length;
    let filledCells = 0;
    
    // Sample first 100 rows for quick analysis
    const sampleSize = Math.min(100, data.rows.length);
    const sampleRows = data.rows.slice(0, sampleSize);
    
    sampleRows.forEach(row => {
      data.columns.forEach(col => {
        const value = row[col.name];
        if (value !== null && value !== undefined && value !== '') {
          filledCells++;
        }
      });
    });
    
    const completeness = sampleSize > 0 ? (filledCells / (sampleSize * data.columns.length)) * 100 : 0;
    
    results.push({
      id: 'data-completeness',
      title: 'Data Quality',
      description: 'Percentage of non-empty cells',
      value: Math.round(completeness),
      insight: `Data is ${completeness.toFixed(1)}% complete with minimal missing values`,
      confidence: 'high'
    });
    
    console.log('✅ Simple analysis completed with', results.length, 'results');
    return results;
  }
  
  static isSimpleQuestion(question: string): boolean {
    const simplePatterns = [
      /how many rows/i,
      /number of rows/i,
      /row count/i,
      /total rows/i,
      /size of/i,
      /how much data/i,
      /count.*rows/i
    ];
    
    return simplePatterns.some(pattern => pattern.test(question));
  }
}
