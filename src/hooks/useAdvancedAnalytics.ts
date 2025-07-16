/**
 * Advanced Analytics Hook
 * Extracts analytics logic to meet max 5 hooks per component standard
 */

import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { AnalyticsInsight } from '@/types/analysis';
import { MOCK_INSIGHTS } from '@/constants/analysis';
import { TIMEOUTS } from '@/constants/ui';

export const useAdvancedAnalytics = (onInsightGenerated?: (insight: AnalyticsInsight) => void) => {
  const [insights, setInsights] = useState<AnalyticsInsight[]>(
    MOCK_INSIGHTS.map(insight => ({
      ...insight,
      createdAt: new Date()
    }))
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const runAdvancedAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, TIMEOUTS.MEDIUM));
      
      const newInsight: AnalyticsInsight = {
        id: Date.now().toString(),
        title: 'Revenue Opportunity Identified',
        description: 'Cross-selling Product B to users who purchased Product A could increase revenue by 18%',
        type: 'opportunity',
        confidence: 85,
        impact: 'high',
        status: 'new',
        createdAt: new Date(),
        data: { opportunity: 'cross-selling', increase: 18 }
      };

      setInsights(prev => [newInsight, ...prev]);
      onInsightGenerated?.(newInsight);
      
      toast({
        title: "New Insight Generated!",
        description: "Advanced AI analysis has identified a new business opportunity.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to generate new insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [onInsightGenerated, toast]);

  const updateInsightStatus = useCallback((id: string, status: AnalyticsInsight['status']) => {
    setInsights(prev => prev.map(insight => 
      insight.id === id ? { ...insight, status } : insight
    ));
  }, []);

  return {
    insights,
    isAnalyzing,
    runAdvancedAnalysis,
    updateInsightStatus,
  };
};