/**
 * Unified Code Quality System Hook
 * Integrates all quality monitoring, testing, and optimization systems
 */

import { useState, useEffect } from 'react';
import { CodeQualityEngine } from '../utils/qa/enhanced/codeQualityEngine';
import { RealTimeQualityMonitor } from '../utils/qa/enhanced/realTimeQualityMonitor';
import { ComprehensiveE2ETestSuite } from '../utils/testing/enhanced/comprehensiveE2ETestSuite';
import { simpleOptimizer } from '../utils/performance/simpleOptimizer';

export const useCodeQualitySystem = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [qualityScore, setQualityScore] = useState(0);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [testResults, setTestResults] = useState(null);

  const engine = new CodeQualityEngine();
  const monitor = new RealTimeQualityMonitor();
  const testSuite = new ComprehensiveE2ETestSuite();

  const startMonitoring = async () => {
    setIsMonitoring(true);
    monitor.startMonitoring();
    await simpleOptimizer.runAllOptimizations();
    
    const analysis = await engine.analyzeCodebase();
    setQualityScore(analysis.overallScore);
  };

  const runComprehensiveTests = async () => {
    const results = await testSuite.runComprehensiveTests();
    setTestResults(results);
    return results;
  };

  const optimizePerformance = async () => {
    const metrics = await simpleOptimizer.runAllOptimizations();
    setPerformanceMetrics(metrics);
    return metrics;
  };

  useEffect(() => {
    return () => {
      monitor.stopMonitoring();
    };
  }, []);

  return {
    isMonitoring,
    qualityScore,
    performanceMetrics,
    testResults,
    startMonitoring,
    runComprehensiveTests,
    optimizePerformance,
    stopMonitoring: () => {
      setIsMonitoring(false);
      monitor.stopMonitoring();
    }
  };
};