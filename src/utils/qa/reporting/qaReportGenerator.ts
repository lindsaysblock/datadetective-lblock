
import { QATestResult, QAReport } from '../types';

export class QAReportGenerator {
  generateEnhancedReport(
    testResults: QATestResult[], 
    codebaseAnalysis: any, 
    refactorDecision: any,
    startTime: number
  ): QAReport {
    const passed = testResults.filter(r => r.status === 'pass').length;
    const failed = testResults.filter(r => r.status === 'fail').length;
    const warnings = testResults.filter(r => r.status === 'warning').length;
    const overall = failed > 0 ? 'fail' : warnings > 0 ? 'warning' : 'pass';
    const duration = performance.now() - startTime;

    return {
      overall,
      timestamp: new Date(),
      totalTests: testResults.length,
      passed,
      failed,
      warnings,
      results: testResults,
      performanceMetrics: {
        renderTime: duration,
        memoryUsage: this.getMemoryUsage(),
        bundleSize: this.estimateBundleSize(codebaseAnalysis),
        componentCount: codebaseAnalysis.components?.length || 0,
        largeFiles: codebaseAnalysis.globalMetrics?.largeFiles || [],
        duration,
        dynamicAnalysisEnabled: true,
        systemEfficiency: this.calculateSystemEfficiency(testResults),
        memoryEfficiency: this.calculateMemoryEfficiency(),
        enhancedMode: true
      },
      refactoringRecommendations: refactorDecision.suggestions || []
    };
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024;
    }
    return 0;
  }

  private estimateBundleSize(codebaseAnalysis: any): number {
    const totalLines = codebaseAnalysis.files?.reduce((sum: number, f: any) => sum + f.lines, 0) || 0;
    return totalLines * 0.05; // Rough estimate: 50 bytes per line
  }

  private calculateSystemEfficiency(testResults: QATestResult[]): number {
    if (testResults.length === 0) return 100;
    
    const passed = testResults.filter(r => r.status === 'pass').length;
    const efficiency = (passed / testResults.length) * 100;
    
    // Factor in performance metrics
    const avgPerformance = testResults
      .filter(r => r.performance)
      .reduce((sum, r) => sum + (r.performance || 0), 0) / testResults.length;
    
    if (avgPerformance > 0) {
      const performancePenalty = Math.min(avgPerformance / 10, 20); // Max 20% penalty
      return Math.max(0, efficiency - performancePenalty);
    }
    
    return efficiency;
  }

  private calculateMemoryEfficiency(): number {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      return Math.max(0, (1 - usage) * 100);
    }
    return 100;
  }
}
