
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, History } from 'lucide-react';
import DataDetectiveLogo from '../DataDetectiveLogo';

interface QueryBuilderHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  handleStartNewProject: () => void;
  handleResumeProject: () => void;
}

const QueryBuilderHeader: React.FC<QueryBuilderHeaderProps> = ({
  activeTab,
  setActiveTab,
  handleStartNewProject,
  handleResumeProject
}) => {
  if (activeTab === 'analysis') return null;

  return (
    <div className="text-center mb-8">
      <DataDetectiveLogo />
    </div>
  );
};

export default QueryBuilderHeader;
