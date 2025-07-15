
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, FileText, Database, Users, Calendar } from 'lucide-react';

interface AnalysisSummaryStepProps {
  researchQuestion: string;
  additionalContext: string;
  parsedData: any[];
  columnMapping: Record<string, string>;
  analysisResults?: any;
  analysisCompleted: boolean;
  isProcessingAnalysis: boolean;
  onStartAnalysis: (educationalMode: boolean, projectName: string) => void;
  onPrevious: () => void;
  formData: any;
}

const AnalysisSummaryStep: React.FC<AnalysisSummaryStepProps> = ({
  researchQuestion,
  additionalContext,
  parsedData,
  columnMapping,
  analysisResults,
  analysisCompleted,
  isProcessingAnalysis,
  onStartAnalysis,
  onPrevious,
  formData
}) => {
  const projectName = formData?.projectName || '';
  const [educationalMode, setEducationalMode] = React.useState(false);

  console.log('AnalysisSummaryStep render - formData debugging:', {
    formDataExists: !!formData,
    formDataKeys: formData ? Object.keys(formData) : [],
    projectNameFromFormData: formData?.projectName,
    projectNameLength: formData?.projectName?.length || 0,
    setProjectNameExists: !!formData?.setProjectName,
    researchQuestion: researchQuestion ? `${researchQuestion.substring(0, 13)}...` : 'None',
    hasData: !!(parsedData && parsedData.length > 0),
  });

  // Auto-set a default project name if none exists and we have a research question
  useEffect(() => {
    console.log('AnalysisSummaryStep useEffect triggered:', {
      projectName,
      hasResearchQuestion: !!researchQuestion,
      hasSetProjectName: !!formData?.setProjectName
    });
    
    if (!projectName && researchQuestion && formData?.setProjectName) {
      const defaultName = `Analysis: ${researchQuestion.substring(0, 30)}${researchQuestion.length > 30 ? '...' : ''}`;
      console.log('Auto-setting default project name:', defaultName);
      formData.setProjectName(defaultName);
    }
  }, [projectName, researchQuestion, formData?.setProjectName]);

  const handleProjectNameChange = (value: string) => {
    console.log('Project name input changed to:', value);
    if (formData?.setProjectName) {
      formData.setProjectName(value);
    } else {
      console.error('setProjectName function not available in formData');
    }
  };

  const handleStartAnalysis = () => {
    const finalProjectName = projectName?.trim();
    
    console.log('Starting analysis with:', {
      projectName: finalProjectName,
      researchQuestion,
      hasData: !!(parsedData && parsedData.length > 0)
    });

    if (!finalProjectName) {
      console.error('No project name provided');
      alert('Please enter a project name');
      return;
    }

    if (!researchQuestion?.trim()) {
      console.error('No research question provided');
      alert('Please enter a research question');
      return;
    }

    if (!parsedData || parsedData.length === 0) {
      console.error('No data available');
      alert('Please upload data before starting analysis');
      return;
    }

    try {
      onStartAnalysis(educationalMode, finalProjectName);
    } catch (error) {
      console.error('Error starting analysis:', error);
      alert('An error occurred while starting the analysis. Please try again.');
    }
  };

  const totalRows = parsedData?.reduce((sum, data) => sum + (data.rowCount || data.rows || 0), 0) || 0;
  const totalFiles = parsedData?.length || 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Analysis Summary</h2>
        <p className="text-gray-600">Review your project details before starting the analysis</p>
      </div>

      {/* Project Name Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Project Name
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="projectName">Give your investigation a name</Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => handleProjectNameChange(e.target.value)}
              placeholder="e.g., Customer Behavior Analysis"
              className="w-full"
            />
            {!projectName && (
              <p className="text-sm text-red-500">Project name is required</p>
            )}
            <p className="text-xs text-gray-500">
              Current value: "{projectName || 'None'}"
            </p>
            <p className="text-xs text-gray-400">
              Debug: formData.projectName = "{formData?.projectName || 'undefined'}"
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Research Question Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Research Question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{researchQuestion || 'No research question provided'}</p>
          {additionalContext && (
            <div className="mt-3 pt-3 border-t">
              <h4 className="font-medium text-gray-800 mb-1">Additional Context:</h4>
              <p className="text-gray-600 text-sm">{additionalContext}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Data Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalFiles}</div>
              <div className="text-sm text-gray-500">Files</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalRows.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Rows</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {parsedData?.[0]?.columnInfo?.length || parsedData?.[0]?.columns || 0}
              </div>
              <div className="text-sm text-gray-500">Columns</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Object.keys(columnMapping || {}).length}
              </div>
              <div className="text-sm text-gray-500">Mapped Fields</div>
            </div>
          </div>

          {parsedData && parsedData.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800">Files to Analyze:</h4>
              {parsedData.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-sm">{data.name}</div>
                      <div className="text-xs text-gray-500">
                        {(data.rowCount || data.rows || 0).toLocaleString()} rows • {data.columnInfo?.length || data.columns || 0} columns
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">Ready</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Analysis Options
          </CardTitle>
          <CardDescription>
            Choose how you want to run your analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="educational"
              checked={educationalMode}
              onChange={(e) => setEducationalMode(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="educational" className="text-sm">
              Educational Mode (detailed explanations and step-by-step guidance)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <Button 
          onClick={handleStartAnalysis}
          disabled={!researchQuestion || !projectName?.trim() || !parsedData || parsedData.length === 0 || isProcessingAnalysis}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          {isProcessingAnalysis ? 'Starting Analysis...' : 'Start Analysis'}
        </Button>
      </div>
    </div>
  );
};

export default AnalysisSummaryStep;
