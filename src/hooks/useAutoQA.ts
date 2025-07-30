import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AutoQASystem } from '@/utils/qaSystem';

export const useAutoQA = () => {
  const { toast } = useToast();
  const [isAutoEnabled, setIsAutoEnabled] = useState(false);
  const [lastReport, setLastReport] = useState(null);
  
  const runManualQA = useCallback(async () => {
    try {
      toast({
        title: "🔍 Running QA Analysis",
        description: "Quality assurance testing in progress...",
      });

      const qaSystem = new AutoQASystem();
      const report = await qaSystem.runFullQA();
      
      setLastReport(report);
      
      if (report.overall === 'pass') {
        toast({
          title: "✅ QA Tests Passed",
          description: `All ${report.totalTests} tests completed successfully`,
        });
      } else if (report.overall === 'warning') {
        toast({
          title: "⚠️ QA Tests Completed with Warnings",
          description: `${report.passed} passed, ${report.warnings} warnings`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "❌ QA Tests Failed",
          description: `${report.failed} tests failed, ${report.passed} passed`,
          variant: "destructive",
        });
      }
      
      return report;
    } catch (error) {
      console.error('QA system error:', error);
      toast({
        title: "❌ QA System Error",
        description: "Failed to run quality assurance tests",
        variant: "destructive",
      });
      
      return {
        overall: 'fail' as const,
        message: 'QA system error',
        timestamp: new Date(),
        totalTests: 0,
        passed: 0,
        failed: 1,
        warnings: 0,
        results: [],
        performanceMetrics: {
          renderTime: 0,
          memoryUsage: 0,
          bundleSize: 0,
          componentCount: 0,
          largeFiles: [],
          qaSystemDuration: 0,
          systemEfficiency: 0,
          memoryEfficiency: 0,
          codebaseHealth: 0,
          refactoringReadiness: 0,
          dynamicAnalysisEnabled: false,
          enhancedMode: false,
          duration: 0
        },
        refactoringRecommendations: []
      };
    }
  }, [toast]);

  return {
    runManualQA,
    isAutoEnabled,
    lastReport,
    setIsAutoEnabled
  };
};