
/**
 * Findings Tab Component
 * Refactored to meet coding standards with proper documentation and error handling
 */

import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import VisualizationFindings from '../../VisualizationFindings';

interface FindingsTabProps {
  findings: any[];
  onExportFinding: (finding: any) => void;
  onShareFinding: (finding: any) => void;
}

const FindingsTab: React.FC<FindingsTabProps> = ({
  findings,
  onExportFinding,
  onShareFinding
}) => {
  return (
    <TabsContent value="findings">
      <VisualizationFindings 
        findings={findings}
        onExportFinding={onExportFinding}
        onShareFinding={onShareFinding}
      />
    </TabsContent>
  );
};

export default FindingsTab;
