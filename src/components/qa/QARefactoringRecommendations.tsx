
/**
 * QA Refactoring Recommendations Component
 * Displays automated refactoring suggestions with priority levels
 * Refactored for consistency and maintainability
 */

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefactoringRecommendation } from '../../utils/qa/types';
import { SPACING } from '@/constants/ui';

interface QARefactoringRecommendationsProps {
  recommendations: RefactoringRecommendation[];
}

const QARefactoringRecommendations: React.FC<QARefactoringRecommendationsProps> = ({ recommendations }) => {
  /**
   * Returns semantic styling for priority badges
   */
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive';
      case 'medium': return 'bg-warning/10 text-warning';
      default: return 'bg-primary/10 text-primary';
    }
  };

  return (
    <div className={`grid gap-${SPACING.MD}`}>
      {recommendations.map((rec, index) => (
        <Card key={index} className={`p-${SPACING.MD}`}>
          <div className={`flex items-start justify-between mb-${SPACING.SM}`}>
            <div>
              <h4 className="font-semibold">{rec.file}</h4>
              <div className={`flex items-center gap-${SPACING.SM} mt-${SPACING.XS}`}>
                <Badge variant="outline" className="text-xs">
                  {rec.type}
                </Badge>
                <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>
                  {rec.priority} priority
                </Badge>
              </div>
            </div>
          </div>
          
          <p className={`text-sm text-muted-foreground mb-${SPACING.SM}`}>{rec.description}</p>
          <div className={`p-${SPACING.SM} bg-primary/5 rounded border-l-4 border-primary`}>
            <p className="text-sm font-medium text-primary">Suggestion:</p>
            <p className="text-sm text-primary/80">{rec.suggestion}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default QARefactoringRecommendations;
