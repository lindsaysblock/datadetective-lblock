
import { DataAnalysisContext, AnalysisResults } from '@/types/data';
import { AnalysisCoordinator } from './analysisCoordinator';

export class AnalysisEngine {
  static async analyzeData(context: DataAnalysisContext): Promise<AnalysisResults> {
    console.log('🔍 AnalysisEngine delegating to AnalysisCoordinator');
    
    try {
      const report = await AnalysisCoordinator.executeAnalysis(context);
      
      // Transform new format to legacy format for backward compatibility
      return {
        insights: report.insights.join(' '),
        confidence: report.confidence,
        recommendations: report.recommendations,
        detailedResults: report.results.map(result => ({
          id: result.id,
          title: result.title,
          description: result.description,
          value: result.value,
          insight: result.description,
          confidence: result.confidence
        })),
        sqlQuery: report.sqlQuery || '-- No query generated',
        queryBreakdown: report.queryBreakdown ? {
          steps: report.queryBreakdown.map((step, index) => ({
            step: index + 1,
            title: `Step ${index + 1}`,
            description: step,
            code: step,
            explanation: step
          }))
        } : undefined
      };
    } catch (error) {
      console.error('❌ AnalysisEngine error:', error);
      
      return {
        insights: 'Analysis failed due to an error. Please try again.',
        confidence: 'low',
        recommendations: [
          'Check your data format',
          'Ensure file is not corrupted',
          'Try a different file'
        ],
        detailedResults: [],
        sqlQuery: '-- Analysis failed'
      };
    }
  }
}
