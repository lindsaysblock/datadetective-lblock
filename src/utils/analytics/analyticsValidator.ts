
import { ParsedData } from '../dataParser';
import { AnalysisResult } from '../analysis/types';

export class AnalyticsValidator {
  static validateParsedData(data: ParsedData): boolean {
    if (!data) {
      console.warn('No data provided for validation');
      return false;
    }

    if (!data.rows || !Array.isArray(data.rows)) {
      console.warn('Invalid or missing rows in data');
      return false;
    }

    if (!data.columns || !Array.isArray(data.columns)) {
      console.warn('Invalid or missing columns in data');
      return false;
    }

    if (data.rows.length === 0) {
      console.warn('No data rows found');
      return false;
    }

    if (data.columns.length === 0) {
      console.warn('No columns found');
      return false;
    }

    // Validate data consistency
    const expectedColumns = data.columns.map(col => col.name);
    const sampleRow = data.rows[0];
    const actualColumns = Object.keys(sampleRow);

    const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));
    if (missingColumns.length > 0) {
      console.warn('Missing columns in data:', missingColumns);
      return false;
    }

    return true;
  }

  static calculateDataQuality(data: ParsedData): 'high' | 'medium' | 'low' {
    if (!this.validateParsedData(data)) {
      return 'low';
    }

    const rowCount = data.rows.length;
    const columnCount = data.columns.length;
    
    // Calculate completeness
    let totalCells = 0;
    let filledCells = 0;
    
    data.rows.forEach(row => {
      data.columns.forEach(column => {
        totalCells++;
        const value = row[column.name];
        if (value !== null && value !== undefined && value !== '') {
          filledCells++;
        }
      });
    });
    
    const completeness = totalCells > 0 ? filledCells / totalCells : 0;
    
    // Calculate quality score
    let qualityScore = 0;
    
    // Row count factor
    if (rowCount >= 1000) qualityScore += 0.3;
    else if (rowCount >= 100) qualityScore += 0.2;
    else if (rowCount >= 10) qualityScore += 0.1;
    
    // Column count factor
    if (columnCount >= 5) qualityScore += 0.2;
    else if (columnCount >= 3) qualityScore += 0.1;
    
    // Completeness factor
    qualityScore += completeness * 0.5;
    
    // Determine quality level
    if (qualityScore >= 0.8) return 'high';
    if (qualityScore >= 0.5) return 'medium';
    return 'low';
  }

  static sanitizeResults(results: AnalysisResult[]): AnalysisResult[] {
    return results.filter(result => {
      // Check required fields
      if (!result.id || !result.title || !result.description) {
        console.warn('Removing result with missing required fields:', result);
        return false;
      }

      // Validate confidence level
      if (!['high', 'medium', 'low'].includes(result.confidence)) {
        console.warn('Removing result with invalid confidence level:', result);
        return false;
      }

      // Validate insight exists
      if (!result.insight || typeof result.insight !== 'string') {
        console.warn('Removing result with missing or invalid insight:', result);
        return false;
      }

      return true;
    });
  }

  static validateAnalysisResult(result: AnalysisResult): boolean {
    const requiredFields = ['id', 'title', 'description', 'value', 'insight', 'confidence'];
    
    for (const field of requiredFields) {
      if (!(field in result)) {
        console.warn(`Missing required field: ${field}`);
        return false;
      }
    }

    if (!['high', 'medium', 'low'].includes(result.confidence)) {
      console.warn('Invalid confidence level:', result.confidence);
      return false;
    }

    if (typeof result.insight !== 'string' || result.insight.length === 0) {
      console.warn('Invalid insight:', result.insight);
      return false;
    }

    return true;
  }

  static optimizeResults(results: AnalysisResult[]): AnalysisResult[] {
    // Remove duplicates
    const uniqueResults = results.filter((result, index, self) => 
      index === self.findIndex(r => r.id === result.id)
    );

    // Sort by confidence and relevance
    const sortedResults = uniqueResults.sort((a, b) => {
      const confidenceOrder = { high: 3, medium: 2, low: 1 };
      const aScore = confidenceOrder[a.confidence] || 0;
      const bScore = confidenceOrder[b.confidence] || 0;
      
      if (aScore !== bScore) return bScore - aScore;
      
      // Secondary sort by insight length (more detailed insights first)
      return b.insight.length - a.insight.length;
    });

    return sortedResults;
  }
}
