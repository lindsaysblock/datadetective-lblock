
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
    console.log('DataAnalysisEngine initialized with data:', {
      rows: data.rows?.length || 0,
      columns: data.columns?.length || 0,
      fileSize: data.fileSize,
      summary: data.summary
    });
    
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
    console.log('Running row count analysis...');
    try {
      const results = this.analyzers.rowCount.analyze();
      console.log('Row count analysis completed:', results.length, 'results');
      return results;
    } catch (error) {
      console.error('Row count analysis failed:', error);
      return [{
        id: 'row-count-error',
        title: 'Row Count Analysis Error',
        description: 'Failed to analyze row counts',
        value: 0,
        insight: `Error analyzing row counts: ${error}`,
        confidence: 'low'
      }];
    }
  }

  analyzeActionBreakdown(): AnalysisResult[] {
    console.log('Running action breakdown analysis...');
    try {
      const results = this.analyzers.action.analyze();
      console.log('Action breakdown analysis completed:', results.length, 'results');
      return results;
    } catch (error) {
      console.error('Action breakdown analysis failed:', error);
      return [];
    }
  }

  analyzeTimeTrends(): AnalysisResult[] {
    console.log('Running time trends analysis...');
    try {
      const results = this.analyzers.time.analyze();
      console.log('Time trends analysis completed:', results.length, 'results');
      return results;
    } catch (error) {
      console.error('Time trends analysis failed:', error);
      return [];
    }
  }

  analyzeProducts(): AnalysisResult[] {
    console.log('Running product analysis...');
    try {
      const results = this.analyzers.product.analyze();
      console.log('Product analysis completed:', results.length, 'results');
      return results;
    } catch (error) {
      console.error('Product analysis failed:', error);
      return [];
    }
  }

  // Run all analyses
  runCompleteAnalysis(): AnalysisResult[] {
    console.log('🔍 Starting complete data analysis...');
    const allResults: AnalysisResult[] = [];
    
    try {
      // Always run row count analysis first (this should always work)
      const rowResults = this.analyzeRowCounts();
      allResults.push(...rowResults);
      console.log('✅ Row count analysis completed');

      // Try other analyses but don't fail if they don't work
      try {
        const actionResults = this.analyzeActionBreakdown();
        allResults.push(...actionResults);
        console.log('✅ Action breakdown analysis completed');
      } catch (error) {
        console.warn('⚠️ Action breakdown analysis failed:', error);
      }

      try {
        const timeResults = this.analyzeTimeTrends();
        allResults.push(...timeResults);
        console.log('✅ Time trends analysis completed');
      } catch (error) {
        console.warn('⚠️ Time trends analysis failed:', error);
      }

      try {
        const productResults = this.analyzeProducts();
        allResults.push(...productResults);
        console.log('✅ Product analysis completed');
      } catch (error) {
        console.warn('⚠️ Product analysis failed:', error);
      }

    } catch (error) {
      console.error('❌ Complete analysis failed:', error);
      allResults.push({
        id: 'analysis-error',
        title: 'Analysis Error',
        description: 'Error occurred during analysis',
        value: error,
        insight: 'Some analyses could not be completed due to data format issues',
        confidence: 'low'
      });
    }

    console.log('🎯 Complete analysis finished with', allResults.length, 'results');
    return allResults;
  }
}

// Re-export types for backward compatibility
export type { AnalysisResult };
