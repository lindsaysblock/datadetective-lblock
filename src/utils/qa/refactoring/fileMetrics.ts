
/**
 * File Metrics
 * Calculates and tracks code metrics for files
 */

/** File metric thresholds */
const METRIC_THRESHOLDS = {
  MAX_LINES: 220,
  MAX_COMPLEXITY: 10,
  MAX_DEPENDENCIES: 15,
  LINE_THRESHOLDS: {
    component: 200,
    hook: 150,
    utility: 250,
    page: 300
  },
  COMPLEXITY_THRESHOLDS: {
    low: 10,
    medium: 20,
    high: 30
  }
} as const;

/** File metrics interface */
export interface FileMetrics {
  lines: number;
  complexity: number;
  maintainabilityIndex: number;
  urgencyScore: number;
}

/**
 * File metrics calculator
 * Provides calculations for code quality metrics
 */
export class FileMetricsCalculator {
  private readonly LINE_THRESHOLDS = METRIC_THRESHOLDS.LINE_THRESHOLDS;
  private readonly COMPLEXITY_THRESHOLDS = METRIC_THRESHOLDS.COMPLEXITY_THRESHOLDS;

  calculateMaintainabilityIndex(lines: number, complexity: number): number {
    const volume = Math.log2(lines) * 10;
    const complexityPenalty = complexity * 2;
    const maintainability = Math.max(0, 100 - volume - complexityPenalty);
    return maintainability;
  }

  calculateUrgencyScore(lines: number, threshold: number, complexity: number): number {
    let score = 0;
    
    const sizeRatio = lines / threshold;
    score += Math.min(sizeRatio * 30, 50);
    
    const complexityRatio = complexity / this.COMPLEXITY_THRESHOLDS.high;
    score += Math.min(complexityRatio * 40, 50);
    
    return Math.min(score, 100);
  }

  getThresholdForType(fileType: string): number {
    return this.LINE_THRESHOLDS[fileType as keyof typeof this.LINE_THRESHOLDS] || 200;
  }

  getComplexityThresholds() {
    return this.COMPLEXITY_THRESHOLDS;
  }
}
