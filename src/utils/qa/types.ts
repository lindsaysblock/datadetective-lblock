
export interface QATestResult {
  testName: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  performance?: number;
  suggestions?: string[];
  isDataRelated?: boolean;
  category?: string;
}

export interface QAReport {
  overall: 'pass' | 'fail' | 'warning';
  timestamp: Date;
  totalTests: number;
  passed: number;
  failed: number;
  warnings: number;
  results: QATestResult[];
  performanceMetrics: PerformanceMetrics;
  refactoringRecommendations: RefactoringRecommendation[];
}

export interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  bundleSize: number;
  componentCount: number;
  largeFiles: string[];
  qaSystemDuration?: number;
  testExecutionMetrics?: Record<string, number>;
  systemEfficiency?: number;
  memoryEfficiency?: number;
  codebaseHealth?: number;
  refactoringReadiness?: number;
  dynamicAnalysisEnabled?: boolean;
  enhancedMode?: boolean;
  duration?: number;
}

export interface RefactoringRecommendation {
  file: string;
  type: 'size' | 'complexity' | 'duplication' | 'performance';
  priority: 'high' | 'medium' | 'low';
  description: string;
  suggestion: string;
}
