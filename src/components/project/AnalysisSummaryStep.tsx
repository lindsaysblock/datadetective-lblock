
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, FileText, Database, Users, Calendar } from 'lucide-react';
import DataDetectiveLogo from '@/components/DataDetectiveLogo';

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
  const [educationalMode, setEducationalMode] = React.useState(false);

  // Get project name directly from formData
  const projectName = formData?.projectName || '';

  console.log('🔍 AnalysisSummaryStep render - PROJECT NAME:', {
    projectName: projectName,
    projectNameLength: projectName?.length || 0,
    formDataProjectName: formData?.projectName,
    hasSetProjectName: !!formData?.setProjectName,
    researchQuestion: researchQuestion,
    hasData: !!(parsedData && parsedData.length > 0),
    formDataKeys: formData ? Object.keys(formData) : 'NO FORM DATA'
  });

  // Auto-set a default project name if none exists and we have a research question
  useEffect(() => {
    console.log('🔍 AnalysisSummaryStep useEffect - Auto project name check:', {
      currentProjectName: projectName,
      hasResearchQuestion: !!researchQuestion,
      hasSetProjectName: !!formData?.setProjectName,
      shouldAutoSet: !projectName && researchQuestion && formData?.setProjectName
    });
    
    if (!projectName && researchQuestion && formData?.setProjectName) {
      const defaultName = `Analysis: ${researchQuestion.substring(0, 30)}${researchQuestion.length > 30 ? '...' : ''}`;
      console.log('🎯 Auto-setting default project name:', defaultName);
      formData.setProjectName(defaultName);
    }
  }, [projectName, researchQuestion, formData?.setProjectName]);

  const handleProjectNameChange = (value: string) => {
    console.log('🎯 Project name input changed to:', value);
    if (formData?.setProjectName) {
      formData.setProjectName(value);
    } else {
      console.error('❌ setProjectName function not available in formData');
    }
  };

  const handleStartAnalysis = () => {
    const finalProjectName = projectName?.trim();
    
    console.log('🚀 Starting analysis with:', {
      projectName: finalProjectName,
      researchQuestion,
      hasData: !!(parsedData && parsedData.length > 0)
    });

    if (!finalProjectName) {
      console.error('❌ No project name provided');
      alert('Please enter a project name');
      return;
    }

    if (!researchQuestion?.trim()) {
      console.error('❌ No research question provided');
      alert('Please enter a research question');
      return;
    }

    if (!parsedData || parsedData.length === 0) {
      console.error('❌ No data available');
      alert('Please upload data before starting analysis');
      return;
    }

    try {
      onStartAnalysis(educationalMode, finalProjectName);
    } catch (error) {
      console.error('❌ Error starting analysis:', error);
      alert('An error occurred while starting the analysis. Please try again.');
    }
  };

  const totalRows = parsedData?.reduce((sum, data) => sum + (data.rowCount || data.rows || 0), 0) || 0;
  const totalFiles = parsedData?.length || 0;

  return (
    <div className="space-y-6">
      {/* Header with Logo */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <DataDetectiveLogo size="lg" showText={true} animated={true} />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Analysis Summary
        </h2>
        <p className="text-gray-600">Review your project details before starting the investigation</p>
      </div>

      {/* Project Name Input */}
      <Card className="border-2 border-gradient-to-r from-blue-200 to-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Project Name
            </span>
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
              className="w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            {!projectName && (
              <p className="text-sm text-red-500">Project name is required</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Research Question Summary */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Research Question
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 font-medium">{researchQuestion || 'No research question provided'}</p>
          {additionalContext && (
            <div className="mt-3 pt-3 border-t border-purple-100">
              <h4 className="font-medium text-gray-800 mb-1">Additional Context:</h4>
              <p className="text-gray-600 text-sm">{additionalContext}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Data Overview
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{totalFiles}</div>
              <div className="text-sm text-blue-700">Files</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{totalRows.toLocaleString()}</div>
              <div className="text-sm text-green-700">Total Rows</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {parsedData?.[0]?.columnInfo?.length || parsedData?.[0]?.columns || 0}
              </div>
              <div className="text-sm text-purple-700">Columns</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {Object.keys(columnMapping || {}).length}
              </div>
              <div className="text-sm text-orange-700">Mapped Fields</div>
            </div>
          </div>

          {parsedData && parsedData.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500" />
                Files to Analyze:
              </h4>
              {parsedData.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="font-medium text-sm text-gray-800">{data.name}</div>
                      <div className="text-xs text-gray-600">
                        {(data.rowCount || data.rows || 0).toLocaleString()} rows • {data.columnInfo?.length || data.columns || 0} columns
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                    Ready
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Options */}
      <Card className="border-l-4 border-l-pink-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-pink-600" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analysis Options
            </span>
          </CardTitle>
          <CardDescription>
            Choose how you want to run your investigation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
            <input
              type="checkbox"
              id="educational"
              checked={educationalMode}
              onChange={(e) => setEducationalMode(e.target.checked)}
              className="rounded border-purple-300 text-purple-600 focus:ring-purple-500"
            />
            <Label htmlFor="educational" className="text-sm font-medium">
              🎓 Educational Mode (detailed explanations and step-by-step guidance)
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2 hover:bg-gray-50">
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <Button 
          onClick={handleStartAnalysis}
          disabled={!researchQuestion || !projectName?.trim() || !parsedData || parsedData.length === 0 || isProcessingAnalysis}
          className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 text-white flex items-center gap-2 px-8 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Play className="w-4 h-4" />
          {isProcessingAnalysis ? '🔍 Starting Investigation...' : '🚀 Start Investigation'}
        </Button>
      </div>
    </div>
  );
};

export default AnalysisSummaryStep;
