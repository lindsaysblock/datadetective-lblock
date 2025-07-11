
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

export interface SummaryAnalysisResult extends BaseAnalysisResult {
  type: 'summary';
  value: string;
}

export interface StatisticalAnalysisResult extends BaseAnalysisResult {
  type: 'statistical';
  value: string;
}

export interface DistributionAnalysisResult extends BaseAnalysisResult {
  type: 'distribution';
  value: string;
}

export type AnalysisResult = NumericAnalysisResult | CategoricalAnalysisResult | ChartAnalysisResult | SummaryAnalysisResult | StatisticalAnalysisResult | DistributionAnalysisResult;

export interface AnalysisContext {
  researchQuestion: string;
  additionalContext?: string;
  dataSource: 'file' | 'database' | 'api' | 'paste';
  educationalMode: boolean;
}

export interface AnalysisReport {
  id: string;
  timestamp: Date;
  context: DataAnalysisContext;
  results: AnalysisResult[];
  insights: string[];
  recommendations: string[];
  confidence: 'high' | 'medium' | 'low';
  executionTime?: number;
  sqlQuery?: string;
  queryBreakdown?: string[];
  dataQuality?: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    completeness: number;
  };
}

// Legacy compatibility types
export interface DataInsight {
  id: string;
  title: string;
  description: string;
  value: any;
  confidence: 'high' | 'medium' | 'low';
}

// Import the DataAnalysisContext to avoid circular dependencies
import { DataAnalysisContext } from './data';
