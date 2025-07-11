
import React, { useState } from 'react';
import ProjectAnalysisHeader from './analysis/ProjectAnalysisHeader';
import ProjectContextCard from './analysis/ProjectContextCard';
import DigDeeperCard from './analysis/DigDeeperCard';
import AnalysisResultsCard from './analysis/AnalysisResultsCard';
import AnalysisExportBar from './analysis/AnalysisExportBar';
import DetailedAnalysisResults from './analysis/DetailedAnalysisResults';
import AskMoreQuestionsModal from './analysis/AskMoreQuestionsModal';
import QuestionLogDisplay from './analysis/QuestionLogDisplay';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus } from 'lucide-react';
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

        {/* Ask More Questions Button */}
        <div className="flex justify-center mb-6">
          <Button
            onClick={() => setShowAskMoreModal(true)}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          >
            <MessageSquarePlus className="w-4 h-4 mr-2" />
            Ask More Questions
          </Button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Executive Summary</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
            <TabsTrigger value="questions">Question Log ({questionLog.length})</TabsTrigger>
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
                <div className="text-center py-8">
                  <Button
                    onClick={() => setShowAskMoreModal(true)}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    <MessageSquarePlus className="w-4 h-4 mr-2" />
                    Ask Your First Additional Question
                  </Button>
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
