/**
 * Analytics Helper Functions
 * Extracted utility functions to reduce component complexity
 */

import { 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Brain, 
  Lightbulb, 
  BarChart3,
  Clock,
  CheckCircle,
  Star
} from 'lucide-react';
import { AnalyticsInsight } from '@/types/analysis';
import { INSIGHT_COLORS, IMPACT_COLORS } from '@/constants/ui';

export const getInsightIcon = (type: AnalyticsInsight['type']) => {
  switch (type) {
    case 'trend': return TrendingUp;
    case 'anomaly': return AlertTriangle;
    case 'correlation': return Target;
    case 'prediction': return Brain;
    case 'opportunity': return Lightbulb;
    default: return BarChart3;
  }
};

export const getInsightColor = (type: AnalyticsInsight['type']) => {
  switch (type) {
    case 'trend': return INSIGHT_COLORS.TREND;
    case 'anomaly': return INSIGHT_COLORS.ANOMALY;
    case 'correlation': return INSIGHT_COLORS.CORRELATION;
    case 'prediction': return INSIGHT_COLORS.PREDICTION;
    case 'opportunity': return INSIGHT_COLORS.OPPORTUNITY;
    default: return INSIGHT_COLORS.DEFAULT;
  }
};

export const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high': return IMPACT_COLORS.HIGH;
    case 'medium': return IMPACT_COLORS.MEDIUM;
    case 'low': return IMPACT_COLORS.LOW;
    default: return IMPACT_COLORS.DEFAULT;
  }
};

export const getStatusIcon = (status: AnalyticsInsight['status']) => {
  switch (status) {
    case 'new': return Clock;
    case 'reviewed': return CheckCircle;
    case 'implemented': return Star;
    default: return Clock;
  }
};