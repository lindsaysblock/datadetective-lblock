
import { ParsedData } from '../dataParser';
import { AnalysisResult } from './types';
import { RowCountAnalyzer } from './analyzers/rowCountAnalyzer';
import { ActionAnalyzer } from './analyzers/actionAnalyzer';
import { TimeAnalyzer } from './analyzers/timeAnalyzer';
import { ProductAnalyzer } from './analyzers/productAnalyzer';

export class DataAnalysisEngine {
  private data: ParsedData;
  private analyzers: {
    rowCount: RowCountAnalyzer;
    action: ActionAnalyzer;
    time: TimeAnalyzer;
    product: ProductAnalyzer;
  };

  constructor(data: ParsedData) {
    this.data = data;
    this.analyzers = {
      rowCount: new RowCountAnalyzer(data),
      action: new ActionAnalyzer(data),
      time: new TimeAnalyzer(data),
      product: new ProductAnalyzer(data)
    };
  }

  // Individual analysis methods
  analyzeRowCounts(): AnalysisResult[] {
    return this.analyzers.rowCount.analyze();
  }

  analyzeActionBreakdown(): AnalysisResult[] {
    return this.analyzers.action.analyze();
  }

  analyzeTimeTrends(): AnalysisResult[] {
    return this.analyzers.time.analyze();
  }

  analyzeProducts(): AnalysisResult[] {
    return this.analyzers.product.analyze();
  }

  // Run all analyses
  runCompleteAnalysis(): AnalysisResult[] {
    const allResults: AnalysisResult[] = [];
    
    try {
      allResults.push(...this.analyzeRowCounts());
      allResults.push(...this.analyzeActionBreakdown());
      allResults.push(...this.analyzeTimeTrends());
      allResults.push(...this.analyzeProducts());
    } catch (error) {
      console.error('Analysis error:', error);
      allResults.push({
        id: 'analysis-error',
        title: 'Analysis Error',
        description: 'Error occurred during analysis',
        value: error,
        insight: 'Some analyses could not be completed due to data format issues',
        confidence: 'low'
      });
    }

    return allResults;
  }
}

// Re-export types for backward compatibility
export type { AnalysisResult };
