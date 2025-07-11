
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
