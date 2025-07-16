/**
 * Analysis Constants
 * Centralizes analysis-related configuration
 */

export const ANALYSIS_CONFIG = {
  MAX_COMPLEXITY: 5,
  MAX_NESTING_LEVEL: 3,
  MIN_CONFIDENCE: 0.7,
  MAX_INSIGHTS: 10,
} as const;

export const DATA_VALIDATION = {
  MIN_ROWS: 1,
  MAX_ROWS: 1000000,
  MIN_COLUMNS: 1,
  MAX_COLUMNS: 100,
} as const;

export const MOCK_INSIGHTS = [
  {
    id: '1',
    title: 'Seasonal Revenue Pattern Detected',
    description: 'Revenue shows consistent 23% increase during Q4 months over the past 3 years',
    type: 'trend' as const,
    confidence: 94,
    impact: 'high' as const,
    status: 'new' as const,
    data: { trend: 'increasing', percentage: 23 }
  },
  {
    id: '2',
    title: 'Customer Churn Risk Identified',
    description: 'Users with <2 logins in 30 days have 78% churn probability',
    type: 'prediction' as const,
    confidence: 87,
    impact: 'high' as const,
    status: 'new' as const,
    data: { churnRate: 78, timeframe: 30 }
  },
  {
    id: '3',
    title: 'Feature Adoption Correlation',
    description: 'Users engaging with Feature X are 4.2x more likely to upgrade to premium',
    type: 'correlation' as const,
    confidence: 91,
    impact: 'medium' as const,
    status: 'reviewed' as const,
    data: { multiplier: 4.2, feature: 'Feature X' }
  }
] as const;