
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import DatasetLibrary from '../DatasetLibrary';

interface ProjectLibraryTabProps {
  user: any;
  onDatasetSelect: (dataset: any) => void;
}

const ProjectLibraryTab: React.FC<ProjectLibraryTabProps> = ({
  user,
  onDatasetSelect
}) => {
  if (!user) {
    return (
      <Card className="text-center py-12">
        <div className="text-center">
          <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Sign In Required</h3>
          <p className="text-gray-500 mb-4">Create an account to save and manage your cases</p>
          <Button onClick={() => window.location.href = '/auth'}>
            Sign In / Sign Up
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Case History</h2>
        <p className="text-gray-600">Resume investigation on your saved cases</p>
      </div>
      <DatasetLibrary onDatasetSelect={onDatasetSelect} />
    </div>
  );
};

export default ProjectLibraryTab;
