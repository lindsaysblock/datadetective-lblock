/**
 * Unified Code Quality System Hook
 * Integrates all quality monitoring, testing, and optimization systems
 */

import { useState, useEffect } from 'react';
import { CodeQualityEngine } from '../utils/qa/enhanced/codeQualityEngine';
import { RealTimeQualityMonitor } from '../utils/qa/enhanced/realTimeQualityMonitor';
import { ComprehensiveE2ETestSuite } from '../utils/testing/enhanced/comprehensiveE2ETestSuite';
import { AdvancedPerformanceOptimizer } from '../utils/performance/advanced/performanceOptimizer';

export const useCodeQualitySystem = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [qualityScore, setQualityScore] = useState(0);
  const [performanceMetrics, setPerformanceMetrics] = useState(null);
  const [testResults, setTestResults] = useState(null);

  const engine = new CodeQualityEngine();
  const monitor = new RealTimeQualityMonitor();
  const testSuite = new ComprehensiveE2ETestSuite();
  const optimizer = new AdvancedPerformanceOptimizer();

  const startMonitoring = async () => {
    setIsMonitoring(true);
    monitor.startMonitoring();
    await optimizer.startPerformanceMonitoring();
    
    const analysis = await engine.analyzeCodebase();
    setQualityScore(analysis.overallScore);
  };

  const runComprehensiveTests = async () => {
    const results = await testSuite.runComprehensiveTests();
    setTestResults(results);
    return results;
  };

  const optimizePerformance = async () => {
    const suggestions = await optimizer.optimizePerformance();
    const metrics = await optimizer.collectMetrics();
    setPerformanceMetrics(metrics);
    return suggestions;
  };

  useEffect(() => {
    return () => {
      monitor.stopMonitoring();
      optimizer.stopMonitoring();
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
      optimizer.stopMonitoring();
    }
  };
};