
import { DataAnalysisContext } from '@/types/data';
import { AnalysisReport, AnalysisResult, DataInsight } from '@/types/analysis';
import { DataValidator } from '@/utils/analysis/dataValidator';
import { parseFile, ParsedData } from '@/utils/dataParser';

export class AnalysisCoordinator {
  static async executeAnalysis(context: DataAnalysisContext): Promise<AnalysisReport> {
    console.log('🔍 AnalysisCoordinator starting execution');
    
    try {
      // Validate input context
      if (!context.researchQuestion?.trim()) {
        throw new Error('Research question is required for analysis');
      }

      if (!context.parsedData || !Array.isArray(context.parsedData) || context.parsedData.length === 0) {
        throw new Error('Valid parsed data is required for analysis');
      }

      // Convert parsedData array to ParsedData format if needed
      const parsedData: ParsedData = Array.isArray(context.parsedData) 
        ? {
            columns: context.parsedData.length > 0 ? Object.keys(context.parsedData[0]).map(key => ({ name: key, type: 'string' })) : [],
            rows: context.parsedData,
            rowCount: context.parsedData.length,
            fileSize: JSON.stringify(context.parsedData).length
          }
        : context.parsedData;

      // Validate data quality
      const validator = new DataValidator(parsedData);
      const validation = validator.validate();
      
      if (!validation.isValid) {
        console.warn('Data validation issues:', validation.errors);
      }

      // Perform analysis
      const insights = await this.generateInsights(context, parsedData);
      const results = await this.generateResults(context, parsedData, insights);
      const sqlQuery = this.generateSQLQuery(context, parsedData);
      
      const report: AnalysisReport = {
        id: `analysis_${Date.now()}`,
        timestamp: new Date(),
        context,
        results,
        insights,
        confidence: validation.confidence,
        recommendations: this.generateRecommendations(insights, validation),
        sqlQuery,
        queryBreakdown: this.generateQueryBreakdown(sqlQuery),
        dataQuality: {
          isValid: validation.isValid,
          errors: validation.errors,
          warnings: validation.warnings,
          completeness: this.calculateCompleteness(parsedData)
        }
      };

      console.log('✅ Analysis completed successfully:', {
        resultsCount: results.length,
        insightsCount: insights.length,
        confidence: report.confidence
      });

      return report;
      
    } catch (error) {
      console.error('❌ Analysis failed in coordinator:', error);
      
      // Return error report
      return {
        id: `error_${Date.now()}`,
        timestamp: new Date(),
        context,
        results: [],
        insights: [`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        confidence: 'low',
        recommendations: [
          'Check your data format',
          'Ensure all required fields are present',
          'Try with a smaller dataset first'
        ],
        sqlQuery: '-- Analysis failed',
        queryBreakdown: [],
        dataQuality: {
          isValid: false,
          errors: [error instanceof Error ? error.message : 'Unknown error'],
          warnings: [],
          completeness: 0
        }
      };
    }
  }

  private static async generateInsights(context: DataAnalysisContext, data: ParsedData): Promise<string[]> {
    const insights: string[] = [];
    
    try {
      // Basic data insights
      insights.push(`Dataset contains ${data.rowCount} records with ${data.columns.length} columns`);
      
      // Column analysis
      const numericalColumns = data.columns.filter(col => 
        col.type === 'number' || this.isNumericalColumn(col.name, data.rows)
      );
      
      if (numericalColumns.length > 0) {
        insights.push(`Identified ${numericalColumns.length} numerical columns for quantitative analysis`);
      }
      
      // Research question specific insights
      const questionLower = context.researchQuestion.toLowerCase();
      
      if (questionLower.includes('trend') || questionLower.includes('time')) {
        const timeColumns = data.columns.filter(col => 
          /date|time|timestamp|created|updated/i.test(col.name)
        );
        
        if (timeColumns.length > 0) {
          insights.push(`Found ${timeColumns.length} time-based columns for trend analysis`);
        } else {
          insights.push('No time-based columns detected - consider adding timestamp data for trend analysis');
        }
      }
      
      if (questionLower.includes('correlation') || questionLower.includes('relationship')) {
        if (numericalColumns.length >= 2) {
          insights.push(`${numericalColumns.length} numerical columns available for correlation analysis`);
        }
      }
      
      // Data quality insights
      const completeness = this.calculateCompleteness(data);
      if (completeness < 90) {
        insights.push(`Data completeness is ${completeness.toFixed(1)}% - some analysis may be limited`);
      }
      
    } catch (error) {
      console.warn('Error generating insights:', error);
      insights.push('Basic data structure analysis completed');
    }
    
    return insights;
  }

  private static async generateResults(context: DataAnalysisContext, data: ParsedData, insights: string[]): Promise<AnalysisResult[]> {
    const results: AnalysisResult[] = [];
    
    try {
      // Summary result
      results.push({
        id: 'summary',
        title: 'Data Summary',
        description: `Analysis of ${data.rowCount} records across ${data.columns.length} dimensions`,
        value: `${data.rowCount} rows × ${data.columns.length} columns`,
        confidence: 'high',
        type: 'summary'
      });
      
      // Column analysis results
      const numericalColumns = data.columns.filter(col => 
        this.isNumericalColumn(col.name, data.rows)
      );
      
      for (const col of numericalColumns.slice(0, 3)) { // Limit to first 3 numerical columns
        const values = data.rows
          .map(row => parseFloat(row[col.name]))
          .filter(val => !isNaN(val));
          
        if (values.length > 0) {
          const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
          const min = Math.min(...values);
          const max = Math.max(...values);
          
          results.push({
            id: `stats_${col.name}`,
            title: `${col.name} Statistics`,
            description: `Statistical analysis of ${col.name} column`,
            value: `Avg: ${avg.toFixed(2)}, Range: ${min} - ${max}`,
            confidence: 'high',
            type: 'statistical'
          });
        }
      }
      
      // Research question specific results
      if (context.researchQuestion.toLowerCase().includes('distribution')) {
        results.push({
          id: 'distribution',
          title: 'Data Distribution',
          description: 'Analysis of data distribution patterns',
          value: `${numericalColumns.length} columns analyzed for distribution patterns`,
          confidence: 'medium',
          type: 'distribution'
        });
      }
      
    } catch (error) {
      console.warn('Error generating results:', error);
    }
    
    return results;
  }

  private static generateSQLQuery(context: DataAnalysisContext, data: ParsedData): string {
    try {
      const tableName = 'dataset';
      const columns = data.columns.map(col => col.name).join(', ');
      
      let query = `-- Analysis query for: ${context.researchQuestion}\n`;
      query += `SELECT ${columns}\n`;
      query += `FROM ${tableName}\n`;
      
      // Add WHERE clause based on research question
      if (context.researchQuestion.toLowerCase().includes('recent')) {
        const dateColumns = data.columns.filter(col => 
          /date|time|timestamp/i.test(col.name)
        );
        
        if (dateColumns.length > 0) {
          query += `WHERE ${dateColumns[0].name} >= DATE_SUB(NOW(), INTERVAL 30 DAY)\n`;
        }
      }
      
      query += `ORDER BY ${data.columns[0]?.name || 'id'}\n`;
      query += `LIMIT 1000;`;
      
      return query;
    } catch (error) {
      return '-- Error generating SQL query';
    }
  }

  private static generateQueryBreakdown(sqlQuery: string): string[] {
    const breakdown: string[] = [];
    
    if (sqlQuery.includes('SELECT')) {
      breakdown.push('SELECT: Retrieves specified columns from the dataset');
    }
    
    if (sqlQuery.includes('FROM')) {
      breakdown.push('FROM: Specifies the source table/dataset');
    }
    
    if (sqlQuery.includes('WHERE')) {
      breakdown.push('WHERE: Applies filters to narrow down the results');
    }
    
    if (sqlQuery.includes('ORDER BY')) {
      breakdown.push('ORDER BY: Sorts results for consistent output');
    }
    
    if (sqlQuery.includes('LIMIT')) {
      breakdown.push('LIMIT: Restricts the number of returned rows');
    }
    
    return breakdown;
  }

  private static generateRecommendations(insights: string[], validation: any): string[] {
    const recommendations: string[] = [];
    
    if (!validation.isValid) {
      recommendations.push('Address data quality issues before proceeding with analysis');
    }
    
    if (validation.warnings.length > 0) {
      recommendations.push('Review data completeness warnings for better insights');
    }
    
    recommendations.push('Consider visualizing key metrics for better understanding');
    recommendations.push('Export results for further analysis in specialized tools');
    
    return recommendations;
  }

  private static isNumericalColumn(columnName: string, rows: any[]): boolean {
    if (rows.length === 0) return false;
    
    // Check first few non-null values
    const sampleValues = rows
      .slice(0, 10)
      .map(row => row[columnName])
      .filter(val => val !== null && val !== undefined && val !== '');
    
    if (sampleValues.length === 0) return false;
    
    const numericalCount = sampleValues.filter(val => 
      !isNaN(parseFloat(val)) && isFinite(val)
    ).length;
    
    return numericalCount / sampleValues.length > 0.8; // 80% threshold
  }

  private static calculateCompleteness(data: ParsedData): number {
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
