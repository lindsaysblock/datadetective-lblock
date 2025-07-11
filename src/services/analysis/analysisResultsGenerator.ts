
import { DataAnalysisContext } from '@/types/data';
import { AnalysisResult } from '@/types/analysis';
import { ParsedData } from '@/utils/dataParser';
import { DataTypeAnalyzer } from './dataTypeAnalyzer';
import { StatisticalAnalyzer } from './statisticalAnalyzer';

export class AnalysisResultsGenerator {
  async generateResults(context: DataAnalysisContext, data: ParsedData, insights: string[]): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];
    
    try {
      console.log('📈 Generating analysis results from actual data');
      
      // Dataset overview result
      results.push(this.createDatasetOverview(data));
      
      // Analyze column types
      const columnTypes = DataTypeAnalyzer.analyzeColumns(data);
      
      // Generate numerical analysis results
      results.push(...this.generateNumericalResults(data, columnTypes.numericalColumns));
      
      // Generate categorical analysis results
      results.push(...this.generateCategoricalResults(data, columnTypes.categoricalColumns));
      
      // Generate temporal analysis results
      results.push(...this.generateTemporalResults(data, columnTypes.temporalColumns));
      
      // Data quality analysis
      results.push(this.generateDataQualityResult(data));
      
      // Research-specific results
      results.push(...this.generateResearchSpecificResults(context, data, columnTypes));
      
    } catch (error) {
      console.warn('Error generating results:', error);
      results.push(this.createFallbackResult(data));
    }
    
    console.log('📈 Generated analysis results:', results.length, 'results');
    return results;
  }

  private createDatasetOverview(data: ParsedData): AnalysisResult {
    return {
      id: 'dataset-overview',
      title: 'Dataset Overview',
      description: 'Comprehensive analysis of your uploaded dataset',
      confidence: 'high',
      timestamp: new Date().toISOString(),
      type: 'summary',
      value: `Dataset contains ${data.rowCount.toLocaleString()} records across ${data.columns.length} fields`
    };
  }

  private generateNumericalResults(data: ParsedData, numericalColumns: any[]): AnalysisResult[] {
    const results: AnalysisResult[] = [];
    
    for (const col of numericalColumns.slice(0, 3)) {
      const stats = StatisticalAnalyzer.calculateNumericalStatistics(data.rows, col.name);
      
      if (stats && stats.count > 0) {
        results.push({
          id: `numerical_analysis_${col.name}`,
          title: `${col.name} Statistical Analysis`,
          description: `Statistical analysis of the ${col.name} column`,
          confidence: stats.count > 10 ? 'high' : 'medium',
          timestamp: new Date().toISOString(),
          type: 'numeric',
          value: stats.average,
          unit: 'units',
          trend: this.determineTrend(stats)
        });
      }
    }
    
    return results;
  }

  private generateCategoricalResults(data: ParsedData, categoricalColumns: any[]): AnalysisResult[] {
    const results: AnalysisResult[] = [];
    
    for (const col of categoricalColumns.slice(0, 2)) {
      const distribution = StatisticalAnalyzer.analyzeCategoricalDistribution(data.rows, col.name);
      
      if (distribution && distribution.uniqueCategories > 1) {
        results.push({
          id: `categorical_analysis_${col.name}`,
          title: `${col.name} Category Distribution`,
          description: `Categorical breakdown of ${col.name}`,
          confidence: distribution.totalRecords > 5 ? 'high' : 'medium',
          timestamp: new Date().toISOString(),
          type: 'categorical',
          value: distribution.topCategory,
          categories: this.buildCategoryDistribution(data.rows, col.name, distribution)
        });
      }
    }
    
    return results;
  }

  private generateTemporalResults(data: ParsedData, temporalColumns: any[]): AnalysisResult[] {
    const results: AnalysisResult[] = [];
    
    for (const col of temporalColumns.slice(0, 1)) {
      const timeAnalysis = StatisticalAnalyzer.analyzeTemporalDistribution(data.rows, col.name);
      
      if (timeAnalysis) {
        results.push({
          id: `temporal_analysis_${col.name}`,
          title: `${col.name} Time Distribution`,
          description: `Temporal distribution analysis of ${col.name} column`,
          confidence: timeAnalysis.validDateCount > 5 ? 'high' : 'medium',
          timestamp: new Date().toISOString(),
          type: 'distribution',
          value: `Time span: ${timeAnalysis.earliestDate} to ${timeAnalysis.latestDate}`
        });
      }
    }
    
    return results;
  }

  private generateDataQualityResult(data: ParsedData): AnalysisResult {
    const qualityMetrics = this.calculateDataQuality(data);
    
    return {
      id: 'data_quality_assessment',
      title: 'Data Quality Assessment',
      description: 'Data quality metrics for your dataset',
      confidence: 'high',
      timestamp: new Date().toISOString(),
      type: 'summary',
      value: `Data is ${qualityMetrics.completeness.toFixed(1)}% complete with ${qualityMetrics.duplicates} potential duplicates`
    };
  }

  private generateResearchSpecificResults(context: DataAnalysisContext, data: ParsedData, columnTypes: any): AnalysisResult[] {
    const results: AnalysisResult[] = [];
    const questionLower = context.researchQuestion.toLowerCase();
    
    if (questionLower.includes('correlation') || questionLower.includes('relationship')) {
      const numericalColumns = columnTypes.numericalColumns;
      if (numericalColumns.length >= 2) {
        const correlation = StatisticalAnalyzer.calculateCorrelation(
          data.rows, 
          numericalColumns[0].name, 
          numericalColumns[1].name
        );
        
        if (correlation !== null) {
          const strength = Math.abs(correlation) > 0.7 ? 'Strong' : Math.abs(correlation) > 0.3 ? 'Moderate' : 'Weak';
          const direction = correlation > 0 ? 'positive' : 'negative';
          
          results.push({
            id: 'correlation_analysis',
            title: `Statistical Relationship: ${numericalColumns[0].name} vs ${numericalColumns[1].name}`,
            description: 'Statistical correlation analysis between key variables',
            confidence: 'high',
            timestamp: new Date().toISOString(),
            type: 'statistical',
            value: `${strength} ${direction} relationship detected (correlation: ${correlation.toFixed(3)})`
          });
        }
      }
    }
    
    return results;
  }

  private determineTrend(stats: any): 'up' | 'down' | 'stable' {
    // Simple heuristic based on standard deviation
    if (stats.standardDeviation / stats.average > 0.5) {
      return stats.average > (stats.minimum + stats.maximum) / 2 ? 'up' : 'down';
    }
    return 'stable';
  }

  private buildCategoryDistribution(rows: any[], columnName: string, distribution: any): Array<{ name: string; count: number; percentage: number }> {
    const values = rows
      .map(row => row[columnName])
      .filter(val => val !== null && val !== undefined && val !== '');

    const categoryMap = new Map<string, number>();
    values.forEach(val => {
      const key = String(val);
      categoryMap.set(key, (categoryMap.get(key) || 0) + 1);
    });

    return Array.from(categoryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / values.length) * 100)
      }));
  }

  private calculateDataQuality(data: ParsedData): { completeness: number; duplicates: number } {
    const totalCells = data.rows.length * data.columns.length;
    let filledCells = 0;
    let duplicateRows = 0;
    
    // Calculate completeness
    data.rows.forEach(row => {
      data.columns.forEach(col => {
        const value = row[col.name];
        if (value !== null && value !== undefined && value !== '') {
          filledCells++;
        }
      });
    });
    
    // Check for duplicate rows
    const rowHashes = new Set();
    data.rows.forEach(row => {
      const firstCols = data.columns.slice(0, 3).map(col => row[col.name]).join('|');
      if (rowHashes.has(firstCols)) {
        duplicateRows++;
      } else {
        rowHashes.add(firstCols);
      }
    });
    
    return {
      completeness: (filledCells / totalCells) * 100,
      duplicates: duplicateRows
    };
  }

  private createFallbackResult(data: ParsedData): AnalysisResult {
    return {
      id: 'basic-analysis',
      title: 'Basic Data Summary',
      description: 'Basic information extracted from your dataset',
      confidence: 'medium',
      timestamp: new Date().toISOString(),
      type: 'summary',
      value: `${data.rowCount} rows processed successfully`
    };
  }
}
