
// Re-export unified types from core module to maintain compatibility
export * from './core/TestResultUnifier';

// Legacy interface for backward compatibility
export interface AssertionHelper {
  equal: (actual: any, expected: any, message?: string) => void;
  truthy: (value: any, message?: string) => void;
  falsy: (value: any, message?: string) => void;
}
