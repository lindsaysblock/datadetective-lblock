
import { DataAnalysisContext, AnalysisResults, ParsedDataFile } from '@/types/data';
import { AnalysisReport } from '@/types/analysis';
import { AnalysisEngine } from './analysisEngine';
import { DataValidator } from '@/utils/analysis/dataValidator';
import { ParsedData } from '@/utils/dataParser';

export class AnalysisCoordinator {
  static async executeAnalysis(context: DataAnalysisContext): Promise<AnalysisReport> {
    console.log('🎯 AnalysisCoordinator: Starting analysis execution');
    
    try {
      // Validate that we have data to analyze
      if (!context.parsedData || !Array.isArray(context.parsedData) || context.parsedData.length === 0) {
        throw new Error('No data provided for analysis');
      }

      const firstDataFile = context.parsedData[0];
      if (!firstDataFile) {
        throw new Error('Invalid data structure provided');
      }

      // Convert ParsedDataFile[] to ParsedData[] for validation
      const parsedDataForValidation: ParsedData[] = context.parsedData.map(file => {
        // Handle different data structure formats
        const rows = file.data || file.rows || [];
        const columns = file.columns || [];
        
        // Create column objects if they're just strings
        const columnObjects = columns.map(col => 
          typeof col === 'string' 
            ? { name: col, type: 'string' as const, samples: [] }
            : col
        );

        return {
          columns: columnObjects,
          rows: rows,
          rowCount: file.rowCount || rows.length || 0,
          fileSize: 0,
          summary: {
            totalRows: file.rowCount || rows.length || 0,
            totalColumns: columns.length,
            possibleUserIdColumns: [],
            possibleEventColumns: [],
            possibleTimestampColumns: []
          }
        };
      });

      // Validate data quality with proper error handling
      let validationResult;
      let completeness = 0;
      
      try {
        const validator = new DataValidator(parsedDataForValidation[0], context.educationalMode);
        validationResult = validator.validate();
        completeness = validationResult.completeness ?? this.calculateCompleteness(parsedDataForValidation[0]);
      } catch (validationError) {
        console.warn('⚠️ Data validation failed, proceeding with default values:', validationError);
        validationResult = {
          isValid: true,
          errors: [],
          warnings: ['Data validation could not be completed'],
          completeness: 80 // Default reasonable completeness
        };
        completeness = 80;
      }
      
      if (!validationResult.isValid && validationResult.errors.length > 0) {
        console.warn('⚠️ Data validation issues found:', validationResult.errors);
      }

      // Execute the main analysis
      const analysisResults = await AnalysisEngine.analyzeData(context);
      
      // Convert to AnalysisReport format
      const report: AnalysisReport = {
        id: `analysis-${Date.now()}`,
        timestamp: new Date(),
        context,
        results: Array.isArray(analysisResults.detailedResults) ? analysisResults.detailedResults.map(result => ({
          id: result.id,
          title: result.title,
          description: result.description,
          confidence: result.confidence,
          timestamp: new Date().toISOString(),
          type: 'summary' as const,
          value: result.value,
          metadata: {}
        })) : [],
        insights: Array.isArray(analysisResults.insights) 
          ? [analysisResults.insights.join('\n\n')] 
          : [analysisResults.insights || 'No insights generated'],
        recommendations: analysisResults.recommendations || [],
        confidence: analysisResults.confidence || 'medium',
        executionTime: Date.now(),
        sqlQuery: analysisResults.sqlQuery,
        queryBreakdown: analysisResults.queryBreakdown?.steps?.map(step => step.description) || [],
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
