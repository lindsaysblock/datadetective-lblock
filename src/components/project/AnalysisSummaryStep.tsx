
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Play, BookOpen, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AnalysisResultsCard from '@/components/analysis/AnalysisResultsCard';

interface AnalysisSummaryStepProps {
  researchQuestion: string;
  additionalContext: string;
  parsedData?: any[];
  columnMapping?: any;
  analysisResults?: any;
  analysisCompleted?: boolean;
  isProcessingAnalysis?: boolean;
  onStartAnalysis: (educational: boolean) => void;
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
  const hasData = parsedData && parsedData.length > 0;
  const hasResearchQuestion = researchQuestion && researchQuestion.trim().length > 0;

  console.log('AnalysisSummaryStep props:', {
    researchQuestion,
    hasResearchQuestion,
    researchQuestionLength: researchQuestion?.length || 0,
    additionalContext: additionalContext?.slice(0, 50) + '...',
    hasData,
    analysisCompleted,
    isProcessingAnalysis
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
  if (isProcessingAnalysis) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Data...</h2>
          <p className="text-gray-600">Please wait while we process your analysis</p>
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

  // Default summary view before starting analysis
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready for Analysis</h2>
        <p className="text-gray-600">Review your setup and start the case</p>
      </div>

      {/* Show error if no research question */}
      {!hasResearchQuestion && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Research Question Required - Please provide a research question before starting analysis.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Card */}
      <Card className="w-full shadow-sm border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
              4
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Analysis Summary</h3>
              <p className="text-gray-500 text-sm mt-1">
                {hasResearchQuestion ? 'Everything looks good - ready to analyze!' : 'Please complete all required fields'}
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className={`p-4 rounded-lg ${hasResearchQuestion ? 'bg-gray-50' : 'bg-red-50 border border-red-200'}`}>
              <h4 className="font-medium text-gray-900 mb-2">Research Question</h4>
              <p className={`text-sm ${hasResearchQuestion ? 'text-gray-700' : 'text-red-600'}`}>
                {hasResearchQuestion ? researchQuestion : 'Please go back and provide a research question'}
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
                  Learn how to analyze step-by-step
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
            />
          </div>

          {/* Start Case Button */}
          <Button 
            onClick={() => onStartAnalysis(educationalMode)}
            disabled={!hasResearchQuestion}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-4 h-auto flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-6 h-6" />
            <div>
              <div className="font-semibold">Start the Case</div>
              <div className="text-sm text-purple-200">
                {educationalMode ? 'With step-by-step guidance' : 'Get instant insights'}
              </div>
            </div>
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2 bg-white hover:bg-gray-50">
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
      </div>
    </div>
  );
};

export default AnalysisSummaryStep;
