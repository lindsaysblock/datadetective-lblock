
import { DataAnalysisContext } from '@/types/data';
import { ParsedData } from '@/utils/dataParser';

export class RealDataAnalyzer {
  async generateInsights(context: DataAnalysisContext, data: ParsedData): Promise<string[]> {
    const insights: string[] = [];
    
    try {
      const actualRows = data.rows?.length || 0;
      const actualColumns = data.columns?.length || 0;
      
      console.log('🔍 Generating insights for real data:', { actualRows, actualColumns });
      
      // Basic data insights based on actual data
      insights.push(`Your dataset contains ${actualRows} records across ${actualColumns} different fields`);
      
      if (actualRows === 0) {
        insights.push('No data rows were found - please check your file format');
        return insights;
      }

      // Analyze actual column types and content
      const { numericalColumns, textColumns, dateColumns } = this.analyzeColumnTypes(data);

      if (numericalColumns.length > 0) {
        insights.push(`Found ${numericalColumns.length} numerical columns (${numericalColumns.slice(0, 3).join(', ')}) suitable for quantitative analysis`);
        
        // Calculate actual statistics for numerical columns
        numericalColumns.slice(0, 2).forEach(colName => {
          const values = data.rows.map(row => Number(row[colName])).filter(val => !isNaN(val));
          if (values.length > 0) {
            const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
            const min = Math.min(...values);
            const max = Math.max(...values);
            insights.push(`${colName}: average ${avg.toFixed(2)}, ranging from ${min} to ${max}`);
          }
        });
      }
      
      if (textColumns.length > 0) {
        insights.push(`Identified ${textColumns.length} text-based columns for categorical analysis`);
      }
      
      if (dateColumns.length > 0) {
        insights.push(`Found ${dateColumns.length} date/time columns enabling temporal trend analysis`);
      }
      
      // Research question specific insights
      this.addResearchQuestionInsights(context, insights, { numericalColumns, dateColumns });
      
      // Data quality insights based on actual data
      const completeness = this.calculateCompleteness(data);
      if (completeness < 95) {
        insights.push(`Data completeness is ${completeness.toFixed(1)}% - some fields contain missing values`);
      } else {
        insights.push('Data quality is excellent with minimal missing values');
      }
      
    } catch (error) {
      console.warn('Error generating real insights:', error);
      insights.push('Basic data structure analysis completed');
    }
    
    return insights;
  }

  private analyzeColumnTypes(data: ParsedData) {
    const numericalColumns: string[] = [];
    const textColumns: string[] = [];
    const dateColumns: string[] = [];
    
    data.columns.forEach(col => {
      const sampleValues = data.rows.slice(0, 10).map(row => row[col.name]).filter(val => val != null && val !== '');
      
      if (sampleValues.length > 0) {
        const numericCount = sampleValues.filter(val => !isNaN(Number(val)) && isFinite(Number(val))).length;
        const dateCount = sampleValues.filter(val => {
          const dateVal = new Date(val);
          return !isNaN(dateVal.getTime());
        }).length;
        
        if (numericCount / sampleValues.length > 0.7) {
          numericalColumns.push(col.name);
        } else if (dateCount / sampleValues.length > 0.7) {
          dateColumns.push(col.name);
        } else {
          textColumns.push(col.name);
        }
      }
    });

    return { numericalColumns, textColumns, dateColumns };
  }

  private addResearchQuestionInsights(context: DataAnalysisContext, insights: string[], columnTypes: any) {
    const questionLower = context.researchQuestion.toLowerCase();
    
    if (questionLower.includes('trend') || questionLower.includes('time')) {
      if (columnTypes.dateColumns.length > 0) {
        insights.push(`Time-based analysis is possible using columns: ${columnTypes.dateColumns.join(', ')}`);
      } else {
        insights.push('No clear time-based columns detected for trend analysis');
      }
    }
    
    if (questionLower.includes('correlation') && columnTypes.numericalColumns.length >= 2) {
      insights.push(`Correlation analysis can be performed between ${columnTypes.numericalColumns.length} numerical variables`);
    }
  }

  generateRecommendations(insights: string[], validation: any, data: ParsedData): string[] {
    const recommendations: string[] = [];
    
    // Data quality recommendations
    if (!validation.isValid) {
      recommendations.push('Address data quality issues identified in the validation report');
    }
    
    const completeness = this.calculateCompleteness(data);
    if (completeness < 90) {
      recommendations.push('Consider cleaning missing data values for more accurate analysis');
    }
    
    // Column-specific recommendations
    const { numericalColumns } = this.analyzeColumnTypes(data);
    
    if (numericalColumns.length >= 2) {
      recommendations.push('Explore correlations between numerical variables for deeper insights');
    }
    
    if (numericalColumns.length > 0) {
      recommendations.push('Create visualizations (histograms, scatter plots) to understand data distributions');
    }
    
    // General recommendations
    recommendations.push('Export detailed results for further analysis in specialized tools');
    recommendations.push('Consider segmenting your data by key categories for targeted insights');
    
    return recommendations;
  }

  private calculateCompleteness(data: ParsedData): number {
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
