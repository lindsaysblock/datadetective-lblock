
import { DataAnalysisContext } from '@/types/data';
import { AnalysisReport } from '@/types/analysis';
import { DataValidator } from '@/utils/analysis/dataValidator';
import { ParsedData } from '@/utils/dataParser';
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
    console.log('🔍 AnalysisCoordinator executing analysis with context:', {
      hasResearchQuestion: !!context.researchQuestion,
      dataFilesCount: context.parsedData?.length || 0
    });
    
    try {
      this.validateContext(context);

      const primaryDataFile = context.parsedData[0];
      const parsedData = this.normalizeParsedData(primaryDataFile);

      console.log('📊 Processing data structure:', {
        rows: parsedData.rows?.length || 0,
        columns: parsedData.columns?.length || 0
      });

      const validator = new DataValidator(parsedData);
      const validation = validator.validate();
      
      if (!validation.isValid) {
        console.warn('⚠️ Data validation issues found:', validation.errors);
      }

      console.log('🔬 Starting data analysis...');
      const insights = await this.realDataAnalyzer.generateInsights(context, parsedData);
      const results = await this.resultsGenerator.generateResults(context, parsedData, insights);
      const sqlQuery = this.generateSQLQuery(context, parsedData);
      
      const report: AnalysisReport = {
        id: `analysis_${Date.now()}`,
        timestamp: new Date(),
        context,
        results,
        insights,
        confidence: this.calculateOverallConfidence(validation, results),
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

      console.log('✅ Analysis completed successfully:', {
        resultsCount: results.length,
        insightsCount: insights.length,
        confidence: report.confidence
      });

      return report;
      
    } catch (error) {
      console.error('❌ Analysis failed:', error);
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

    const firstFile = context.parsedData[0];
    if (!firstFile.rows || !Array.isArray(firstFile.rows) || firstFile.rows.length === 0) {
      throw new Error('No data rows found in uploaded file');
    }
  }

  private normalizeParsedData(dataFile: any): ParsedData {
    const columns = dataFile.columns || [];
    const rows = dataFile.rows || [];
    
    return {
      columns: typeof columns[0] === 'string' 
        ? columns.map((name: string) => ({ name, type: this.inferColumnType(rows, name) }))
        : columns,
      rows,
      rowCount: rows.length,
      fileSize: JSON.stringify(rows).length,
      summary: {
        totalRows: rows.length,
        totalColumns: columns.length,
        possibleUserIdColumns: this.findUserIdColumns(columns),
        possibleEventColumns: this.findEventColumns(columns),
        possibleTimestampColumns: this.findTimestampColumns(columns, rows)
      }
    };
  }

  private inferColumnType(rows: any[], columnName: string): 'string' | 'number' | 'date' | 'boolean' {
    const sampleValues = rows.slice(0, 10).map(row => row[columnName]).filter(val => val != null && val !== '');
    
    if (sampleValues.length === 0) return 'string';
    
    const numericCount = sampleValues.filter(val => !isNaN(Number(val)) && isFinite(Number(val))).length;
    if (numericCount / sampleValues.length > 0.7) return 'number';
    
    const dateCount = sampleValues.filter(val => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }).length;
    if (dateCount / sampleValues.length > 0.7) return 'date';
    
    return 'string';
  }

  private findUserIdColumns(columns: any[]): string[] {
    const columnNames = typeof columns[0] === 'string' ? columns : columns.map(c => c.name || c);
    return columnNames.filter((name: string) => 
      /user|customer|client|account|member|person|id/i.test(name)
    );
  }

  private findEventColumns(columns: any[]): string[] {
    const columnNames = typeof columns[0] === 'string' ? columns : columns.map(c => c.name || c);
    return columnNames.filter((name: string) => 
      /event|action|activity|behavior|click|view|visit/i.test(name)
    );
  }

  private findTimestampColumns(columns: any[], rows: any[]): string[] {
    const columnNames = typeof columns[0] === 'string' ? columns : columns.map(c => c.name || c);
    return columnNames.filter((name: string) => {
      if (/time|date|timestamp|created|updated|when/i.test(name)) return true;
      
      const sampleValues = rows.slice(0, 5).map(row => row[name]).filter(val => val != null);
      const dateCount = sampleValues.filter(val => !isNaN(new Date(val).getTime())).length;
      return dateCount / Math.max(sampleValues.length, 1) > 0.5;
    });
  }

  private calculateOverallConfidence(validation: any, results: any[]): 'high' | 'medium' | 'low' {
    if (!validation.isValid) return 'low';
    
    const highConfidenceResults = results.filter(r => r.confidence === 'high').length;
    const totalResults = results.length;
    
    if (highConfidenceResults / Math.max(totalResults, 1) > 0.6) return 'high';
    if (highConfidenceResults / Math.max(totalResults, 1) > 0.3) return 'medium';
    return 'low';
  }

  private generateSQLQuery(context: DataAnalysisContext, data: ParsedData): string {
    try {
      const tableName = 'dataset';
      const columns = data.columns.map(col => col.name).join(', ');
      
      let query = `-- Analysis query for: ${context.researchQuestion}\n`;
      query += `SELECT ${columns}\n`;
      query += `FROM ${tableName}\n`;
      
      if (context.researchQuestion.toLowerCase().includes('recent')) {
        const dateColumns = data.summary?.possibleTimestampColumns || [];
        if (dateColumns.length > 0) {
          query += `WHERE ${dateColumns[0]} >= DATE_SUB(NOW(), INTERVAL 30 DAY)\n`;
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
      breakdown.push('FROM: Specifies the source table containing uploaded data');
    }
    
    if (sqlQuery.includes('WHERE')) {
      breakdown.push('WHERE: Applies filters based on research question');
    }
    
    if (sqlQuery.includes('ORDER BY')) {
      breakdown.push('ORDER BY: Sorts results for consistent output');
    }
    
    if (sqlQuery.includes('LIMIT')) {
      breakdown.push('LIMIT: Restricts number of returned rows for performance');
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
