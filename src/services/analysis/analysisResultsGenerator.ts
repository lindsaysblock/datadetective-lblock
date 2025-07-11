
import { DataAnalysisContext } from '@/types/data';
import { AnalysisResult } from '@/types/analysis';
import { ParsedData } from '@/utils/dataParser';

export class AnalysisResultsGenerator {
  async generateResults(context: DataAnalysisContext, data: ParsedData, insights: string[]): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];
    
    try {
      // Data overview result
      results.push({
        id: 'data-overview',
        title: 'Dataset Overview',
        description: `Comprehensive analysis of your uploaded data`,
        value: `${data.rowCount} rows × ${data.columns.length} columns`,
        confidence: 'high',
        type: 'summary',
        timestamp: new Date().toISOString()
      });
      
      // Analyze actual numerical columns
      const numericalColumns = this.identifyNumericalColumns(data);
      
      // Generate statistics for top numerical columns
      numericalColumns.slice(0, 3).forEach(col => {
        const values = data.rows.map(row => Number(row[col.name])).filter(val => !isNaN(val) && isFinite(val));
        
        if (values.length > 0) {
          const stats = this.calculateStatistics(values);
          
          results.push({
            id: `stats_${col.name}`,
            title: `${col.name} Analysis`,
            description: `Statistical analysis of the ${col.name} column`,
            value: `Avg: ${stats.avg.toFixed(2)} ± ${stats.stdDev.toFixed(2)}`,
            confidence: 'high',
            type: 'statistical',
            timestamp: new Date().toISOString()
          });
        }
      });
      
      // Generate categorical analysis for text columns
      const textColumns = this.identifyTextColumns(data);
      
      textColumns.slice(0, 2).forEach(col => {
        const values = data.rows.map(row => row[col.name]).filter(val => val != null && val !== '');
        const uniqueValues = [...new Set(values)];
        
        results.push({
          id: `categorical_${col.name}`,
          title: `${col.name} Categories`,
          description: `Categorical breakdown of ${col.name}`,
          value: `${uniqueValues.length} unique values in ${values.length} records`,
          confidence: 'medium',
          type: 'categorical',
          timestamp: new Date().toISOString()
        });
      });
      
    } catch (error) {
      console.warn('Error generating real results:', error);
      results.push({
        id: 'basic-summary',
        title: 'Basic Summary',
        description: 'Basic information about your dataset',
        value: `${data.rowCount} rows processed`,
        confidence: 'medium',
        type: 'summary',
        timestamp: new Date().toISOString()
      });
    }
    
    return results;
  }

  private identifyNumericalColumns(data: ParsedData) {
    return data.columns.filter(col => {
      const sampleValues = data.rows.slice(0, 10).map(row => row[col.name]).filter(val => val != null && val !== '');
      const numericCount = sampleValues.filter(val => !isNaN(Number(val)) && isFinite(Number(val))).length;
      return numericCount / Math.max(sampleValues.length, 1) > 0.7;
    });
  }

  private identifyTextColumns(data: ParsedData) {
    return data.columns.filter(col => {
      const sampleValues = data.rows.slice(0, 10).map(row => row[col.name]).filter(val => val != null && val !== '');
      const numericCount = sampleValues.filter(val => !isNaN(Number(val))).length;
      return numericCount / Math.max(sampleValues.length, 1) < 0.3;
    });
  }

  private calculateStatistics(values: number[]) {
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    return { avg, stdDev, min, max, variance };
  }
}
