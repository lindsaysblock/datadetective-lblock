
import React, { useState } from 'react';
import ProjectAnalysisHeader from './analysis/ProjectAnalysisHeader';
import ProjectContextCard from './analysis/ProjectContextCard';
import DigDeeperCard from './analysis/DigDeeperCard';
import AnalysisResultsCard from './analysis/AnalysisResultsCard';
import AnalysisExportBar from './analysis/AnalysisExportBar';
import DetailedAnalysisResults from './analysis/DetailedAnalysisResults';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    console.log('Export findings', analysisResults);
  };

  const handleExportVisuals = () => {
    console.log('Export visuals', analysisResults);
  };

  const handleCreateRecurringReport = () => {
    console.log('Create recurring report', analysisResults);
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

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Executive Summary</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
            <TabsTrigger value="context">Project Context</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <AnalysisResultsCard analysisResults={analysisResults} />
              </div>

              <div className="space-y-6">
                <DigDeeperCard onExportFindings={handleExportFindings} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="detailed">
            <div className="space-y-6">
              {analysisResults?.detailedResults && (
                <DetailedAnalysisResults results={analysisResults.detailedResults} />
              )}
              {!analysisResults?.detailedResults && (
                <div className="text-center py-12 text-gray-500">
                  <p>No detailed analysis results available.</p>
                  <p className="text-sm mt-2">Run a new analysis to see comprehensive results.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="context">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ProjectContextCard
                researchQuestion={researchQuestion}
                dataSource={dataSource}
                additionalContext={additionalContext}
                isOpen={isContextOpen}
                onOpenChange={setIsContextOpen}
              />
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Analysis Methodology</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>• Comprehensive data quality assessment</p>
                  <p>• Multi-dimensional behavioral analysis</p>
                  <p>• Statistical significance testing</p>
                  <p>• Business impact quantification</p>
                  <p>• Actionable recommendation generation</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectAnalysisView;
