
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
  Sparkles
} from 'lucide-react';

interface ProjectAnalysisViewProps {
  projectName: string;
  analysisResults: any;
  onBackToProject: () => void;
}

const ProjectAnalysisView: React.FC<ProjectAnalysisViewProps> = ({
  projectName,
  analysisResults,
  onBackToProject
}) => {
  const [followUpQuestion, setFollowUpQuestion] = useState('');

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
                <span className="text-lg">Project Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                <p>Your uploaded data and context information is displayed here.</p>
                <p className="mt-2">Dataset preview, column information, and data summary would be shown in this section.</p>
              </div>
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
                    Analysis results would appear here. This includes answers to your research question,
                    statistical findings, patterns identified, and data-driven insights.
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
