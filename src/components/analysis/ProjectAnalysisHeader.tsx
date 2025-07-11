
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ProjectAnalysisHeaderProps {
  projectName: string;
  onBackToProject: () => void;
}

const ProjectAnalysisHeader: React.FC<ProjectAnalysisHeaderProps> = ({
  projectName,
  onBackToProject
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <Button
        variant="outline"
        onClick={onBackToProject}
        className="flex items-center gap-2 bg-white hover:bg-gray-50"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Button>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">{projectName}</h1>
        <p className="text-gray-600 mt-1">Analysis Results</p>
      </div>
      <div className="w-[120px]" />
    </div>
  );
};

export default ProjectAnalysisHeader;
