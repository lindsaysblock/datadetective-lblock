
/**
 * Insights Tab Component
 * Refactored to meet coding standards with proper documentation and error handling
 */

import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import BusinessInsights from '../../BusinessInsights';

interface InsightsTabProps {
  onUpdateHypothesis: (hypothesis: any) => void;
}

const InsightsTab: React.FC<InsightsTabProps> = ({ onUpdateHypothesis }) => {
  return (
    <TabsContent value="insights">
      <BusinessInsights onUpdateHypothesis={onUpdateHypothesis} />
    </TabsContent>
  );
};

export default InsightsTab;
