
import { AnalyticsConfig } from '../types/analytics';

export const DEFAULT_ANALYTICS_CONFIG: AnalyticsConfig = {
  enableValidation: true,
  enableErrorRecovery: true,
  maxRetries: 3,
  timeoutMs: 30000,
  qualityThreshold: 0.7
};

export const PERFORMANCE_CONFIG: AnalyticsConfig = {
  enableValidation: false,
  enableErrorRecovery: false,
  maxRetries: 1,
  timeoutMs: 10000,
  qualityThreshold: 0.5
};

export const STRICT_CONFIG: AnalyticsConfig = {
  enableValidation: true,
  enableErrorRecovery: false,
  maxRetries: 1,
  timeoutMs: 60000,
  qualityThreshold: 0.9
};

export const getAnalyticsConfig = (environment: 'development' | 'production' | 'test'): AnalyticsConfig => {
  switch (environment) {
    case 'production':
      return PERFORMANCE_CONFIG;
    case 'test':
      return STRICT_CONFIG;
    case 'development':
    default:
      return DEFAULT_ANALYTICS_CONFIG;
  }
};
