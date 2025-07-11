import { DataAnalysisContext } from '@/types/data';
import { AnalysisReport, AnalysisResult } from '@/types/analysis';
import { DataValidator } from '@/utils/analysis/dataValidator';
import { parseFile, ParsedData } from '@/utils/dataParser';

export class AnalysisCoordinator {
  static async executeAnalysis(context: DataAnalysisContext): Promise<AnalysisReport> {
    console.log('🔍 AnalysisCoordinator starting execution with context:', {
      hasResearchQuestion: !!context.researchQuestion,
      dataLength: context.parsedData?.length || 0,
      dataType: typeof context.parsedData
    });
    
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

      console.log('📊 Analyzing data structure:', {
        rows: parsedData.rows?.length || 0,
        columns: parsedData.columns?.length || 0,
        sampleRow: parsedData.rows?.[0] ? Object.keys(parsedData.rows[0]) : []
      });

      // Validate data quality
      const validator = new DataValidator(parsedData);
      const validation = validator.validate();
      
      if (!validation.isValid) {
        console.warn('⚠️ Data validation issues:', validation.errors);
      }

      // Perform real analysis based on actual data
      const insights = await this.generateRealInsights(context, parsedData);
      const results = await this.generateRealResults(context, parsedData, insights);
      const sqlQuery = this.generateSQLQuery(context, parsedData);
      
      const report: AnalysisReport = {
        id: `analysis_${Date.now()}`,
        timestamp: new Date(),
        context,
        results,
        insights,
        confidence: validation.confidence,
        recommendations: this.generateRealRecommendations(insights, validation, parsedData),
        sqlQuery,
        queryBreakdown: this.generateQueryBreakdown(sqlQuery),
        dataQuality: {
          isValid: validation.isValid,
          errors: validation.errors,
          warnings: validation.warnings,
          completeness: this.calculateCompleteness(parsedData)
        }
      };

      console.log('✅ Real analysis completed successfully:', {
        resultsCount: results.length,
        insightsCount: insights.length,
        confidence: report.confidence
      });

      return report;
      
    } catch (error) {
      console.error('❌ Analysis failed in coordinator:', error);
      
      return {
        id: `error_${Date.now()}`,
        timestamp: new Date(),
        context,
        results: [],
        insights: [`Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
        confidence: 'low',
        recommendations: [
          'Check your data format and ensure it contains valid information',
          'Verify that your file was uploaded correctly',
          'Try uploading a smaller sample of your data first'
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

  private static async generateRealInsights(context: DataAnalysisContext, data: ParsedData): Promise<string[]> {
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
      const questionLower = context.researchQuestion.toLowerCase();
      
      if (questionLower.includes('trend') || questionLower.includes('time')) {
        if (dateColumns.length > 0) {
          insights.push(`Time-based analysis is possible using columns: ${dateColumns.join(', ')}`);
        } else {
          insights.push('No clear time-based columns detected for trend analysis');
        }
      }
      
      if (questionLower.includes('correlation') && numericalColumns.length >= 2) {
        insights.push(`Correlation analysis can be performed between ${numericalColumns.length} numerical variables`);
      }
      
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

  private static async generateRealResults(context: DataAnalysisContext, data: ParsedData, insights: string[]): Promise<AnalysisResult[]> {
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
      const numericalColumns = data.columns.filter(col => {
        const sampleValues = data.rows.slice(0, 10).map(row => row[col.name]).filter(val => val != null && val !== '');
        const numericCount = sampleValues.filter(val => !isNaN(Number(val)) && isFinite(Number(val))).length;
        return numericCount / Math.max(sampleValues.length, 1) > 0.7;
      });
      
      // Generate statistics for top numerical columns
      numericalColumns.slice(0, 3).forEach(col => {
        const values = data.rows.map(row => Number(row[col.name])).filter(val => !isNaN(val) && isFinite(val));
        
        if (values.length > 0) {
          const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
          const min = Math.min(...values);
          const max = Math.max(...values);
          const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
          const stdDev = Math.sqrt(variance);
          
          results.push({
            id: `stats_${col.name}`,
            title: `${col.name} Analysis`,
            description: `Statistical analysis of the ${col.name} column`,
            value: `Avg: ${avg.toFixed(2)} ± ${stdDev.toFixed(2)}`,
            confidence: 'high',
            type: 'statistical',
            timestamp: new Date().toISOString()
          });
        }
      });
      
      // Generate categorical analysis for text columns
      const textColumns = data.columns.filter(col => {
        const sampleValues = data.rows.slice(0, 10).map(row => row[col.name]).filter(val => val != null && val !== '');
        const numericCount = sampleValues.filter(val => !isNaN(Number(val))).length;
        return numericCount / Math.max(sampleValues.length, 1) < 0.3;
      });
      
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

  private static generateRealRecommendations(insights: string[], validation: any, data: ParsedData): string[] {
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
    const numericalColumns = data.columns.filter(col => {
      const sampleValues = data.rows.slice(0, 5).map(row => row[col.name]).filter(val => val != null);
      const numericCount = sampleValues.filter(val => !isNaN(Number(val))).length;
      return numericCount / Math.max(sampleValues.length, 1) > 0.7;
    });
    
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
