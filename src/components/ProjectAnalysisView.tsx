
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BarChart3, FileText, Database, Lightbulb } from 'lucide-react';
import SQLQueryBreakdown from './analysis/SQLQueryBreakdown';

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
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
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
          <div className="w-[120px]" /> {/* Spacer for centering */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Research Question
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{researchQuestion}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="w-5 h-5" />
                Data Source
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{dataSource}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Confidence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 capitalize">{analysisResults?.confidence || 'Medium'}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white">
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            {educationalMode && (
              <TabsTrigger value="sql-breakdown">SQL Breakdown</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="insights" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {analysisResults?.insights || 'Analysis insights will appear here...'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysisResults?.recommendations?.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  )) || <li className="text-gray-500">No recommendations available.</li>}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {educationalMode && analysisResults?.queryBreakdown && (
            <TabsContent value="sql-breakdown" className="mt-6">
              <SQLQueryBreakdown
                query={analysisResults.sqlQuery}
                steps={analysisResults.queryBreakdown.steps}
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectAnalysisView;
