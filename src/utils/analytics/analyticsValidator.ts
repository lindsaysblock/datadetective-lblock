
import { ParsedData } from '../dataParser';
import { AnalysisResult } from '../analysis/types';

export class AnalyticsValidator {
  static validateParsedData(data: ParsedData): boolean {
    if (!data || !data.rows || !data.columns) {
      return false;
    }
    
    return data.rows.length > 0 && data.columns.length > 0;
  }

  static validateAnalysisResult(result: AnalysisResult): boolean {
    const requiredFields = ['id', 'title', 'description', 'insight', 'confidence'];
    const hasRequiredFields = requiredFields.every(field => result[field as keyof AnalysisResult]);
    const hasValidConfidence = ['high', 'medium', 'low'].includes(result.confidence);
    
    return hasRequiredFields && hasValidConfidence;
  }

  static sanitizeResults(results: AnalysisResult[]): AnalysisResult[] {
    return results.filter(result => this.validateAnalysisResult(result));
  }

  static calculateDataQuality(data: ParsedData): 'high' | 'medium' | 'low' {
    if (!this.validateParsedData(data)) return 'low';
    
    const totalCells = data.rows.length * data.columns.length;
    let emptyCells = 0;

    data.rows.forEach(row => {
      data.columns.forEach(col => {
        const value = row[col.name];
        if (value === null || value === undefined || value === '') {
          emptyCells++;
        }
      });
    });

    const completeness = ((totalCells - emptyCells) / totalCells) * 100;
    
    if (completeness >= 80) return 'high';
    if (completeness >= 60) return 'medium';
    return 'low';
  }
}
