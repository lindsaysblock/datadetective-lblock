
export interface AnalysisResult {
  id: string;
  title: string;
  description: string;
  value: number | string | Record<string, any> | any[];
  insight: string;
  confidence: 'high' | 'medium' | 'low';
  chartType?: 'bar' | 'line' | 'pie' | 'table';
  chartData?: Array<{
    name: string;
    value: number;
    percentage?: string;
  }>;
  metadata?: Record<string, any>;
  type?: 'numeric' | 'categorical' | 'chart' | 'summary' | 'statistical' | 'distribution';
  timestamp?: string;
  categories?: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
}

export interface AnalysisSummary {
  totalResults: number;
  highConfidenceResults: number;
  analysisTypes: string[];
  dataQuality: 'high' | 'medium' | 'low';
}

export interface AnalysisConfig {
  enableLogging?: boolean;
  maxRetries?: number;
  timeoutMs?: number;
  qualityThreshold?: number;
}

export interface StatisticalMetrics {
  average: number;
  minimum: number;
  maximum: number;
  standardDeviation: number;
  count: number;
}

export interface CategoricalMetrics {
  uniqueCategories: number;
  totalRecords: number;
  topCategory: string;
  topCategoryCount: number;
  diversity: number;
}

export interface TemporalMetrics {
  timeSpan: string;
  earliestDate: string;
  latestDate: string;
  validDateCount: number;
}
