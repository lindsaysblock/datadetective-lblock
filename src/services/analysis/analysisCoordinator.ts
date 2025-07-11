
import { DataAnalysisContext } from '@/types/data';
import { AnalysisReport } from '@/types/analysis';
import { DataValidator } from '@/utils/analysis/dataValidator';
import { parseFile, ParsedData } from '@/utils/dataParser';
import { RealDataAnalyzer } from './realDataAnalyzer';
import { AnalysisResultsGenerator } from './analysisResultsGenerator';

export class AnalysisCoordinator {
  private realDataAnalyzer = new RealDataAnalyzer();
  private resultsGenerator = new AnalysisResultsGenerator();

  static async executeAnalysis(context: DataAnalysisContext): Promise<AnalysisReport> {
    const coordinator = new AnalysisCoordinator();
    return coordinator.execute(context);
  }

  private async execute(context: DataAnalysisContext): Promise<AnalysisReport> {
    console.log('🔍 AnalysisCoordinator starting execution with context:', {
      hasResearchQuestion: !!context.researchQuestion,
      dataLength: context.parsedData?.length || 0,
      dataType: typeof context.parsedData
    });
    
    try {
      // Validate input context
      this.validateContext(context);

      // Convert parsedData array to ParsedData format if needed
      const parsedData = this.normalizeParsedData(context.parsedData);

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
      const insights = await this.realDataAnalyzer.generateInsights(context, parsedData);
      const results = await this.resultsGenerator.generateResults(context, parsedData, insights);
      const sqlQuery = this.generateSQLQuery(context, parsedData);
      
      const report: AnalysisReport = {
        id: `analysis_${Date.now()}`,
        timestamp: new Date(),
        context,
        results,
        insights,
        confidence: validation.confidence,
        recommendations: this.realDataAnalyzer.generateRecommendations(insights, validation, parsedData),
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
      return this.createErrorReport(context, error);
    }
  }

  private validateContext(context: DataAnalysisContext): void {
    if (!context.researchQuestion?.trim()) {
      throw new Error('Research question is required for analysis');
    }

    if (!context.parsedData || !Array.isArray(context.parsedData) || context.parsedData.length === 0) {
      throw new Error('Valid parsed data is required for analysis');
    }
  }

  private normalizeParsedData(parsedData: any): ParsedData {
    return Array.isArray(parsedData) 
      ? {
          columns: parsedData.length > 0 ? Object.keys(parsedData[0]).map(key => ({ name: key, type: 'string' })) : [],
          rows: parsedData,
          rowCount: parsedData.length,
          fileSize: JSON.stringify(parsedData).length
        }
      : parsedData;
  }

  private generateSQLQuery(context: DataAnalysisContext, data: ParsedData): string {
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

  private generateQueryBreakdown(sqlQuery: string): string[] {
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

  private createErrorReport(context: DataAnalysisContext, error: any): AnalysisReport {
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
