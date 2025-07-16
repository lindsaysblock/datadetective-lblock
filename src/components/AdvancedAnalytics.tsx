/**
 * Advanced Analytics Component
 * Refactored to meet coding standards: <220 lines, <5 hooks, clear separation of concerns
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Activity, Zap } from 'lucide-react';
import { AnalyticsInsight } from '@/types/analysis';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';
import InsightCard from '@/components/analytics/InsightCard';
import { SPACING, BUTTON_STYLES } from '@/constants/ui';

interface AdvancedAnalyticsProps {
  onInsightGenerated?: (insight: AnalyticsInsight) => void;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ onInsightGenerated }) => {
  const { insights, isAnalyzing, runAdvancedAnalysis, updateInsightStatus } = useAdvancedAnalytics(onInsightGenerated);

  return (
    <Card className={`p-${SPACING.LG} bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-${SPACING.SM} bg-blue-100 rounded-lg`}>
            <Brain className={`w-${SPACING.LG} h-${SPACING.LG} text-blue-600`} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">🧠 Advanced Analytics & Intelligence</h3>
            <p className="text-sm text-gray-600">AI-powered insights and pattern detection</p>
          </div>
        </div>
        
        <Button 
          onClick={runAdvancedAnalysis}
          disabled={isAnalyzing}
          className={BUTTON_STYLES.GRADIENT_PRIMARY}
        >
          {isAnalyzing ? (
            <>
              <Activity className={`w-${SPACING.MD} h-${SPACING.MD} mr-${SPACING.SM} animate-spin`} />
              Analyzing...
            </>
          ) : (
            <>
              <Zap className={`w-${SPACING.MD} h-${SPACING.MD} mr-${SPACING.SM}`} />
              Run AI Analysis
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className={`grid w-full grid-cols-3 mb-${SPACING.LG}`}>
          <TabsTrigger value="insights">Smart Insights</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Detection</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className={`space-y-${SPACING.MD}`}>
          <div className="grid gap-4">
            {insights.map((insight) => (
              <InsightCard
                key={insight.id}
                insight={insight}
                onStatusUpdate={updateInsightStatus}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="patterns" className={`space-y-${SPACING.MD}`}>
          <Card className={`p-${SPACING.MD} text-center`}>
            <p className="text-gray-600">Pattern detection analysis will be displayed here.</p>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className={`space-y-${SPACING.MD}`}>
          <Card className={`p-${SPACING.MD} text-center`}>
            <p className="text-gray-600">Predictive analytics results will be displayed here.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AdvancedAnalytics;