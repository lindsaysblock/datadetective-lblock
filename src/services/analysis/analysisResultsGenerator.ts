
import { DataAnalysisContext } from '@/types/data';
import { AnalysisResult } from '@/types/analysis';
import { ParsedData } from '@/utils/dataParser';

export class AnalysisResultsGenerator {
  async generateResults(context: DataAnalysisContext, data: ParsedData, insights: string[]): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];
    
    try {
      console.log('📈 Generating REAL analysis results from actual data');
      
      // Dataset overview result with real numbers
      results.push({
        id: 'dataset-overview',
        title: 'Dataset Overview',
        description: `Comprehensive analysis of your uploaded dataset`,
        value: `${data.rowCount.toLocaleString()} rows × ${data.columns.length} columns`,
        confidence: 'high',
        type: 'summary',
        timestamp: new Date().toISOString()
      });
      
      // Analyze REAL numerical columns
      const numericalColumns = this.identifyNumericalColumns(data);
      console.log('🔢 Found numerical columns:', numericalColumns.length);
      
      // Generate actual statistics for top numerical columns
      for (const col of numericalColumns.slice(0, 3)) {
        const stats = this.calculateActualStatistics(data.rows, col.name);
        
        if (stats && stats.count > 0) {
          results.push({
            id: `numerical_analysis_${col.name}`,
            title: `${col.name} Statistical Analysis`,
            description: `Real statistical analysis of the ${col.name} column`,
            value: {
              average: parseFloat(stats.avg.toFixed(2)),
              minimum: stats.min,
              maximum: stats.max,
              standardDeviation: parseFloat(stats.stdDev.toFixed(2)),
              count: stats.count
            },
            confidence: stats.count > 10 ? 'high' : 'medium',
            type: 'statistical',
            timestamp: new Date().toISOString()
          });
        }
      }
      
      // Analyze REAL categorical columns
      const categoricalColumns = this.identifyTextColumns(data);
      console.log('📊 Found categorical columns:', categoricalColumns.length);
      
      for (const col of categoricalColumns.slice(0, 2)) {
        const distribution = this.analyzeCategoricalDistribution(data.rows, col.name);
        
        if (distribution.uniqueCount > 1) {
          results.push({
            id: `categorical_analysis_${col.name}`,
            title: `${col.name} Category Distribution`,
            description: `Real categorical breakdown of ${col.name}`,
            value: {
              uniqueCategories: distribution.uniqueCount,
              totalRecords: distribution.totalCount,
              topCategory: distribution.topCategory,
              topCategoryCount: distribution.topCount,
              diversity: parseFloat((distribution.uniqueCount / distribution.totalCount * 100).toFixed(1))
            },
            confidence: distribution.totalCount > 5 ? 'high' : 'medium',
            type: 'categorical',
            timestamp: new Date().toISOString()
          });
        }
      }
      
      // Time-based analysis for date columns
      const dateColumns = this.identifyDateColumns(data);
      console.log('📅 Found date columns:', dateColumns.length);
      
      for (const col of dateColumns.slice(0, 1)) {
        const timeAnalysis = this.analyzeTimeColumn(data.rows, col.name);
        
        if (timeAnalysis) {
          results.push({
            id: `temporal_analysis_${col.name}`,
            title: `${col.name} Time Range Analysis`,
            description: `Real temporal analysis of ${col.name} column`,
            value: {
              earliestDate: timeAnalysis.earliest,
              latestDate: timeAnalysis.latest,
              daySpan: timeAnalysis.daySpan,
              validDates: timeAnalysis.validDateCount
            },
            confidence: timeAnalysis.validDateCount > 5 ? 'high' : 'medium',
            type: 'temporal',
            timestamp: new Date().toISOString()
          });
        }
      }
      
      // Data quality analysis
      const qualityMetrics = this.calculateDataQuality(data);
      results.push({
        id: 'data_quality_assessment',
        title: 'Data Quality Assessment',
        description: 'Real data quality metrics for your dataset',
        value: {
          completeness: parseFloat(qualityMetrics.completeness.toFixed(1)),
          consistency: qualityMetrics.consistency,
          duplicateRows: qualityMetrics.duplicates
        },
        confidence: 'high',
        type: 'quality',
        timestamp: new Date().toISOString()
      });
      
      // Research question specific analysis
      const researchResults = this.generateResearchSpecificResults(context, data);
      results.push(...researchResults);
      
    } catch (error) {
      console.warn('Error generating real results:', error);
      // Fallback to basic summary if detailed analysis fails
      results.push({
        id: 'basic-analysis',
        title: 'Basic Data Summary',
        description: 'Basic information extracted from your dataset',
        value: `${data.rowCount} rows processed successfully`,
        confidence: 'medium',
        type: 'summary',
        timestamp: new Date().toISOString()
      });
    }
    
    console.log('📈 Generated real analysis results:', results.length, 'results');
    return results;
  }

  private identifyNumericalColumns(data: ParsedData) {
    return data.columns.filter(col => {
      const sampleValues = data.rows.slice(0, 20).map(row => row[col.name]).filter(val => val != null && val !== '');
      const numericCount = sampleValues.filter(val => {
        const num = Number(val);
        return !isNaN(num) && isFinite(num);
      }).length;
      return numericCount / Math.max(sampleValues.length, 1) > 0.7;
    });
  }

  private identifyTextColumns(data: ParsedData) {
    return data.columns.filter(col => {
      const sampleValues = data.rows.slice(0, 20).map(row => row[col.name]).filter(val => val != null && val !== '');
      const numericCount = sampleValues.filter(val => !isNaN(Number(val))).length;
      return numericCount / Math.max(sampleValues.length, 1) < 0.3;
    });
  }

  private identifyDateColumns(data: ParsedData) {
    return data.columns.filter(col => {
      if (/date|time|timestamp|created|updated|when/i.test(col.name)) return true;
      
      const sampleValues = data.rows.slice(0, 10).map(row => row[col.name]).filter(val => val != null && val !== '');
      const dateCount = sampleValues.filter(val => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date.getFullYear() > 1900;
      }).length;
      return dateCount / Math.max(sampleValues.length, 1) > 0.7;
    });
  }

  private calculateActualStatistics(rows: any[], columnName: string) {
    const values = rows.map(row => Number(row[columnName])).filter(val => !isNaN(val) && isFinite(val));
    
    if (values.length === 0) return null;
    
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    return { avg, stdDev, min, max, count: values.length };
  }

  private analyzeCategoricalDistribution(rows: any[], columnName: string) {
    const values = rows.map(row => row[columnName]).filter(val => val != null && val !== '');
    const distribution = new Map<string, number>();
    
    values.forEach(val => {
      const key = String(val);
      distribution.set(key, (distribution.get(key) || 0) + 1);
    });
    
    const entries = Array.from(distribution.entries()).sort((a, b) => b[1] - a[1]);
    
    return {
      uniqueCount: distribution.size,
      topCategory: entries[0]?.[0] || '',
      topCount: entries[0]?.[1] || 0,
      totalCount: values.length
    };
  }

  private analyzeTimeColumn(rows: any[], columnName: string) {
    const dates = rows.map(row => new Date(row[columnName])).filter(date => !isNaN(date.getTime()));
    
    if (dates.length === 0) return null;
    
    const earliest = new Date(Math.min(...dates.map(d => d.getTime())));
    const latest = new Date(Math.max(...dates.map(d => d.getTime())));
    const daySpan = Math.ceil((latest.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      earliest: earliest.toISOString().split('T')[0],
      latest: latest.toISOString().split('T')[0],
      daySpan,
      validDateCount: dates.length
    };
  }

  private calculateDataQuality(data: ParsedData) {
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
    
    // Check for duplicate rows (simple check on first few columns)
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
      consistency: Math.max(0, 100 - (duplicateRows / data.rows.length * 100)),
      duplicates: duplicateRows
    };
  }

  private generateResearchSpecificResults(context: DataAnalysisContext, data: ParsedData): AnalysisResult[] {
    const results: AnalysisResult[] = [];
    const questionLower = context.researchQuestion.toLowerCase();
    
    // Correlation analysis for correlation-related questions
    if (questionLower.includes('correlation') || questionLower.includes('relationship')) {
      const numericalColumns = this.identifyNumericalColumns(data);
      if (numericalColumns.length >= 2) {
        const correlation = this.calculateSimpleCorrelation(data.rows, numericalColumns[0].name, numericalColumns[1].name);
        if (correlation !== null) {
          results.push({
            id: 'correlation_analysis',
            title: `Correlation: ${numericalColumns[0].name} vs ${numericalColumns[1].name}`,
            description: `Statistical correlation analysis between key variables`,
            value: {
              correlationCoefficient: parseFloat(correlation.toFixed(3)),
              strength: Math.abs(correlation) > 0.7 ? 'Strong' : Math.abs(correlation) > 0.3 ? 'Moderate' : 'Weak',
              direction: correlation > 0 ? 'Positive' : 'Negative'
            },
            confidence: 'high',
            type: 'correlation',
            timestamp: new Date().toISOString()
          });
        }
      }
    }
    
    return results;
  }

  private calculateSimpleCorrelation(rows: any[], col1: string, col2: string): number | null {
    const pairs = rows.map(row => [Number(row[col1]), Number(row[col2])])
      .filter(([a, b]) => !isNaN(a) && !isNaN(b) && isFinite(a) && isFinite(b));
    
    if (pairs.length < 5) return null;
    
    const n = pairs.length;
    const sumX = pairs.reduce((sum, [x]) => sum + x, 0);
    const sumY = pairs.reduce((sum, [, y]) => sum + y, 0);
    const sumXY = pairs.reduce((sum, [x, y]) => sum + x * y, 0);
    const sumX2 = pairs.reduce((sum, [x]) => sum + x * x, 0);
    const sumY2 = pairs.reduce((sum, [, y]) => sum + y * y, 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }
}
