import { TestFix, TestOptimization } from '../utils/testing/testFixService';

export interface TestResultCard {
  name: string;
  status: 'success' | 'warning' | 'error' | 'running';
  details: string;
  timestamp: string;
  optimizations?: string[];
  fixes?: TestFix[];
  availableOptimizations?: TestOptimization[];
  failedTests?: number;
  warningTests?: number;
  expandedData?: {
    testResults?: any[];
    testSuites?: string[];
    coverage?: number;
  };
  metrics?: {
    testsRun?: number;
    passed?: number;
    failed?: number;
    warnings?: number;
    coverage?: number;
    duration?: number;
    efficiency?: string;
    memory?: string;
  };
}