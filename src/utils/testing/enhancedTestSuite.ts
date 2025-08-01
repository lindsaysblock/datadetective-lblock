
import { UnitTestResult } from './testRunner';
import { EnhancedAnalyticsTests } from './suites/enhancedAnalyticsTests';
import { autoComplianceSystem } from '../qa/standards/autoComplianceSystem';
import { ProductionReadinessTests } from './productionReadinessTests';

export class EnhancedTestSuite {
  static async runCompleteTestSuite(): Promise<{
    results: UnitTestResult[];
    complianceScore: number;
    summary: {
      total: number;
      passed: number;
      failed: number;
      warnings: number;
    };
  }> {
    console.log('🚀 Running enhanced test suite...');
    
    const startTime = performance.now();
    const allResults: UnitTestResult[] = [];

    try {
      // Run compliance check first
      const complianceReports = await autoComplianceSystem.runComplianceCheck();
      
      // Calculate average compliance score from all reports
      const averageComplianceScore = complianceReports.length > 0 
        ? complianceReports.reduce((sum, report) => sum + report.overallScore, 0) / complianceReports.length
        : 100;
      
      // Run security tests
      const securityResults = await EnhancedAnalyticsTests.runSecurityTests();
      allResults.push(...securityResults);
      
      // Run performance tests
      const performanceResults = await EnhancedAnalyticsTests.runPerformanceTests();
      allResults.push(...performanceResults);
      
      // Run data integrity tests
      const dataResults = await EnhancedAnalyticsTests.runDataIntegrityTests();
      allResults.push(...dataResults);

      // Run production readiness tests (authentication, guided tour, persistence)
      const productionResults = await ProductionReadinessTests.runCompleteProductionTests();
      allResults.push(...productionResults.results);

      const summary = this.calculateSummary(allResults);
      const duration = performance.now() - startTime;

      console.log(`✅ Enhanced test suite completed in ${duration.toFixed(0)}ms`);
      console.log(`📊 Results: ${summary.passed}/${summary.total} tests passed`);
      console.log(`🎯 Compliance Score: ${averageComplianceScore.toFixed(1)}%`);

      return {
        results: allResults,
        complianceScore: averageComplianceScore,
        summary
      };
    } catch (error) {
      console.error('❌ Enhanced test suite failed:', error);
      throw error;
    }
  }

  private static calculateSummary(results: UnitTestResult[]) {
    const total = results.length;
    const passed = results.filter(r => r.status === 'pass').length;
    const failed = results.filter(r => r.status === 'fail').length;
    const warnings = results.filter(r => r.status === 'warning').length;

    return { total, passed, failed, warnings };
  }

  static async runContinuousMonitoring(): Promise<void> {
    console.log('🔄 Starting continuous monitoring...');
    
    // Start auto-compliance monitoring
    autoComplianceSystem.startMonitoring();
    
    // Run test suite every 5 minutes
    setInterval(async () => {
      try {
        const results = await this.runCompleteTestSuite();
        if (results.complianceScore < 80) {
          console.warn(`⚠️ Compliance score dropped to ${results.complianceScore}%`);
        }
      } catch (error) {
        console.error('Monitoring cycle failed:', error);
      }
    }, 300000); // 5 minutes
  }
}
