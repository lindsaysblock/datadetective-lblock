
import { QAReport, QATestResult, PerformanceMetrics } from '../types';

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
    const totalDuration = performance.now() - startTime;
    
    const performanceMetrics = this.calculatePerformanceMetrics(
      testResults, 
      codebaseAnalysis, 
      totalDuration,
      refactorDecision
    );
    
    const refactoringRecommendations = this.generateRefactoringRecommendations(refactorDecision);
    
    this.logReportSummary(overall, passed, testResults.length, performanceMetrics);

    return {
      overall,
      timestamp: new Date(),
      totalTests: testResults.length,
      passed,
      failed,
      warnings,
      results: testResults,
      performanceMetrics,
      refactoringRecommendations
    };
  }

  private calculatePerformanceMetrics(
    testResults: QATestResult[], 
    codebaseAnalysis: any, 
    totalDuration: number,
    refactorDecision: any
  ): PerformanceMetrics {
    return {
      renderTime: testResults.find(r => r.testName.includes('Render Performance'))?.performance || 0,
      memoryUsage: testResults.find(r => r.testName.includes('Memory Usage'))?.performance || 0,
      bundleSize: testResults.find(r => r.testName.includes('Bundle Size'))?.performance || 0,
      componentCount: codebaseAnalysis.globalMetrics.totalComponents,
      largeFiles: codebaseAnalysis.globalMetrics.largeFiles.map((f: any) => `${f.path} (${f.lines} lines)`),
      qaSystemDuration: totalDuration,
      systemEfficiency: this.calculateSystemEfficiency(testResults),
      memoryEfficiency: this.calculateMemoryEfficiency(testResults),
      codebaseHealth: this.calculateCodebaseHealth(codebaseAnalysis),
      refactoringReadiness: refactorDecision.confidence,
      dynamicAnalysisEnabled: true,
      duration: totalDuration
    };
  }

  private calculateSystemEfficiency(testResults: QATestResult[]): number {
    let efficiency = 100;
    
    const failedTests = testResults.filter(r => r.status === 'fail').length;
    efficiency -= failedTests * 15;
    
    const warningTests = testResults.filter(r => r.status === 'warning').length;
    efficiency -= warningTests * 5;
    
    const avgPerformance = testResults
      .filter(r => r.performance && r.performance > 0)
      .reduce((sum, r) => sum + (r.performance || 0), 0) / testResults.length;
    
    if (avgPerformance < 50) efficiency += 10;
    
    return Math.max(0, Math.min(100, efficiency));
  }

  private calculateMemoryEfficiency(testResults: QATestResult[]): number {
    const memoryTest = testResults.find(r => r.testName.includes('Memory Usage'));
    if (!memoryTest || !memoryTest.performance) return 85;
    
    const memoryUsage = memoryTest.performance;
    
    if (memoryUsage < 10) return 95;
    if (memoryUsage < 25) return 85;
    if (memoryUsage < 50) return 70;
    return 50;
  }

  private calculateCodebaseHealth(codebaseAnalysis: any): number {
    let health = 100;
    
    const largeFileRatio = codebaseAnalysis.globalMetrics.largeFiles.length / codebaseAnalysis.globalMetrics.totalFiles;
    health -= largeFileRatio * 30;
    
    const complexFileRatio = codebaseAnalysis.globalMetrics.complexFiles.length / codebaseAnalysis.globalMetrics.totalFiles;
    health -= complexFileRatio * 25;
    
    const avgSize = codebaseAnalysis.globalMetrics.avgFileSize;
    if (avgSize > 300) health -= 15;
    else if (avgSize < 150) health += 10;
    
    return Math.max(0, Math.min(100, health));
  }

  private generateRefactoringRecommendations(refactorDecision: any) {
    return refactorDecision.suggestions.map((s: any) => ({
      file: s.file,
      type: 'size',
      priority: s.priority,
      description: s.reason,
      suggestion: s.suggestedActions.join('; ')
    }));
  }

  private logReportSummary(overall: string, passed: number, totalTests: number, performanceMetrics: PerformanceMetrics) {
    console.log(`📊 Enhanced QA Report Generated:`);
    console.log(`   Overall: ${overall.toUpperCase()}`);
    console.log(`   Tests: ${passed}/${totalTests} passed`);
    console.log(`   Codebase Health: ${performanceMetrics.codebaseHealth?.toFixed(1)}%`);
    console.log(`   Refactoring Confidence: ${performanceMetrics.refactoringReadiness}%`);
    console.log(`   System Efficiency: ${performanceMetrics.systemEfficiency?.toFixed(1)}%`);
  }
}
