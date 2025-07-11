
export interface BaseAnalysisResult {
  id: string;
  title: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface NumericAnalysisResult extends BaseAnalysisResult {
  type: 'numeric';
  value: number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
}

export interface CategoricalAnalysisResult extends BaseAnalysisResult {
  type: 'categorical';
  value: string;
  categories?: Array<{ name: string; count: number; percentage: number }>;
}

export interface ChartAnalysisResult extends BaseAnalysisResult {
  type: 'chart';
  value: any;
  chartType: 'bar' | 'line' | 'pie' | 'table';
  chartData: Array<{
    name: string;
    value: number;
    percentage?: number;
  }>;
}

export type AnalysisResult = NumericAnalysisResult | CategoricalAnalysisResult | ChartAnalysisResult;

export interface AnalysisContext {
  researchQuestion: string;
  additionalContext?: string;
  dataSource: 'file' | 'database' | 'api' | 'paste';
  educationalMode: boolean;
}

export interface AnalysisReport {
  id: string;
  context: AnalysisContext;
  results: AnalysisResult[];
  insights: string;
  recommendations: string[];
  confidence: 'high' | 'medium' | 'low';
  executionTime: number;
  sqlQuery?: string;
  queryBreakdown?: {
    steps: Array<{
      step: number;
      title: string;
      description: string;
      code: string;
      explanation: string;
    }>;
  };
}
