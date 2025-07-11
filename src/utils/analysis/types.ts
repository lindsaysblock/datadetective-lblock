
export interface AnalysisResult {
  id: string;
  title: string;
  description: string;
  value: number | string;
  insight: string;
  confidence: 'high' | 'medium' | 'low';
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
