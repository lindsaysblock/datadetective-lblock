import React from 'react';
import { useToast } from '@/hooks/use-toast';

// Safe mock hook to replace useAutoQA
export const useAutoQA = () => {
  const { toast } = useToast();
  
  const runManualQA = async () => {
    toast({
      title: "⚠️ QA System Disabled",
      description: "QA system temporarily disabled during maintenance",
      variant: "destructive",
    });
    return { 
      overall: 'warning' as const,
      message: 'QA disabled',
      timestamp: new Date(),
      totalTests: 0,
      passed: 0,
      failed: 0,
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
  };

  return {
    runManualQA,
    isAutoEnabled: false,
    lastReport: null
  };
};