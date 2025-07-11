
import React, { useState } from 'react';
import ProjectAnalysisHeader from './analysis/ProjectAnalysisHeader';
import ProjectContextCard from './analysis/ProjectContextCard';
import DigDeeperCard from './analysis/DigDeeperCard';
import AnalysisResultsCard from './analysis/AnalysisResultsCard';
import AnalysisExportBar from './analysis/AnalysisExportBar';
import AnalysisActionBar from './analysis/AnalysisActionBar';
import DetailedAnalysisResults from './analysis/DetailedAnalysisResults';
import AskMoreQuestionsModal from './analysis/AskMoreQuestionsModal';
import QuestionLogDisplay from './analysis/QuestionLogDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuestionLog } from '@/hooks/useQuestionLog';
import { DataAnalysisContext } from '@/types/data';

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
  const [showAskMoreModal, setShowAskMoreModal] = useState(false);
  
  const {
    questionLog,
    generatedVisuals,
    isAnalyzing,
    addQuestion,
    addVisualization,
    exportQuestionLog
  } = useQuestionLog();

  // Create analysis context for additional questions
  const analysisContext: DataAnalysisContext = {
    researchQuestion,
    additionalContext,
    parsedData: analysisResults?.parsedData || [],
    columnMapping: analysisResults?.columnMapping || {},
    educationalMode
  };

  const handleSubmitQuestion = async (question: string, context: DataAnalysisContext) => {
    await addQuestion(question, context);
  };

  const handleExportFindings = () => {
    console.log('Export findings', analysisResults);
    exportQuestionLog();
  };

  const handleExportVisuals = () => {
    console.log('Export visuals', analysisResults);
  };

  const handleCreateRecurringReport = () => {
    console.log('Create recurring report', analysisResults);
  };

  const handleAskMoreQuestions = () => {
    setShowAskMoreModal(true);
  };

  const handleShowAIRecommendations = () => {
    console.log('Show AI recommendations');
    // TODO: Implement AI recommendations modal
  };

  const handleCreateVisuals = () => {
    console.log('Create visuals');
    // TODO: Implement create visuals modal
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <ProjectAnalysisHeader 
          projectName={projectName}
          onBackToProject={onBackToProject}
        />

        {/* Analysis Results Card - At the top */}
        <div className="mb-8">
          <AnalysisResultsCard analysisResults={analysisResults} />
        </div>

        {/* Let's Dig Deeper Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🔍 Let's Dig Deeper</h2>
            <AnalysisActionBar
              onAskMoreQuestions={handleAskMoreQuestions}
              onShowAIRecommendations={handleShowAIRecommendations}
              onCreateVisuals={handleCreateVisuals}
              onExportFindings={handleExportFindings}
            />
          </div>
        </div>

        <Tabs defaultValue="detailed" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
            <TabsTrigger value="questions">Question Log ({questionLog.length})</TabsTrigger>
            <TabsTrigger value="context">Project Context</TabsTrigger>
          </TabsList>

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

          <TabsContent value="questions">
            <div className="space-y-6">
              <QuestionLogDisplay
                questionLog={questionLog}
                onExportLog={exportQuestionLog}
                onViewVisualizations={(questionId) => {
                  console.log('View visualizations for question:', questionId);
                }}
              />
              
              {questionLog.length === 0 && (
                <div className="text-center py-12">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No additional questions yet</h3>
                    <p className="text-gray-500">Ask more questions to dive deeper into your analysis</p>
                  </div>
                  <AnalysisActionBar
                    onAskMoreQuestions={handleAskMoreQuestions}
                    onShowAIRecommendations={handleShowAIRecommendations}
                    onCreateVisuals={handleCreateVisuals}
                    onExportFindings={handleExportFindings}
                  />
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

        {/* Export & Share at the bottom */}
        <div className="mt-8">
          <AnalysisExportBar
            onExportFindings={handleExportFindings}
            onExportVisuals={handleExportVisuals}
            onCreateRecurringReport={handleCreateRecurringReport}
          />
        </div>

        <AskMoreQuestionsModal
          open={showAskMoreModal}
          onOpenChange={setShowAskMoreModal}
          currentAnalysis={analysisResults}
          onSubmitQuestion={handleSubmitQuestion}
          isAnalyzing={isAnalyzing}
          analysisContext={analysisContext}
        />
      </div>
    </div>
  );
};

export default ProjectAnalysisView;
