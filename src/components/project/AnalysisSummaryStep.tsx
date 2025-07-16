
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
    <div className="space-y-6 p-6 bg-gradient-to-br from-brand-blue/5 to-brand-purple/5 rounded-xl">
      {/* Header with Logo */}
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <DataDetectiveLogo size="xl" showText={true} animated={true} />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink bg-clip-text text-transparent mb-2">
          🕵️ Investigation Summary
        </h2>
        <p className="text-muted-foreground text-lg">Review your case details before starting the investigation</p>
      </div>

      {/* Project Name Input */}
      <Card className="border-2 border-brand-blue/20 bg-gradient-to-br from-white to-brand-blue/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-blue" />
            <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink bg-clip-text text-transparent">
              🕵️ Case Name
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="projectName">Give your investigation a memorable name</Label>
            <Input
              id="projectName"
              value={projectName}
              onChange={(e) => handleProjectNameChange(e.target.value)}
              placeholder="e.g., Customer Behavior Investigation"
              className="w-full focus:ring-2 focus:ring-brand-purple focus:border-brand-purple"
            />
            {!projectName && (
              <p className="text-sm text-destructive">Case name is required to start investigation</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Research Question Summary */}
      <Card className="border-l-4 border-l-brand-blue bg-gradient-to-r from-white to-brand-blue/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-brand-blue" />
            <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink bg-clip-text text-transparent">
              🔍 Research Question
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground font-medium">{researchQuestion || 'No research question provided'}</p>
          {additionalContext && (
            <div className="mt-3 pt-3 border-t border-brand-purple/20">
              <h4 className="font-medium text-foreground mb-1">Additional Context:</h4>
              <p className="text-muted-foreground text-sm">{additionalContext}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card className="border-l-4 border-l-brand-purple bg-gradient-to-r from-white to-brand-purple/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-purple" />
            <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink bg-clip-text text-transparent">
              📊 Evidence Overview
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-gradient-to-br from-brand-blue/10 to-brand-blue/20 rounded-lg border border-brand-blue/20">
              <div className="text-2xl font-bold text-brand-blue">{totalFiles}</div>
              <div className="text-sm text-brand-blue">Evidence Files</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-green-500/10 to-green-500/20 rounded-lg border border-green-500/20">
              <div className="text-2xl font-bold text-green-600">{totalRows.toLocaleString()}</div>
              <div className="text-sm text-green-600">Total Records</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-brand-purple/10 to-brand-purple/20 rounded-lg border border-brand-purple/20">
              <div className="text-2xl font-bold text-brand-purple">
                {parsedData?.[0]?.columnInfo?.length || parsedData?.[0]?.columns || 0}
              </div>
              <div className="text-sm text-brand-purple">Data Points</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-orange-500/10 to-orange-500/20 rounded-lg border border-orange-500/20">
              <div className="text-2xl font-bold text-orange-600">
                {Object.keys(columnMapping || {}).length}
              </div>
              <div className="text-sm text-orange-600">Mapped Fields</div>
            </div>
          </div>

          {parsedData && parsedData.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-blue" />
                📋 Files to Investigate:
              </h4>
              {parsedData.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-background to-brand-blue/5 rounded-lg border border-brand-blue/20">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-brand-blue" />
                    <div>
                      <div className="font-medium text-sm text-foreground">{data.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {(data.rowCount || data.rows || 0).toLocaleString()} records • {data.columnInfo?.length || data.columns || 0} data points
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                    🔍 Ready for Analysis
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Options */}
      <Card className="border-l-4 border-l-brand-pink bg-gradient-to-r from-white to-brand-pink/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-pink" />
            <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink bg-clip-text text-transparent">
              ⚙️ Investigation Options
            </span>
          </CardTitle>
          <CardDescription>
            Choose your detective approach for this case
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-brand-purple/5 to-brand-pink/5 rounded-lg border border-brand-purple/20">
            <input
              type="checkbox"
              id="educational"
              checked={educationalMode}
              onChange={(e) => setEducationalMode(e.target.checked)}
              className="rounded border-brand-purple/50 text-brand-purple focus:ring-brand-purple"
            />
            <Label htmlFor="educational" className="text-sm font-medium">
              📚 Educational Mode - Teach me how to code SQL step by step during the investigation
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2 hover:bg-muted">
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <Button 
          onClick={handleStartAnalysis}
          disabled={!researchQuestion || !projectName?.trim() || !parsedData || parsedData.length === 0 || isProcessingAnalysis}
          className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink hover:from-brand-blue/90 hover:via-brand-purple/90 hover:to-brand-pink/90 text-white flex items-center gap-2 px-8 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Play className="w-4 h-4" />
          {isProcessingAnalysis ? '🔍 Starting the Case...' : '🕵️ Start the Case'}
        </Button>
      </div>
    </div>
  );
};

export default AnalysisSummaryStep;
