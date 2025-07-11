
import { DataAnalysisContext } from '@/types/data';
import { ParsedData } from '@/utils/dataParser';
import { DataTypeAnalyzer } from './dataTypeAnalyzer';
import { StatisticalAnalyzer } from './statisticalAnalyzer';

export class RealDataAnalyzer {
  async generateInsights(context: DataAnalysisContext, data: ParsedData): Promise<string[]> {
    const insights: string[] = [];
    
    try {
      const actualRows = data.rows?.length || 0;
      const actualColumns = data.columns?.length || 0;
      
      console.log('🔍 Generating insights for data:', { actualRows, actualColumns });
      
      if (actualRows === 0) {
        insights.push('No data rows were found - please check your file format');
        return insights;
      }

      // Basic dataset insight
      insights.push(`Dataset Analysis: Your data contains ${actualRows.toLocaleString()} records across ${actualColumns} fields, providing substantial information for analysis.`);
      
      // Analyze column types
      const columnTypes = DataTypeAnalyzer.analyzeColumns(data);
      
      // Numerical insights
      if (columnTypes.numericalColumns.length > 0) {
        insights.push(`Quantitative Analysis Available: Found ${columnTypes.numericalColumns.length} numerical columns suitable for statistical analysis.`);
        
        // Generate insights for top numerical columns
        for (const col of columnTypes.numericalColumns.slice(0, 3)) {
          const stats = StatisticalAnalyzer.calculateNumericalStatistics(data.rows, col.name);
          if (stats) {
            insights.push(`${col.name} Statistics: Average value is ${stats.average.toFixed(2)}, ranging from ${stats.minimum} to ${stats.maximum}. Standard deviation: ${stats.standardDeviation.toFixed(2)}`);
          }
        }
      }
      
      // Categorical insights
      if (columnTypes.categoricalColumns.length > 0) {
        insights.push(`Categorical Analysis Ready: ${columnTypes.categoricalColumns.length} text-based columns available for segmentation analysis.`);
        
        for (const col of columnTypes.categoricalColumns.slice(0, 2)) {
          const distribution = StatisticalAnalyzer.analyzeCategoricalDistribution(data.rows, col.name);
          if (distribution && distribution.uniqueCategories > 1) {
            insights.push(`${col.name} Distribution: ${distribution.uniqueCategories} unique categories found. Most common: "${distribution.topCategory}" (${distribution.topCategoryCount} occurrences)`);
          }
        }
      }
      
      // Temporal insights
      if (columnTypes.temporalColumns.length > 0) {
        insights.push(`Temporal Analysis Possible: ${columnTypes.temporalColumns.length} date/time columns enable trend analysis over time periods.`);
        
        for (const col of columnTypes.temporalColumns) {
          const timeRange = StatisticalAnalyzer.analyzeTemporalDistribution(data.rows, col.name);
          if (timeRange) {
            insights.push(`${col.name} Time Range: Data spans from ${timeRange.earliestDate} to ${timeRange.latestDate} (${timeRange.timeSpan})`);
          }
        }
      }
      
      // Research-specific insights
      this.addResearchSpecificInsights(context, insights, data, columnTypes);
      
      // Data quality insights
      const completeness = this.calculateDataCompleteness(data);
      if (completeness < 95) {
        insights.push(`Data Quality Note: ${completeness.toFixed(1)}% completeness - some fields contain missing values.`);
      } else {
        insights.push(`Data Quality Excellent: ${completeness.toFixed(1)}% completeness with minimal missing values.`);
      }
      
    } catch (error) {
      console.warn('Error generating insights:', error);
      insights.push('Analysis completed with basic data structure assessment');
    }
    
    console.log('💡 Generated insights:', insights.length, 'insights');
    return insights;
  }

  private addResearchSpecificInsights(context: DataAnalysisContext, insights: string[], data: ParsedData, columnTypes: any): void {
    const questionLower = context.researchQuestion.toLowerCase();
    
    if (questionLower.includes('trend') || questionLower.includes('time')) {
      if (columnTypes.temporalColumns.length > 0) {
        insights.push(`Trend Analysis Ready: Time-based analysis can be performed using ${columnTypes.temporalColumns.map((col: any) => col.name).join(', ')}.`);
      } else {
        insights.push('Trend Analysis Limited: No clear date/time columns detected.');
      }
    }
    
    if (questionLower.includes('correlation') && columnTypes.numericalColumns.length >= 2) {
      insights.push(`Correlation Analysis Available: ${columnTypes.numericalColumns.length} numerical variables enable relationship analysis.`);
    }
    
    if (questionLower.includes('segment') || questionLower.includes('group')) {
      if (columnTypes.categoricalColumns.length > 0) {
        insights.push(`Segmentation Analysis Ready: ${columnTypes.categoricalColumns.length} categorical columns available for segmentation.`);
      }
    }
  }

  generateRecommendations(insights: string[], validation: any, data: ParsedData): string[] {
    const recommendations: string[] = [];
    
    const columnTypes = DataTypeAnalyzer.analyzeColumns(data);
    
    if (columnTypes.numericalColumns.length >= 2) {
      recommendations.push(`Explore statistical relationships between ${columnTypes.numericalColumns.slice(0, 3).map(col => col.name).join(', ')} for deeper insights.`);
    }
    
    if (columnTypes.temporalColumns.length > 0 && columnTypes.numericalColumns.length > 0) {
      recommendations.push('Create time-based visualizations to identify trends and seasonal patterns.');
    }
    
    if (columnTypes.categoricalColumns.length > 0) {
      recommendations.push(`Perform segmentation analysis using categorical variables like ${columnTypes.categoricalColumns.slice(0, 2).map(col => col.name).join(', ')}.`);
    }
    
    const completeness = this.calculateDataCompleteness(data);
    if (completeness < 90) {
      recommendations.push('Address missing data values to improve analysis accuracy.');
    }
    
    if (data.rows.length > 1000) {
      recommendations.push('Consider sampling strategies for large dataset analysis to optimize performance.');
    }
    
    recommendations.push('Export detailed findings and create visualizations to communicate insights effectively.');
    
    return recommendations;
  }

  private calculateDataCompleteness(data: ParsedData): number {
    if (data.rows.length === 0 || data.columns.length === 0) return 0;
    
    const totalCells = data.rows.length * data.columns.length;
    let filledCells = 0;
    
    data.rows.forEach(row => {
      data.columns.forEach(col => {
        const value = row[col.name];
        if (value !== null && value !== undefined && value !== '') {
          filledCells++;
        }
      });
    });
    
    return (filledCells / totalCells) * 100;
  }
}
