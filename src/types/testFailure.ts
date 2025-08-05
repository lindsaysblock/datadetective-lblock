/**
 * Test Failure Details and Fix System Types
 * For Plan B: Fix & Re-run functionality
 */

export interface TestFailureDetails {
  testId: string;
  testName: string;
  errorType: 'timeout' | 'validation' | 'api' | 'auth' | 'performance' | 'memory' | 'component' | 'data' | 'security';
  rootCause: string;
  severity: 'critical' | 'warning' | 'minor';
  errorMessage: string;
  stackTrace?: string;
  relatedFiles: string[];
  fixSuggestions: string[];
  stepByStepFix: string[];
  estimatedFixTime: number; // in minutes
  canAutoFix: boolean;
  retryCount: number;
  lastRetryAt?: Date;
}

export interface FixStrategy {
  id: string;
  name: string;
  description: string;
  patterns: string[];
  errorTypes: TestFailureDetails['errorType'][];
  fixFunction: (testName: string, errorMessage: string) => Promise<FixResult>;
  estimatedTime: number;
  successRate: number;
}

export interface FixResult {
  success: boolean;
  message: string;
  appliedFixes: string[];
  timeElapsed: number;
  requiresRetest: boolean;
  newTestStatus?: 'pass' | 'fail' | 'warning';
}

export interface TestExecutionState {
  testId: string;
  status: 'idle' | 'running' | 'fixing' | 'completed' | 'failed';
  progress: number;
  currentAction: string;
  errors: string[];
  fixAttempts: number;
  lastUpdated: Date;
}