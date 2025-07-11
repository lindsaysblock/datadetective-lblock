
import { ParsedData } from '../dataParser';
import { AnalysisResult } from './types';
import { RowCountAnalyzer } from './analyzers/rowCountAnalyzer';
import { ActionAnalyzer } from './analyzers/actionAnalyzer';
import { TimeAnalyzer } from './analyzers/timeAnalyzer';
import { ProductAnalyzer } from './analyzers/productAnalyzer';

interface AnalysisEngineConfig {
  enableLogging?: boolean;
  maxRetries?: number;
  timeoutMs?: number;
}

export class DataAnalysisEngine {
  private readonly data: ParsedData;
  private readonly config: AnalysisEngineConfig;
  private readonly analyzers: {
    rowCount: RowCountAnalyzer;
    action: ActionAnalyzer;
    time: TimeAnalyzer;
    product: ProductAnalyzer;
  };

  constructor(data: ParsedData, config: AnalysisEngineConfig = {}) {
    this.config = {
      enableLogging: true,
      maxRetries: 3,
      timeoutMs: 30000,
      ...config
    };

    if (this.config.enableLogging) {
      console.log('DataAnalysisEngine initialized with data:', {
        rows: data.rows?.length || 0,
        columns: data.columns?.length || 0,
        fileSize: data.fileSize,
        summary: data.summary
      });
    }
    
    this.data = data;
    this.analyzers = {
      rowCount: new RowCountAnalyzer(data),
      action: new ActionAnalyzer(data),
      time: new TimeAnalyzer(data),
      product: new ProductAnalyzer(data)
    };
  }

  // Individual analysis methods with proper error handling
  analyzeRowCounts(): AnalysisResult[] {
    return this.executeAnalysis('row count', () => this.analyzers.rowCount.analyze());
  }

  analyzeActionBreakdown(): AnalysisResult[] {
    return this.executeAnalysis('action breakdown', () => this.analyzers.action.analyze());
  }

  analyzeTimeTrends(): AnalysisResult[] {
    return this.executeAnalysis('time trends', () => this.analyzers.time.analyze());
  }

  analyzeProducts(): AnalysisResult[] {
    return this.executeAnalysis('product analysis', () => this.analyzers.product.analyze());
  }

  // Main analysis execution with comprehensive error handling
  runCompleteAnalysis(): AnalysisResult[] {
    if (this.config.enableLogging) {
      console.log('🔍 Starting complete data analysis...');
    }

    const allResults: AnalysisResult[] = [];
    const analysisResults = new Map<string, AnalysisResult[]>();
    
    try {
      // Always run row count analysis first (most reliable)
      const rowResults = this.analyzeRowCounts();
      analysisResults.set('rowCount', rowResults);
      allResults.push(...rowResults);

      if (this.config.enableLogging) {
        console.log('✅ Row count analysis completed');
      }

      // Run other analyses with individual error handling
      const analysisTypes = [
        { name: 'action', method: () => this.analyzeActionBreakdown() },
        { name: 'time', method: () => this.analyzeTimeTrends() },
        { name: 'product', method: () => this.analyzeProducts() }
      ];

      analysisTypes.forEach(({ name, method }) => {
        try {
          const results = method();
          analysisResults.set(name, results);
          allResults.push(...results);
          
          if (this.config.enableLogging) {
            console.log(`✅ ${name} analysis completed`);
          }
        } catch (error) {
          if (this.config.enableLogging) {
            console.warn(`⚠️ ${name} analysis failed:`, error);
          }
          
          // Add error result for failed analysis
          allResults.push(this.createErrorResult(`${name}-analysis-error`, error));
        }
      });

    } catch (criticalError) {
      console.error('❌ Critical analysis failure:', criticalError);
      allResults.push(this.createErrorResult('critical-analysis-error', criticalError));
    }

    if (this.config.enableLogging) {
      console.log('🎯 Complete analysis finished with', allResults.length, 'results');
    }

    return this.validateResults(allResults);
  }

  private executeAnalysis(analysisName: string, analysisFunction: () => AnalysisResult[]): AnalysisResult[] {
    if (this.config.enableLogging) {
      console.log(`Running ${analysisName} analysis...`);
    }

    try {
      const results = analysisFunction();
      
      if (this.config.enableLogging) {
        console.log(`${analysisName} analysis completed:`, results.length, 'results');
      }
      
      return results;
    } catch (error) {
      console.error(`${analysisName} analysis failed:`, error);
      return [this.createErrorResult(`${analysisName.replace(/\s+/g, '-')}-error`, error)];
    }
  }

  private createErrorResult(id: string, error: unknown): AnalysisResult {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return {
      id,
      title: 'Analysis Error',
      description: 'An error occurred during analysis',
      value: 0,
      insight: `Error: ${errorMessage}`,
      confidence: 'low'
    };
  }

  private validateResults(results: AnalysisResult[]): AnalysisResult[] {
    return results.filter(result => {
      // Validate required fields
      const hasRequiredFields = result.id && result.title && result.description && result.insight;
      const hasValidConfidence = ['high', 'medium', 'low'].includes(result.confidence);
      
      if (!hasRequiredFields || !hasValidConfidence) {
        console.warn('Invalid analysis result:', result);
        return false;
      }
      
      return true;
    });
  }

  // Utility method to get analysis summary
  getAnalysisSummary(): {
    totalResults: number;
    highConfidenceResults: number;
    analysisTypes: string[];
    dataQuality: 'high' | 'medium' | 'low';
  } {
    const results = this.runCompleteAnalysis();
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

// Re-export types for backward compatibility
export type { AnalysisResult };
