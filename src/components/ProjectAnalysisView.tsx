
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FileText, MessageSquare, Database, ChevronDown, ChevronUp, Lightbulb, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnalysisHeader from './analysis/AnalysisHeader';
import AnalysisActionBar from './analysis/AnalysisActionBar';
import AnalysisExportBar from './analysis/AnalysisExportBar';
import AskMoreQuestionsModal from './analysis/AskMoreQuestionsModal';
import AIRecommendationsModal from './analysis/AIRecommendationsModal';
import CreateVisualsModal from './analysis/CreateVisualsModal';
import { useAnalysisModals } from '@/hooks/useAnalysisModals';
import { useAnalysisActions } from '@/hooks/useAnalysisActions';

interface ProjectAnalysisViewProps {
  projectName: string;
  analysisResults: any;
  onBackToProject: () => void;
  researchQuestion: string;
  additionalContext?: string;
  dataSource: string;
}

const ProjectAnalysisView: React.FC<ProjectAnalysisViewProps> = ({
  projectName,
  analysisResults,
  onBackToProject,
  researchQuestion,
  additionalContext,
  dataSource
}) => {
  const navigate = useNavigate();
  const [isOverviewOpen, setIsOverviewOpen] = useState(true);
  
  const { modals, actions } = useAnalysisModals();
  const analysisActions = useAnalysisActions(analysisResults);

  const handleNewProject = () => {
    navigate('/new-project');
  };

  const handleProjectHistory = () => {
    navigate('/query-history');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AnalysisHeader
        projectName={projectName}
        onBackToProject={onBackToProject}
        onNewProject={handleNewProject}
        onProjectHistory={handleProjectHistory}
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Collapsible Project Overview */}
        <Card className="mb-6">
          <Collapsible open={isOverviewOpen} onOpenChange={setIsOverviewOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Project Overview
                  </CardTitle>
                  {isOverviewOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Research Question */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-sm">Research Question</span>
                    </div>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{researchQuestion}</p>
                  </div>

                  {/* Data Source */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-sm">Data Source</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <span className="text-gray-700">{dataSource}</span>
                      <Badge variant="outline" className="ml-2">
                        CSV File
                      </Badge>
                    </div>
                  </div>

                  {/* Business Context */}
                  {additionalContext && (
                    <div className="space-y-2 md:col-span-2">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-sm">Business Context</span>
                      </div>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{additionalContext}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Export and Share Bar */}
        <AnalysisExportBar
          onExportFindings={analysisActions.handleExportFindings}
          onExportVisuals={analysisActions.handleExportVisuals}
          onCreateRecurringReport={analysisActions.handleCreateRecurringReport}
        />

        {/* Analysis Action Bar */}
        <AnalysisActionBar
          onAskMoreQuestions={actions.openQuestionsModal}
          onShowAIRecommendations={actions.openRecommendationsModal}
          onCreateVisuals={actions.openVisualsModal}
        />

        {/* Analysis Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Key Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{analysisResults?.insights}</p>
              <Badge className="bg-green-100 text-green-800">
                Confidence: {analysisResults?.confidence}
              </Badge>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {analysisResults?.recommendations?.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        <AskMoreQuestionsModal
          open={modals.showQuestionsModal}
          onOpenChange={actions.closeQuestionsModal}
          currentAnalysis={analysisResults}
          onSubmitQuestion={analysisActions.handleSubmitQuestion}
        />

        <AIRecommendationsModal
          open={modals.showRecommendationsModal}
          onOpenChange={actions.closeRecommendationsModal}
          analysisResults={analysisResults}
          onImplementRecommendation={analysisActions.handleImplementRecommendation}
        />

        <CreateVisualsModal
          open={modals.showVisualsModal}
          onOpenChange={actions.closeVisualsModal}
          analysisResults={analysisResults}
          researchQuestion={researchQuestion}
          onSelectVisualization={analysisActions.handleSelectVisualization}
        />
      </div>
    </div>
  );
};

export default ProjectAnalysisView;
