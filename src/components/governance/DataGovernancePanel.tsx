
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DataGovernanceControls } from './DataGovernanceControls';
import { ComplianceMetrics } from './ComplianceMetrics';

interface DataGovernancePanelProps {
  onPolicyUpdate?: (policyId: string, action: string) => void;
}

export const DataGovernancePanel: React.FC<DataGovernancePanelProps> = ({
  onPolicyUpdate
}) => {
  const { toast } = useToast();
  const [policies, setPolicies] = useState([
    {
      id: '1',
      name: 'Data Retention Policy',
      status: 'active' as const,
      type: 'compliance' as const
    },
    {
      id: '2',
      name: 'PII Protection',
      status: 'active' as const,
      type: 'privacy' as const
    },
    {
      id: '3',
      name: 'Access Control',
      status: 'pending' as const,
      type: 'security' as const
    }
  ]);

  const [metrics] = useState([
    {
      id: '1',
      name: 'Data Encryption',
      score: 95,
      status: 'compliant' as const,
      trend: 'stable' as const
    },
    {
      id: '2',
      name: 'Access Logs',
      score: 88,
      status: 'compliant' as const,
      trend: 'up' as const
    },
    {
      id: '3',
      name: 'Data Masking',
      score: 72,
      status: 'warning' as const,
      trend: 'down' as const
    }
  ]);

  const handlePolicyUpdate = (policyId: string, action: string) => {
    if (action === 'activate' || action === 'deactivate') {
      setPolicies(prev => prev.map(policy => 
        policy.id === policyId 
          ? { ...policy, status: action === 'activate' ? 'active' : 'inactive' }
          : policy
      ));
      
      toast({
        title: "Policy Updated",
        description: `Policy has been ${action}d successfully.`,
      });
    }
    
    onPolicyUpdate?.(policyId, action);
  };

  const overallScore = Math.round(
    metrics.reduce((sum, metric) => sum + metric.score, 0) / metrics.length
  );

  return (
    <div className="space-y-6">
      <ComplianceMetrics metrics={metrics} overallScore={overallScore} />
      <DataGovernanceControls policies={policies} onUpdatePolicy={handlePolicyUpdate} />
    </div>
  );
};
