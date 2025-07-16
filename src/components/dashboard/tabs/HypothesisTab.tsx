
/**
 * Hypothesis Tab Component
 * Refactored to meet coding standards with proper documentation and error handling
 */

import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import HypothesisTracker from '../../HypothesisTracker';

interface HypothesisTabProps {
  onHypothesisUpdate: (hypothesis: any) => void;
}

const HypothesisTab: React.FC<HypothesisTabProps> = ({ onHypothesisUpdate }) => {
  return (
    <TabsContent value="hypothesis">
      <HypothesisTracker onHypothesisUpdate={onHypothesisUpdate} />
    </TabsContent>
  );
};

export default HypothesisTab;
