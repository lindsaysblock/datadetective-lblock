
export interface AnalysisResult {
  id: string;
  title: string;
  description: string;
  value: any;
  chartType?: 'bar' | 'line' | 'pie' | 'table';
  chartData?: any[];
  insight: string;
  confidence: 'high' | 'medium' | 'low';
}
