
/**
 * QA System Type Definitions
 * Core interfaces and types for QA testing system
 */

/** QA test result interface */
export interface QATestResult {
  testName: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  performance?: number;
  suggestions?: string[];
  isDataRelated?: boolean;
  category?: string;
  error?: string;
  optimizations?: string[];
  fullDetails?: string;
  stackTrace?: string;
  fixSuggestions?: string[];
  relatedFiles?: string[];
}

/** QA report interface */
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

/** Refactoring recommendation interface */
export interface RefactoringRecommendation {
  file: string;
  type: 'size' | 'complexity' | 'duplication' | 'performance';
  priority: 'high' | 'medium' | 'low';
  description: string;
  suggestion: string;
}
