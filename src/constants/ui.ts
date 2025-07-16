/**
 * UI Constants and Configuration
 * Centralizes magic numbers and strings to meet coding standards
 */

export const SPACING = {
  NONE: 0,
  XS: 1,
  SM: 2,
  MD: 4,
  LG: 6,
  XL: 8,
  XXL: 12,
  XXXL: 16,
} as const;

export const TIMEOUTS = {
  SHORT: 1000,
  MEDIUM: 3000,
  LONG: 5000,
  ANALYSIS: 30000,
} as const;

export const CACHE_TIMES = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  GC_TIME: 10 * 60 * 1000,   // 10 minutes
} as const;

export const RETRY_COUNTS = {
  DEFAULT: 1,
  FILE_UPLOAD: 3,
} as const;

export const FILE_SIZES = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  CHUNK_SIZE: 1024 * 1024,         // 1MB
} as const;

export const FORM_STEPS = {
  RESEARCH_QUESTION: 1,
  DATA_SOURCE: 2,
  BUSINESS_CONTEXT: 3,
  ANALYSIS_SUMMARY: 4,
} as const;

export const CONFIDENCE_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export const ANALYSIS_TYPES = {
  TREND: 'trend',
  ANOMALY: 'anomaly',
  CORRELATION: 'correlation',
  PREDICTION: 'prediction',
  OPPORTUNITY: 'opportunity',
} as const;

export const IMPACT_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export const STATUS_TYPES = {
  NEW: 'new',
  REVIEWED: 'reviewed',
  IMPLEMENTED: 'implemented',
} as const;

export const TEXT_SIZES = {
  HERO: 'text-4xl',
  HEADING: 'text-4xl',
  SUBHEADING: 'text-2xl',
  BODY: 'text-xl',
  ICON: 'text-6xl',
  SMALL: 'text-sm',
  MEDIUM: 'text-base',
  LARGE: 'text-lg',
} as const;

export const ICON_SIZES = {
  XS: 'w-3 h-3',
  SM: 'w-4 h-4',
  MD: 'w-5 h-5',
  LG: 'w-6 h-6',
  XL: 'w-8 h-8',
} as const;

export const CHART_HEIGHTS = {
  SMALL: 150,
  MEDIUM: 200,
  LARGE: 300,
} as const;

export const BUTTON_STYLES = {
  GRADIENT_PRIMARY: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
  GRADIENT_SUCCESS: 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700',
  GRADIENT_DANGER: 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700',
  GRADIENT_SECONDARY: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700',
} as const;

export const INSIGHT_COLORS = {
  TREND: 'bg-blue-100 text-blue-700',
  ANOMALY: 'bg-red-100 text-red-700',
  CORRELATION: 'bg-green-100 text-green-700',
  PREDICTION: 'bg-purple-100 text-purple-700',
  OPPORTUNITY: 'bg-yellow-100 text-yellow-700',
  DEFAULT: 'bg-gray-100 text-gray-700',
} as const;

export const IMPACT_COLORS = {
  HIGH: 'bg-red-100 text-red-700',
  MEDIUM: 'bg-yellow-100 text-yellow-700',
  LOW: 'bg-green-100 text-green-700',
  DEFAULT: 'bg-gray-100 text-gray-700',
} as const;