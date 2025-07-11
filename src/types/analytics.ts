
export interface AnalyticsMetrics {
  totalRows: number;
  totalColumns: number;
  dataCompleteness: number;
  uniqueValues: Record<string, number>;
  dataTypes: Record<string, string>;
  qualityScore: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  confidence: 'high' | 'medium' | 'low';
}

export interface AnalyticsPipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  metrics: AnalyticsMetrics;
}

export interface PipelineStage {
  id: string;
  name: string;
  type: 'validation' | 'analysis' | 'aggregation' | 'export';
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: number;
  error?: string;
}

export interface AnalyticsConfig {
  enableValidation: boolean;
  enableErrorRecovery: boolean;
  maxRetries: number;
  timeoutMs: number;
  qualityThreshold: number;
}
