
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowLeft, FileText, MessageSquare, Database, ChevronDown, ChevronUp, Lightbulb, TrendingUp } from 'lucide-react';

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
  const [isOverviewOpen, setIsOverviewOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={onBackToProject} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to New Project
          </Button>
          <div className="text-center flex-1 mx-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {projectName}
            </h1>
            <p className="text-blue-600 text-lg">Analysis Results</p>
          </div>
          <div className="w-32"></div>
        </div>

        {/* Collapsible Project Overview */}
        <Card className="mb-8">
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
      </div>
    </div>
  );
};

export default ProjectAnalysisView;
