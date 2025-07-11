
import { DataAnalysisContext } from '@/types/data';
import { AnalysisResult } from '@/utils/analysis/types';
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
      value: `${data.rowCount.toLocaleString()} rows × ${data.columns.length} columns`,
      insight: `Dataset contains ${data.rowCount.toLocaleString()} records across ${data.columns.length} fields`,
      confidence: 'high',
      type: 'summary',
      timestamp: new Date().toISOString()
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
          value: `Average: ${stats.average.toFixed(2)}, Range: ${stats.minimum} to ${stats.maximum}`,
          insight: `${col.name} has an average of ${stats.average.toFixed(2)} with standard deviation of ${stats.standardDeviation.toFixed(2)}`,
          confidence: stats.count > 10 ? 'high' : 'medium',
          type: 'statistical',
          timestamp: new Date().toISOString()
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
          value: `${distribution.uniqueCategories} unique categories, top: ${distribution.topCategory}`,
          insight: `${col.name} has ${distribution.uniqueCategories} unique categories with ${distribution.topCategory} being most common`,
          confidence: distribution.totalRecords > 5 ? 'high' : 'medium',
          type: 'categorical',
          timestamp: new Date().toISOString()
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
          value: `Time span: ${timeAnalysis.earliestDate} to ${timeAnalysis.latestDate}`,
          insight: `${col.name} spans ${timeAnalysis.timeSpan} with ${timeAnalysis.validDateCount} valid dates`,
          confidence: timeAnalysis.validDateCount > 5 ? 'high' : 'medium',
          type: 'distribution',
          timestamp: new Date().toISOString()
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
      value: `Completeness: ${qualityMetrics.completeness.toFixed(1)}%`,
      insight: `Data is ${qualityMetrics.completeness.toFixed(1)}% complete with ${qualityMetrics.duplicates} potential duplicates`,
      confidence: 'high',
      type: 'summary',
      timestamp: new Date().toISOString()
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
            value: `Correlation: ${correlation.toFixed(3)} (${strength} ${direction})`,
            insight: `${strength} ${direction} relationship detected between ${numericalColumns[0].name} and ${numericalColumns[1].name}`,
            confidence: 'high',
            type: 'statistical',
            timestamp: new Date().toISOString()
          });
        }
      }
    }
    
    return results;
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
      value: `${data.rowCount} rows processed successfully`,
      insight: 'Dataset structure has been analyzed and is ready for further exploration',
      confidence: 'medium',
      type: 'summary',
      timestamp: new Date().toISOString()
    };
  }
}
