/**
 * Insight Card Component
 * Extracted from AdvancedAnalytics to reduce complexity
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnalyticsInsight } from '@/types/analysis';
import { getInsightIcon, getInsightColor, getImpactColor, getStatusIcon } from '@/utils/analyticsHelpers';
import { SPACING } from '@/constants/ui';

interface InsightCardProps {
  insight: AnalyticsInsight;
  onStatusUpdate: (id: string, status: AnalyticsInsight['status']) => void;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, onStatusUpdate }) => {
  const IconComponent = getInsightIcon(insight.type);
  const StatusIcon = getStatusIcon(insight.status);

  return (
    <Card className={`p-${SPACING.MD} hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-${SPACING.SM} rounded-lg ${getInsightColor(insight.type)}`}>
            <IconComponent className={`w-${SPACING.MD} h-${SPACING.MD}`} />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{insight.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={`text-xs ${getImpactColor(insight.impact)}`}>
            {insight.impact} impact
          </Badge>
          <StatusIcon className={`w-${SPACING.MD} h-${SPACING.MD} text-gray-500`} />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Confidence:</span>
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${insight.confidence}%` }}
            />
          </div>
          <span className="text-sm font-medium">{insight.confidence}%</span>
        </div>
        
        <div className="flex gap-2">
          {insight.status === 'new' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onStatusUpdate(insight.id, 'reviewed')}
            >
              Mark Reviewed
            </Button>
          )}
          {insight.status === 'reviewed' && (
            <Button 
              size="sm" 
              onClick={() => onStatusUpdate(insight.id, 'implemented')}
            >
              Implement
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default InsightCard;