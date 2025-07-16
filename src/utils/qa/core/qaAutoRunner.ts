
/**
 * Automated QA Runner
 * Creates and manages automated QA test execution
 */

/** QA auto-runner constants */
const AUTO_RUNNER_CONSTANTS = {
  FEATURE_SELECTOR: '[data-feature]',
  METRICS_PRECISION: 2
} as const;

/**
 * Creates an automated QA runner function
 * Monitors for new features and triggers QA tests automatically
 */
export const createAutoQARunner = () => {
  let lastFeatureCount = 0;
  let qaRunCount = 0;
  
  return async () => {
    const currentFeatureCount = document.querySelectorAll(AUTO_RUNNER_CONSTANTS.FEATURE_SELECTOR).length;
    
    if (currentFeatureCount > lastFeatureCount) {
      qaRunCount++;
      console.log(`🔍 New feature detected (run #${qaRunCount}), running enhanced automatic QA...`);
      
      const { AutoQASystem } = await import('../qaSystemCore');
      const qaSystem = new AutoQASystem();
      const startTime = performance.now();
      const report = await qaSystem.runFullQA();
      const duration = performance.now() - startTime;
      
      console.log(`📊 Enhanced QA Report Summary (Run #${qaRunCount}):`);
      console.log(`   Overall Status: ${report.overall.toUpperCase()}`);
      console.log(`   Tests: ${report.passed}/${report.totalTests} passed`);
      console.log(`   Performance: ${report.performanceMetrics.renderTime.toFixed(AUTO_RUNNER_CONSTANTS.METRICS_PRECISION)}ms render time`);
      console.log(`   QA Duration: ${duration.toFixed(AUTO_RUNNER_CONSTANTS.METRICS_PRECISION)}ms`);
      console.log(`   Refactoring Needs: ${report.refactoringRecommendations.length} recommendations`);
      console.log(`   System Efficiency: ${report.performanceMetrics.systemEfficiency?.toFixed(1) || 'N/A'}%`);
      console.log(`   Enhanced Mode: ${report.performanceMetrics.enhancedMode ? 'ACTIVE' : 'INACTIVE'}`);
      
      lastFeatureCount = currentFeatureCount;
      return report;
    }
    
    return null;
  };
};

export const autoRunQA = createAutoQARunner();
