
/**
 * Audit Tab Component
 * Refactored to meet coding standards with proper documentation and constants
 */

import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import AuditLogsPanel from '../../AuditLogsPanel';
import DataGovernancePanel from '../../DataGovernancePanel';
import { SPACING } from '@/constants/ui';

const AuditTab: React.FC = () => {
  return (
    <TabsContent value="audit">
      <div className={`space-y-${SPACING.LG}`}>
        <AuditLogsPanel />
        <DataGovernancePanel />
      </div>
    </TabsContent>
  );
};

export default AuditTab;
