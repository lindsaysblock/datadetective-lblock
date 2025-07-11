
import React, { useState } from 'react';
import ProjectAnalysisHeader from './analysis/ProjectAnalysisHeader';
import ProjectContextCard from './analysis/ProjectContextCard';
import DigDeeperCard from './analysis/DigDeeperCard';
import AnalysisResultsCard from './analysis/AnalysisResultsCard';
import AnalysisExportBar from './analysis/AnalysisExportBar';

interface ProjectAnalysisViewProps {
  projectName: string;
  analysisResults: any;
  onBackToProject: () => void;
  researchQuestion: string;
  additionalContext: string;
  dataSource: string;
  educationalMode?: boolean;
}

const ProjectAnalysisView: React.FC<ProjectAnalysisViewProps> = ({
  projectName,
  analysisResults,
  onBackToProject,
  researchQuestion,
  additionalContext,
  dataSource,
  educationalMode = false
}) => {
  const [isContextOpen, setIsContextOpen] = useState(false);

  const handleExportFindings = () => {
    console.log('Export findings');
  };

  const handleExportVisuals = () => {
    console.log('Export visuals');
  };

  const handleCreateRecurringReport = () => {
    console.log('Create recurring report');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <ProjectAnalysisHeader 
          projectName={projectName}
          onBackToProject={onBackToProject}
        />

        <AnalysisExportBar
          onExportFindings={handleExportFindings}
          onExportVisuals={handleExportVisuals}
          onCreateRecurringReport={handleCreateRecurringReport}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <AnalysisResultsCard analysisResults={analysisResults} />
          </div>

          <div className="space-y-6">
            <ProjectContextCard
              researchQuestion={researchQuestion}
              dataSource={dataSource}
              additionalContext={additionalContext}
              isOpen={isContextOpen}
              onOpenChange={setIsContextOpen}
            />

            <DigDeeperCard onExportFindings={handleExportFindings} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalysisView;
