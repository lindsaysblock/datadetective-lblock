
import { DataAnalysisContext, AnalysisResults, ParsedDataFile } from '@/types/data';
import { AnalysisReport } from '@/types/analysis';
import { AnalysisEngine } from './analysisEngine';
import { DataValidator } from '@/utils/analysis/dataValidator';
import { ParsedData } from '@/utils/dataParser';

export class AnalysisCoordinator {
  static async executeAnalysis(context: DataAnalysisContext): Promise<AnalysisReport> {
    console.log('🎯 AnalysisCoordinator: Starting analysis execution');
    
    try {
      // Convert ParsedDataFile[] to ParsedData[] for validation
      const parsedDataForValidation: ParsedData[] = context.parsedData.map(file => ({
        columns: file.columns.map(colName => ({
          name: colName,
          type: 'string' as const,
          samples: []
        })),
        rows: file.data || file.rows,
        rowCount: file.rowCount,
        fileSize: 0,
        summary: {
          totalRows: file.rowCount,
          totalColumns: file.columns.length,
          possibleUserIdColumns: [],
          possibleEventColumns: [],
          possibleTimestampColumns: []
        }
      }));

      // Validate data quality first
      const validator = new DataValidator(parsedDataForValidation[0], context.educationalMode);
      const validationResult = validator.validate();
      
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
          completeness: validationResult.completeness || 0
        }
      };

      console.log('✅ AnalysisCoordinator: Analysis completed successfully');
      return report;
      
    } catch (error) {
      console.error('❌ AnalysisCoordinator: Analysis failed:', error);
      throw error;
    }
  }
}
