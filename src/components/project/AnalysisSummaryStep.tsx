
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Play, BookOpen, FolderPlus } from 'lucide-react';
import AnalysisResultsCard from '@/components/analysis/AnalysisResultsCard';

interface AnalysisSummaryStepProps {
  researchQuestion: string;
  additionalContext: string;
  parsedData?: any[];
  columnMapping?: any;
  analysisResults?: any;
  analysisCompleted?: boolean;
  isProcessingAnalysis?: boolean;
  onStartAnalysis: (educational: boolean, projectName: string) => void;
  onPrevious: () => void;
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
  onPrevious
}) => {
  const [educationalMode, setEducationalMode] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [nameError, setNameError] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  
  const hasData = parsedData && parsedData.length > 0;
  const hasResearchQuestion = researchQuestion && researchQuestion.trim().length > 0;
  const canProceed = hasResearchQuestion && projectName.trim().length > 0;

  console.log('AnalysisSummaryStep props:', {
    researchQuestion: researchQuestion?.slice(0, 50) + '...',
    hasResearchQuestion,
    researchQuestionLength: researchQuestion?.length || 0,
    additionalContext: additionalContext?.slice(0, 50) + '...',
    hasData,
    analysisCompleted,
    isProcessingAnalysis,
    projectName,
    canProceed
  });

  // If analysis is completed, show the results
  if (analysisCompleted && analysisResults) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete!</h2>
          <p className="text-gray-600">Here are your analysis results</p>
        </div>

        <AnalysisResultsCard analysisResults={analysisResults} />

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  // If analysis is processing, show progress
  if (isProcessingAnalysis || isStarting) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Data...</h2>
          <p className="text-gray-600">Please wait while we process your analysis for "{projectName}"</p>
        </div>

        <Card className="w-full">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Running analysis on your dataset...</p>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  const checkProjectNameExists = async (name: string): Promise<boolean> => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase
        .from('datasets')
        .select('id')
        .eq('name', name.trim())
        .limit(1);

      if (error) {
        console.error('Error checking project name:', error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error('Error checking project name:', error);
      return false;
    }
  };

  const handleStartAnalysis = async () => {
    if (!canProceed) return;

    setNameError('');
    setIsStarting(true);
    
    try {
      // Check if project name already exists
      const nameExists = await checkProjectNameExists(projectName);
      if (nameExists) {
        setNameError('A project with this name already exists. Please choose a different name.');
        setIsStarting(false);
        return;
      }

      // Automatically start analysis after successful validation
      onStartAnalysis(educationalMode, projectName);
    } catch (error) {
      console.error('Error starting analysis:', error);
      setNameError('An error occurred while starting the analysis. Please try again.');
      setIsStarting(false);
    }
  };

  const handleProjectNameChange = (value: string) => {
    setProjectName(value);
    if (nameError) {
      setNameError('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canProceed && !isStarting) {
      handleStartAnalysis();
    }
  };

  // Default summary view before starting analysis
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 4: Review & Start Analysis</h2>
        <p className="text-gray-600">Name your project and start the analysis</p>
      </div>

      {/* Project Naming and Analysis Summary Combined */}
      <Card className="w-full shadow-sm border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Project Setup</h3>
              <p className="text-gray-500 text-sm mb-4">
                Give your analysis project a name and review your configuration
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="project-name" className="text-sm font-medium text-gray-700 mb-2 block">
                    Project Name
                  </Label>
                  <Input
                    id="project-name"
                    placeholder="e.g., Sales Data Analysis, Customer Survey Insights..."
                    value={projectName}
                    onChange={(e) => handleProjectNameChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`w-full ${nameError ? 'border-red-500' : ''}`}
                    disabled={isStarting}
                  />
                  {nameError && (
                    <p className="text-red-500 text-sm mt-1">{nameError}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Research Question</h4>
              <p className="text-sm text-gray-700">
                {hasResearchQuestion ? researchQuestion : 'No research question provided'}
              </p>
            </div>

            {additionalContext && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Business Context</h4>
                <p className="text-gray-700 text-sm">{additionalContext}</p>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Data Source</h4>
              {hasData ? (
                <div className="text-sm text-gray-700 space-y-2">
                  {parsedData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between py-1">
                      <span className="font-medium">
                        {data.name || `File ${index + 1}`}
                      </span>
                      <span className="text-gray-500">
                        {(data.summary?.totalRows || data.rowCount || 0).toLocaleString()} rows × {' '}
                        {data.summary?.totalColumns || data.columns?.length || 0} columns
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-700">Database connection or demo analysis</p>
              )}
            </div>
          </div>

          {/* Educational Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg mb-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-orange-600" />
              <div>
                <Label htmlFor="educational-mode" className="text-sm font-medium text-gray-900 cursor-pointer">
                  Learn how to code step-by-step
                </Label>
                <p className="text-xs text-gray-600 mt-1">
                  Get detailed explanations of each analysis step
                </p>
              </div>
            </div>
            <Switch
              id="educational-mode"
              checked={educationalMode}
              onCheckedChange={setEducationalMode}
              disabled={isStarting}
            />
          </div>

          {/* Start Analysis Button */}
          <Button 
            onClick={handleStartAnalysis}
            disabled={!canProceed || isStarting}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-4 h-auto flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStarting ? (
              <>
                <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full" />
                <div>
                  <div className="font-semibold">Starting Analysis...</div>
                  <div className="text-sm text-purple-200">
                    Saving project and initializing
                  </div>
                </div>
              </>
            ) : (
              <>
                <Play className="w-6 h-6" />
                <div>
                  <div className="font-semibold">Start the Case</div>
                  <div className="text-sm text-purple-200">
                    {educationalMode ? 'With step-by-step guidance' : 'Get instant insights'}
                  </div>
                </div>
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2 bg-white hover:bg-gray-50" disabled={isStarting}>
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
      </div>
    </div>
  );
};

export default AnalysisSummaryStep;
