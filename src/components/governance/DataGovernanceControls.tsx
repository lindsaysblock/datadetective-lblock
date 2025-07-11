
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, AlertTriangle } from 'lucide-react';

interface DataGovernanceControlsProps {
  policies: Array<{
    id: string;
    name: string;
    status: 'active' | 'inactive' | 'pending';
    type: 'privacy' | 'security' | 'compliance';
  }>;
  onUpdatePolicy: (id: string, action: string) => void;
}

export const DataGovernanceControls: React.FC<DataGovernanceControlsProps> = ({
  policies,
  onUpdatePolicy
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'privacy': return <Eye className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'compliance': return <Lock className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Data Governance Policies
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {policies.map((policy) => (
            <div key={policy.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getTypeIcon(policy.type)}
                <div>
                  <h4 className="font-medium">{policy.name}</h4>
                  <Badge className={getStatusColor(policy.status)}>
                    {policy.status}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdatePolicy(policy.id, 'edit')}
                >
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdatePolicy(policy.id, policy.status === 'active' ? 'deactivate' : 'activate')}
                >
                  {policy.status === 'active' ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
