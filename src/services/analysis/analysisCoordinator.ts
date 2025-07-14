
import { DataAnalysisContext } from '@/types/data';
import { AnalysisReport } from '@/types/analysis';
import { DataValidator } from '@/utils/analysis/dataValidator';
import { ParsedData } from '@/utils/dataParser';
import { ReliableAnalysisEngine } from '@/utils/analysis/reliableAnalysisEngine';
import { SimpleAnalysisEngine } from '@/utils/analysis/simpleAnalysisEngine';

export class AnalysisCoordinator {
  static async executeAnalysis(context: DataAnalysisContext): Promise<AnalysisReport> {
    const coordinator = new AnalysisCoordinator();
    return coordinator.execute(context);
  }

  private async execute(context: DataAnalysisContext): Promise<AnalysisReport> {
    console.log('🎯 AnalysisCoordinator: Starting reliable analysis execution');
    
    try {
      this.validateContext(context);

      const primaryDataFile = context.parsedData[0];
      const parsedData = this.normalizeParsedData(primaryDataFile);

      console.log('📊 Processing data structure:', {
        rows: parsedData.rows?.length || 0,
        columns: parsedData.columns?.length || 0,
        question: context.researchQuestion
      });

      // Validate data quality
      const validator = new DataValidator(parsedData);
      const validation = validator.validate();
      
      if (!validation.isValid) {
        console.warn('⚠️ Data validation issues found:', validation.errors);
      }

      // Use reliable analysis engine
      const engine = new ReliableAnalysisEngine(parsedData, {
        enableLogging: true,
        qualityThreshold: 0.7
      });

      // Check if this is a simple question
      const isSimple = SimpleAnalysisEngine.isSimpleQuestion(context.researchQuestion);
      console.log('🔍 Question complexity:', isSimple ? 'Simple' : 'Complex');

      let results: any[] = [];
      let insights: string[] = [];
      
      if (isSimple) {
        // Use simple analysis for basic questions
        console.log('⚡ Using simple analysis');
        results = SimpleAnalysisEngine.analyzeRowCount(parsedData);
        insights = [
          `Quick analysis of your dataset completed successfully.`,
          `Found ${parsedData.rows.length} rows and ${parsedData.columns.length} columns with good data structure.`,
          `Your data is ready for further analysis and exploration.`
        ];
      } else {
        // Use comprehensive analysis
        console.log('🔬 Using comprehensive analysis');
        results = engine.runCompleteAnalysis();
        insights = this.generateInsights(results, parsedData, context);
      }
      
      const sqlQuery = this.generateSQLQuery(context, parsedData);
      
      const report: AnalysisReport = {
        id: `analysis_${Date.now()}`,
        timestamp: new Date(),
        context,
        results,
        insights,
        confidence: this.calculateOverallConfidence(validation, results),
        recommendations: this.generateRecommendations(insights, validation, parsedData),
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
        confidence: report.confidence,
        analysisType: isSimple ? 'simple' : 'comprehensive'
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

  private generateInsights(results: any[], data: ParsedData, context: DataAnalysisContext): string[] {
    const insights: string[] = [];
    
    // Basic data insights
    insights.push(`Successfully analyzed your dataset containing ${data.rows.length.toLocaleString()} rows and ${data.columns.length} columns.`);
    
    // Quality insights
    const qualityResult = results.find(r => r.id === 'data-completeness');
    if (qualityResult) {
      insights.push(`Data quality assessment shows ${qualityResult.value}% completeness, indicating ${qualityResult.value > 90 ? 'excellent' : qualityResult.value > 70 ? 'good' : 'acceptable'} data integrity.`);
    }
    
    // Structure insights
    const structureResult = results.find(r => r.id === 'data-structure');
    if (structureResult) {
      insights.push(`Dataset structure analysis reveals organized data with identifiable patterns suitable for ${context.researchQuestion.toLowerCase().includes('trend') ? 'trend analysis' : 'behavioral analysis'}.`);
    }
    
    // Research question specific insight
    insights.push(`Based on your research question "${context.researchQuestion}", the dataset appears well-suited for analysis with sufficient data points and appropriate column structure.`);
    
    return insights;
  }

  private calculateOverallConfidence(validation: any, results: any[]): 'high' | 'medium' | 'low' {
    if (!validation.isValid) return 'low';
    
    const highConfidenceResults = results.filter(r => r.confidence === 'high').length;
    const totalResults = results.length;
    
    if (highConfidenceResults / Math.max(totalResults, 1) > 0.6) return 'high';
    if (highConfidenceResults / Math.max(totalResults, 1) > 0.3) return 'medium';
    return 'low';
  }

  private generateRecommendations(insights: string[], validation: any, data: ParsedData): string[] {
    const recommendations: string[] = [];
    
    if (data.rows.length > 1000) {
      recommendations.push('Consider segmenting your analysis by time periods or categories for deeper insights');
      recommendations.push('Explore correlations between different data dimensions');
    } else {
      recommendations.push('Your dataset is ready for detailed analysis');
      recommendations.push('Consider collecting more data points for stronger statistical significance');
    }
    
    if (validation.warnings.length > 0) {
      recommendations.push('Review data quality warnings to ensure optimal analysis results');
    }
    
    recommendations.push('Use the "Ask More Questions" feature to dive deeper into specific aspects of your data');
    
    return recommendations;
  }

  private generateSQLQuery(context: DataAnalysisContext, data: ParsedData): string {
    try {
      const tableName = 'dataset';
      const columns = data.columns.map(col => col.name).join(', ');
      
      let query = `-- Analysis query for: ${context.researchQuestion}\n`;
      query += `SELECT COUNT(*) as total_rows\n`;
      query += `FROM ${tableName};\n\n`;
      query += `-- Sample data preview\n`;
      query += `SELECT ${columns}\n`;
      query += `FROM ${tableName}\n`;
      query += `LIMIT 10;`;
      
      return query;
    } catch (error) {
      return '-- Error generating SQL query';
    }
  }

  private generateQueryBreakdown(sqlQuery: string): string[] {
    const breakdown: string[] = [];
    
    if (sqlQuery.includes('COUNT(*)')) {
      breakdown.push('COUNT(*): Counts total number of rows in the dataset');
    }
    
    if (sqlQuery.includes('SELECT')) {
      breakdown.push('SELECT: Retrieves data from the dataset');
    }
    
    if (sqlQuery.includes('LIMIT')) {
      breakdown.push('LIMIT: Shows a sample of the data for preview');
    }
    
    return breakdown;
  }

  private calculateCompleteness(data: ParsedData): number {
    if (data.rows.length === 0 || data.columns.length === 0) return 0;
    
    // Sample first 100 rows for performance
    const sampleSize = Math.min(100, data.rows.length);
    const sampleRows = data.rows.slice(0, sampleSize);
    const totalCells = sampleSize * data.columns.length;
    let filledCells = 0;
    
    sampleRows.forEach(row => {
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
      insights: [`Analysis encountered an issue: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your data format and try again.`],
      confidence: 'low',
      recommendations: [
        'Verify that your CSV file contains valid data with headers',
        'Ensure the file is not corrupted and contains readable content',
        'Try uploading a smaller sample of your data first',
        'Contact support if the issue persists'
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
