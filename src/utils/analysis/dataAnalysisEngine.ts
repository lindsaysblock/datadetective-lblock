import { ParsedData } from '../dataParser';
import { AnalysisResult, AnalysisConfig, AnalysisSummary } from './types';
import { AnalyticsEngineManager } from '../analytics/analyticsEngineManager';
import { RowCountAnalyzer } from './analyzers/rowCountAnalyzer';
import { ActionAnalyzer } from './analyzers/actionAnalyzer';
import { TimeAnalyzer } from './analyzers/timeAnalyzer';
import { ProductAnalyzer } from './analyzers/productAnalyzer';

export class DataAnalysisEngine {
  private readonly data: ParsedData;
  private readonly config: AnalysisConfig;
  private readonly analyticsManager: AnalyticsEngineManager;
  private readonly analyzers: {
    rowCount: RowCountAnalyzer;
    action: ActionAnalyzer;
    time: TimeAnalyzer;
    product: ProductAnalyzer;
  };

  constructor(data: ParsedData, config: AnalysisConfig = {}) {
    this.config = {
      enableLogging: true,
      maxRetries: 3,
      timeoutMs: 30000,
      qualityThreshold: 0.7,
      ...config
    };

    this.data = data;
    this.analyticsManager = new AnalyticsEngineManager(this.config.enableLogging);
    
    // Initialize analyzers
    this.analyzers = {
      rowCount: new RowCountAnalyzer(data),
      action: new ActionAnalyzer(data),
      time: new TimeAnalyzer(data),
      product: new ProductAnalyzer(data)
    };

    if (this.config.enableLogging) {
      console.log('DataAnalysisEngine initialized with:', {
        rows: data.rows?.length || 0,
        columns: data.columns?.length || 0,
        fileSize: data.fileSize
      });
    }
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
    
    try {
      // Use analytics manager for basic analysis
      const basicResults = this.analyticsManager.runCompleteAnalysis(this.data);
      allResults.push(...basicResults);

      // Run specialized analyzers with error handling
      const analysisTypes = [
        { name: 'row count', method: () => this.analyzeRowCounts() },
        { name: 'action', method: () => this.analyzeActionBreakdown() },
        { name: 'time', method: () => this.analyzeTimeTrends() },
        { name: 'product', method: () => this.analyzeProducts() }
      ];

      analysisTypes.forEach(({ name, method }) => {
        try {
          const results = method();
          allResults.push(...results);
          
          if (this.config.enableLogging) {
            console.log(`✅ ${name} analysis completed`);
          }
        } catch (error) {
          if (this.config.enableLogging) {
            console.warn(`⚠️ ${name} analysis failed:`, error);
          }
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

  // Utility method to get analysis summary
  getAnalysisSummary(): AnalysisSummary {
    const results = this.runCompleteAnalysis();
    return this.analyticsManager.getAnalysisSummary(results);
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
      const hasRequiredFields = result.id && result.title && result.description && result.insight;
      const hasValidConfidence = ['high', 'medium', 'low'].includes(result.confidence);
      
      if (!hasRequiredFields || !hasValidConfidence) {
        console.warn('Invalid analysis result:', result);
        return false;
      }
      
      return true;
    });
  }
}

export type { AnalysisResult, AnalysisSummary };
