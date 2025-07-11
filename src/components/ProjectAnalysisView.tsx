
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MessageSquare, Lightbulb, BarChart3, Download } from 'lucide-react';
import SQLQueryBreakdown from './analysis/SQLQueryBreakdown';
import AnalysisActionBar from './analysis/AnalysisActionBar';

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
  const [additionalQuestion, setAdditionalQuestion] = useState('');

  const handleAskMoreQuestions = () => {
    console.log('Ask more questions:', additionalQuestion);
  };

  const handleShowRecommendations = () => {
    console.log('Show AI recommendations');
  };

  const handleCreateVisuals = () => {
    console.log('Create visualizations');
  };

  const handleExportFindings = () => {
    console.log('Export findings');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Project Context */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Project Context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Research Question</h3>
                  <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{researchQuestion}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Data Source</h3>
                  <p className="text-gray-700 bg-green-50 p-3 rounded-lg">{dataSource}</p>
                </div>

                {additionalContext && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Business Context</h3>
                    <p className="text-gray-700 bg-purple-50 p-3 rounded-lg">{additionalContext}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dig Deeper Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">🔍 Let's Dig Deeper</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ask Additional Questions
                  </label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="What else would you like to know about this data?"
                      value={additionalQuestion}
                      onChange={(e) => setAdditionalQuestion(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleAskMoreQuestions} className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Ask
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <Button
                    variant="outline"
                    onClick={handleShowRecommendations}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Lightbulb className="w-4 h-4" />
                    Get AI Recommendations
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleCreateVisuals}
                    className="flex items-center gap-2 justify-start"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Visualize the Answer
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleExportFindings}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Download className="w-4 h-4" />
                    Export Findings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Analysis Results */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Analysis Results</CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Confidence: <span className="font-medium capitalize">{analysisResults?.confidence || 'High'}</span></span>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="insights" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="insights">Key Insights</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="insights" className="mt-4">
                    <div className="prose prose-sm max-w-none">
                      <p className="text-gray-700 leading-relaxed">
                        {analysisResults?.insights || 'Based on your research question and data analysis, here are the key findings from your dataset. The analysis reveals several important patterns and trends that can help inform your decision-making process.'}
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="recommendations" className="mt-4">
                    <ul className="space-y-3">
                      {analysisResults?.recommendations?.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      )) || (
                        <>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-700">Consider implementing A/B testing for better insights</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-700">Focus on user engagement metrics to drive growth</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-gray-700">Optimize data collection processes for better accuracy</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Educational Mode SQL Breakdown */}
            {educationalMode && analysisResults?.queryBreakdown && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">📚 SQL Code Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <SQLQueryBreakdown
                    query={analysisResults.sqlQuery}
                    steps={analysisResults.queryBreakdown.steps}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalysisView;
