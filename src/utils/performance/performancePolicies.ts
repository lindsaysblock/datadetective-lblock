
export interface PerformanceBudget {
  responseTimeSLA: number; // milliseconds
  memoryLimit: number; // MB
  cpuLimit: number; // percentage
  bundleSizeLimit: number; // KB
  complexityLimit: number; // cyclomatic complexity
}

export interface PerformanceThresholds {
  critical: number;
  warning: number;
  acceptable: number;
}

export class PerformancePolicyEngine {
  private static readonly DEFAULT_BUDGETS: PerformanceBudget = {
    responseTimeSLA: 200,
    memoryLimit: 128,
    cpuLimit: 50,
    bundleSizeLimit: 200,
    complexityLimit: 10
  };

  private static readonly REGRESSION_THRESHOLD = 5; // 5% regression tolerance

  validateResponseTime(actualTime: number, budget = this.DEFAULT_BUDGETS.responseTimeSLA): {
    passed: boolean;
    message: string;
    severity: 'critical' | 'warning' | 'acceptable';
  } {
    const ratio = actualTime / budget;
    
    if (ratio <= 1) {
      return { passed: true, message: `Response time ${actualTime}ms within budget`, severity: 'acceptable' };
    } else if (ratio <= 1.5) {
      return { passed: false, message: `Response time ${actualTime}ms exceeds budget by ${((ratio - 1) * 100).toFixed(1)}%`, severity: 'warning' };
    } else {
      return { passed: false, message: `Response time ${actualTime}ms critically exceeds budget`, severity: 'critical' };
    }
  }

  validateMemoryUsage(actualMemory: number, budget = this.DEFAULT_BUDGETS.memoryLimit): {
    passed: boolean;
    message: string;
    severity: 'critical' | 'warning' | 'acceptable';
  } {
    const ratio = actualMemory / budget;
    
    if (ratio <= 1) {
      return { passed: true, message: `Memory usage ${actualMemory}MB within budget`, severity: 'acceptable' };
    } else if (ratio <= 1.3) {
      return { passed: false, message: `Memory usage ${actualMemory}MB exceeds budget`, severity: 'warning' };
    } else {
      return { passed: false, message: `Memory usage ${actualMemory}MB critically exceeds budget`, severity: 'critical' };
    }
  }

  validateBundleSize(actualSize: number, budget = this.DEFAULT_BUDGETS.bundleSizeLimit): {
    passed: boolean;
    message: string;
    severity: 'critical' | 'warning' | 'acceptable';
  } {
    const ratio = actualSize / budget;
    
    if (ratio <= 1) {
      return { passed: true, message: `Bundle size ${actualSize}KB within budget`, severity: 'acceptable' };
    } else if (ratio <= 1.2) {
      return { passed: false, message: `Bundle size ${actualSize}KB exceeds budget`, severity: 'warning' };
    } else {
      return { passed: false, message: `Bundle size ${actualSize}KB critically exceeds budget`, severity: 'critical' };
    }
  }

  checkRegression(currentMetric: number, baselineMetric: number): {
    isRegression: boolean;
    percentageChange: number;
    message: string;
  } {
    const percentageChange = ((currentMetric - baselineMetric) / baselineMetric) * 100;
    const isRegression = percentageChange > this.REGRESSION_THRESHOLD;
    
    return {
      isRegression,
      percentageChange,
      message: isRegression 
        ? `Performance regression detected: ${percentageChange.toFixed(1)}% increase`
        : `Performance change: ${percentageChange.toFixed(1)}%`
    };
  }

  analyzeComplexity(functionCode: string): {
    complexity: number;
    passed: boolean;
    message: string;
  } {
    // Simple cyclomatic complexity analysis
    let complexity = 1; // Base complexity
    
    // Count decision points
    const decisionPatterns = [
      /if\s*\(/g, /else\s+if\s*\(/g, /while\s*\(/g, /for\s*\(/g,
      /catch\s*\(/g, /case\s+/g, /\?\s*:/g, /&&/g, /\|\|/g
    ];
    
    decisionPatterns.forEach(pattern => {
      const matches = functionCode.match(pattern);
      if (matches) complexity += matches.length;
    });
    
    const passed = complexity <= this.DEFAULT_BUDGETS.complexityLimit;
    
    return {
      complexity,
      passed,
      message: passed 
        ? `Complexity ${complexity} within limit`
        : `Complexity ${complexity} exceeds limit of ${this.DEFAULT_BUDGETS.complexityLimit}`
    };
  }

  generatePerformanceReport(metrics: {
    responseTime?: number;
    memoryUsage?: number;
    bundleSize?: number;
    complexity?: number;
    baseline?: { responseTime?: number; memoryUsage?: number; bundleSize?: number; };
  }): {
    overall: 'passed' | 'warning' | 'failed';
    results: Array<{ metric: string; passed: boolean; message: string; severity: string; }>;
    regressions: Array<{ metric: string; change: number; message: string; }>;
  } {
    const results: Array<{ metric: string; passed: boolean; message: string; severity: string; }> = [];
    const regressions: Array<{ metric: string; change: number; message: string; }> = [];
    
    if (metrics.responseTime !== undefined) {
      const result = this.validateResponseTime(metrics.responseTime);
      results.push({ metric: 'Response Time', ...result });
      
      if (metrics.baseline?.responseTime) {
        const regression = this.checkRegression(metrics.responseTime, metrics.baseline.responseTime);
        if (regression.isRegression) {
          regressions.push({ metric: 'Response Time', change: regression.percentageChange, message: regression.message });
        }
      }
    }
    
    if (metrics.memoryUsage !== undefined) {
      const result = this.validateMemoryUsage(metrics.memoryUsage);
      results.push({ metric: 'Memory Usage', ...result });
      
      if (metrics.baseline?.memoryUsage) {
        const regression = this.checkRegression(metrics.memoryUsage, metrics.baseline.memoryUsage);
        if (regression.isRegression) {
          regressions.push({ metric: 'Memory Usage', change: regression.percentageChange, message: regression.message });
        }
      }
    }
    
    if (metrics.bundleSize !== undefined) {
      const result = this.validateBundleSize(metrics.bundleSize);
      results.push({ metric: 'Bundle Size', ...result });
      
      if (metrics.baseline?.bundleSize) {
        const regression = this.checkRegression(metrics.bundleSize, metrics.baseline.bundleSize);
        if (regression.isRegression) {
          regressions.push({ metric: 'Bundle Size', change: regression.percentageChange, message: regression.message });
        }
      }
    }
    
    const criticalFailures = results.filter(r => !r.passed && r.severity === 'critical').length;
    const warnings = results.filter(r => !r.passed && r.severity === 'warning').length;
    
    let overall: 'passed' | 'warning' | 'failed';
    if (criticalFailures > 0 || regressions.length > 0) {
      overall = 'failed';
    } else if (warnings > 0) {
      overall = 'warning';
    } else {
      overall = 'passed';
    }
    
    return { overall, results, regressions };
  }
}

export const performancePolicyEngine = new PerformancePolicyEngine();
