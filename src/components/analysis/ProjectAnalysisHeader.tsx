
/**
 * Project Analysis Header Component
 * Refactored to meet coding standards with proper constants and semantic styling
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { SPACING, TEXT_SIZES, ICON_SIZES } from '@/constants/ui';

interface ProjectAnalysisHeaderProps {
  projectName: string;
  onBackToProject: () => void;
}

const ProjectAnalysisHeader: React.FC<ProjectAnalysisHeaderProps> = ({
  projectName,
  onBackToProject
}) => {
  return (
    <div className={`flex items-center justify-between mb-${SPACING.XL}`}>
      <Button
        variant="outline"
        onClick={onBackToProject}
        className={`flex items-center gap-${SPACING.SM} bg-background hover:bg-muted`}
      >
        <ArrowLeft className={ICON_SIZES.SM} />
        Back to Projects
      </Button>
      <div className="text-center">
        <h1 className={`${TEXT_SIZES.HEADING} font-bold text-foreground`}>{projectName}</h1>
        <p className={`text-muted-foreground mt-${SPACING.XS}`}>Analysis Results</p>
      </div>
      <div className="w-[120px]" />
    </div>
  );
};

export default ProjectAnalysisHeader;
