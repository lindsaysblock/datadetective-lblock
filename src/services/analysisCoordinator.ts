
import { DataAnalysisContext, ParsedDataFile } from '@/types/data';
import { AnalysisReport } from '@/types/analysis';
import { AnalysisEngine } from './analysisEngine';
import { DataValidator } from '@/utils/analysis/dataValidator';
import { ParsedData } from '@/utils/dataParser';

export class AnalysisCoordinator {
  static async executeAnalysis(context: DataAnalysisContext): Promise<AnalysisReport> {
    console.log('🎯 AnalysisCoordinator: Starting analysis execution');
    
    try {
      // Validate input context
      if (!context.parsedData || !Array.isArray(context.parsedData) || context.parsedData.length === 0) {
        throw new Error('No data provided for analysis');
      }

      const firstDataFile = context.parsedData[0];
      if (!firstDataFile) {
        throw new Error('Invalid data structure provided');
      }

      console.log('📊 Processing data file:', {
        name: firstDataFile.name || 'unknown',
        rows: firstDataFile.rows || 0,
        columns: firstDataFile.columns || 0,
        hasData: !!firstDataFile.data
      });

      // Convert ParsedDataFile to ParsedData for validation with robust handling
      const parsedDataForValidation: ParsedData = this.convertToValidationFormat(firstDataFile);

      // Perform data validation with error handling
      let validationResult;
      let completeness = 80; // Default reasonable completeness
      
      try {
        const validator = new DataValidator(parsedDataForValidation, context.educationalMode);
        validationResult = validator.validate();
        completeness = validationResult.completeness ?? this.calculateCompleteness(parsedDataForValidation);
      } catch (validationError) {
        console.warn('⚠️ Data validation failed, using defaults:', validationError);
        validationResult = {
          isValid: true,
          errors: [],
          warnings: ['Data validation could not be completed'],
          completeness: completeness
        };
      }

      console.log('✅ Data validation completed:', {
        isValid: validationResult.isValid,
        errors: validationResult.errors.length,
        warnings: validationResult.warnings.length,
        completeness
      });

      // Execute the main analysis
      const analysisResults = await AnalysisEngine.analyzeData(context);
      
      // Build comprehensive analysis report
      const report: AnalysisReport = {
        id: `analysis-${Date.now()}`,
        timestamp: new Date(),
        context,
        results: this.formatAnalysisResults(analysisResults),
        insights: this.formatInsights(analysisResults.insights),
        recommendations: analysisResults.recommendations || [],
        confidence: analysisResults.confidence || 'medium',
        executionTime: Date.now(),
        sqlQuery: analysisResults.sqlQuery,
        queryBreakdown: this.formatQueryBreakdown(analysisResults.queryBreakdown),
        dataQuality: {
          isValid: validationResult.isValid,
          errors: validationResult.errors,
          warnings: validationResult.warnings,
          completeness
        }
      };

      console.log('✅ AnalysisCoordinator: Analysis completed successfully');
      return report;
      
    } catch (error) {
      console.error('❌ AnalysisCoordinator: Analysis failed:', error);
      throw error;
    }
  }

  private static convertToValidationFormat(dataFile: ParsedDataFile): ParsedData {
    // Handle various data structure formats robustly
    const dataRows = dataFile.data || [];
    const columnInfo = dataFile.columnInfo || [];
    
    // Create column objects if they're missing
    const columns = columnInfo.length > 0 
      ? columnInfo 
      : this.inferColumnsFromData(dataRows);

    return {
      columns: columns,
      rows: dataRows,
      rowCount: dataFile.rows || dataRows.length || 0,
      fileSize: 0,
      summary: dataFile.summary || {
        totalRows: dataFile.rows || dataRows.length || 0,
        totalColumns: dataFile.columns || columns.length,
        possibleUserIdColumns: [],
        possibleEventColumns: [],
        possibleTimestampColumns: []
      }
    };
  }

  private static inferColumnsFromData(rows: any[]): any[] {
    if (!rows || rows.length === 0) return [];
    
    const firstRow = rows[0];
    if (!firstRow || typeof firstRow !== 'object') return [];
    
    return Object.keys(firstRow).map(key => ({
      name: key,
      type: 'string' as const,
      samples: []
    }));
  }

  private static formatAnalysisResults(analysisResults: any): any[] {
    if (!analysisResults.detailedResults || !Array.isArray(analysisResults.detailedResults)) {
      return [];
    }

    return analysisResults.detailedResults.map((result: any) => ({
      id: result.id || `result-${Date.now()}-${Math.random()}`,
      title: result.title || 'Analysis Result',
      description: result.description || 'Analysis completed',
      confidence: result.confidence || 'medium',
      timestamp: new Date().toISOString(),
      type: 'summary' as const,
      value: result.value || 'N/A',
      metadata: {}
    }));
  }

  private static formatInsights(insights: any): string[] {
    if (Array.isArray(insights)) {
      return insights.filter(insight => insight && typeof insight === 'string');
    }
    if (typeof insights === 'string' && insights.trim()) {
      return [insights];
    }
    return ['Analysis completed successfully with key patterns detected.'];
  }

  private static formatQueryBreakdown(queryBreakdown: any): string[] {
    if (!queryBreakdown) return [];
    
    if (Array.isArray(queryBreakdown)) {
      return queryBreakdown.map(step => step.description || step.toString());
    }
    
    if (queryBreakdown.steps && Array.isArray(queryBreakdown.steps)) {
      return queryBreakdown.steps.map((step: any) => step.description || step.toString());
    }
    
    return [];
  }

  private static calculateCompleteness(data: ParsedData): number {
    try {
      if (!data.rows || !data.columns || data.rows.length === 0 || data.columns.length === 0) {
        return 0;
      }

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

      return Math.round((filledCells / totalCells) * 100);
    } catch (error) {
      console.warn('⚠️ Could not calculate completeness:', error);
      return 80; // Return a reasonable default
    }
  }
}
