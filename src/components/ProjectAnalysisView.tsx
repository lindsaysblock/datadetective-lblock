
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Lightbulb, 
  BarChart3, 
  Download, 
  ArrowLeft,
  Sparkles,
  Edit3,
  Database,
  FileText
} from 'lucide-react';

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
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [editingContext, setEditingContext] = useState(false);
  const [editedContext, setEditedContext] = useState(additionalContext || '');
  const [editingQuestion, setEditingQuestion] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(researchQuestion);

  const handleAskFollowUp = () => {
    if (followUpQuestion.trim()) {
      console.log('Follow-up question:', followUpQuestion);
      setFollowUpQuestion('');
    }
  };

  const handleGetRecommendations = () => {
    console.log('Getting recommendations...');
  };

  const handleVisualize = () => {
    console.log('Creating visualization...');
  };

  const handleExport = () => {
    console.log('Exporting findings...');
  };

  const handleSaveContext = () => {
    setEditingContext(false);
    console.log('Updated context:', editedContext);
  };

  const handleSaveQuestion = () => {
    setEditingQuestion(false);
    console.log('Updated question:', editedQuestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex">
      {/* Left Half - Project Data */}
      <div className="w-1/2 p-6 border-r border-gray-200">
        <div className="space-y-4">
          <Button 
            variant="outline" 
            onClick={onBackToProject}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Project
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Badge variant="outline">{projectName}</Badge>
                <span className="text-lg">Project Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Research Question */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Research Question
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingQuestion(!editingQuestion)}
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </div>
                {editingQuestion ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editedQuestion}
                      onChange={(e) => setEditedQuestion(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveQuestion}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingQuestion(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    {editedQuestion}
                  </p>
                )}
              </div>

              {/* Data Source */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Data Source
                </h4>
                <p className="text-gray-700 p-3 bg-green-50 rounded-lg border border-green-200">
                  {dataSource.includes('.') ? `File uploaded: ${dataSource}` : 'Database connection established'}
                </p>
              </div>

              {/* Business Context */}
              {(additionalContext || editedContext) && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800">Business Context</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingContext(!editingContext)}
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                  {editingContext ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editedContext}
                        onChange={(e) => setEditedContext(e.target.value)}
                        className="min-h-[80px]"
                        placeholder="Add business context..."
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveContext}>Save</Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingContext(false)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      {editedContext}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Half - Analysis Results */}
      <div className="w-1/2 p-6">
        <div className="space-y-6">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Sparkles className="w-5 h-5" />
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-green-700">
                  Based on your research question and data, here are the key insights discovered:
                </p>
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <p className="text-gray-700">
                    {analysisResults?.insights || "Analysis results would appear here. This includes answers to your research question, statistical findings, patterns identified, and data-driven insights."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Let's Dig Deeper Section */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-800">Let's Dig Deeper</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 1. Free Text Follow-up Questions */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-700">
                  Ask Additional Questions
                </label>
                <div className="flex gap-2">
                  <Textarea
                    placeholder="What else would you like to know about this data?"
                    value={followUpQuestion}
                    onChange={(e) => setFollowUpQuestion(e.target.value)}
                    className="resize-none"
                    rows={2}
                  />
                  <Button 
                    onClick={handleAskFollowUp}
                    disabled={!followUpQuestion.trim()}
                    className="shrink-0"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Ask
                  </Button>
                </div>
              </div>

              {/* 2. Recommendations */}
              <Button 
                onClick={handleGetRecommendations}
                variant="outline"
                className="w-full justify-start"
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Get Recommendations
              </Button>

              {/* 3. Visualize */}
              <Button 
                onClick={handleVisualize}
                variant="outline"
                className="w-full justify-start"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Visualize the Answer
              </Button>

              {/* 4. Export Findings */}
              <Button 
                onClick={handleExport}
                variant="outline"
                className="w-full justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Findings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectAnalysisView;
