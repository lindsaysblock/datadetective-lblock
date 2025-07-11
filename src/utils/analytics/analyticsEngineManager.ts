
import { ParsedData } from '../dataParser';
import { AnalysisResult, AnalysisSummary } from '../analysis/types';
import { AnalyticsValidator } from './analyticsValidator';

export class AnalyticsEngineManager {
  private enableLogging: boolean;

  constructor(enableLogging = true) {
    this.enableLogging = enableLogging;
  }

  async runCompleteAnalysis(data: ParsedData): Promise<AnalysisResult[]> {
    if (this.enableLogging) {
      console.log('🔍 Starting analytics engine analysis...');
    }

    if (!AnalyticsValidator.validateParsedData(data)) {
      console.warn('Invalid data provided to analytics engine');
      return [];
    }

    const results: AnalysisResult[] = [];

    try {
      // Basic data analysis
      results.push(...this.analyzeBasicMetrics(data));
      
      // Advanced analysis if data quality is sufficient
      const dataQuality = AnalyticsValidator.calculateDataQuality(data);
      if (dataQuality !== 'low') {
        results.push(...this.analyzeAdvancedMetrics(data));
      }

      const sanitizedResults = AnalyticsValidator.sanitizeResults(results);
      
      if (this.enableLogging) {
        console.log(`✅ Analysis complete: ${sanitizedResults.length} results generated`);
      }

      return sanitizedResults;
    } catch (error) {
      console.error('Analytics engine error:', error);
      return this.createErrorResult(error);
    }
  }

  private analyzeBasicMetrics(data: ParsedData): AnalysisResult[] {
    const results: AnalysisResult[] = [];

    // Row count analysis
    results.push({
      id: 'total-rows',
      title: 'Total Rows',
      description: 'Total number of data rows',
      value: data.rowCount,
      insight: `Dataset contains ${data.rowCount} rows of data`,
      confidence: 'high'
    });

    // Column analysis
    results.push({
      id: 'total-columns',
      title: 'Total Columns',
      description: 'Total number of data columns',
      value: data.columns.length,
      insight: `Dataset has ${data.columns.length} columns`,
      confidence: 'high'
    });

    return results;
  }

  private analyzeAdvancedMetrics(data: ParsedData): AnalysisResult[] {
    const results: AnalysisResult[] = [];

    // Data completeness
    const dataQuality = AnalyticsValidator.calculateDataQuality(data);
    results.push({
      id: 'data-quality',
      title: 'Data Quality',
      description: 'Overall data quality assessment',
      value: dataQuality,
      insight: `Data quality is ${dataQuality}`,
      confidence: dataQuality === 'high' ? 'high' : 'medium'
    });

    return results;
  }

  private createErrorResult(error: unknown): AnalysisResult[] {
    return [{
      id: 'analysis-error',
      title: 'Analysis Error',
      description: 'An error occurred during analysis',
      value: 0,
      insight: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      confidence: 'low'
    }];
  }

  getAnalysisSummary(results: AnalysisResult[]): AnalysisSummary {
    const highConfidenceCount = results.filter(r => r.confidence === 'high').length;
    const analysisTypes = [...new Set(results.map(r => r.id.split('-')[0]))];
    
    let dataQuality: 'high' | 'medium' | 'low' = 'low';
    if (highConfidenceCount > results.length * 0.7) {
      dataQuality = 'high';
    } else if (highConfidenceCount > results.length * 0.4) {
      dataQuality = 'medium';
    }

    return {
      totalResults: results.length,
      highConfidenceResults: highConfidenceCount,
      analysisTypes,
      dataQuality
    };
  }
}
