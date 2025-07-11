
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, BookOpen, Sparkles } from 'lucide-react';
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
  const hasData = parsedData && parsedData.length > 0;
  const totalRows = hasData ? parsedData.reduce((sum, file) => sum + (file.rows || 0), 0) : 0;
  const totalFiles = hasData ? parsedData.length : 0;

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
        <p className="text-gray-600">Review your setup and start the analysis</p>
      </div>

      {/* Summary Card */}
      <Card className="w-full shadow-sm border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
              4
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Analysis Summary</h3>
              <p className="text-gray-500 text-sm mt-1">Everything looks good - ready to analyze!</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Research Question</h4>
              <p className="text-gray-700 text-sm">{researchQuestion || 'General data analysis'}</p>
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
                <div className="text-sm text-gray-700">
                  <p>{totalFiles} file{totalFiles > 1 ? 's' : ''} with {totalRows.toLocaleString()} total rows</p>
                  {columnMapping && (
                    <div className="mt-2 space-y-1">
                      {columnMapping.valueColumns?.length > 0 && (
                        <p>• Numeric columns: {columnMapping.valueColumns.join(', ')}</p>
                      )}
                      {columnMapping.categoryColumns?.length > 0 && (
                        <p>• Category columns: {columnMapping.categoryColumns.join(', ')}</p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-700">Database connection or demo analysis</p>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={() => onStartAnalysis(false)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 h-auto flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Start Analysis</div>
                <div className="text-xs text-purple-200">Get instant insights</div>
              </div>
            </Button>

            <Button 
              onClick={() => onStartAnalysis(true)}
              variant="outline"
              className="flex-1 bg-white hover:bg-orange-50 hover:border-orange-300 px-6 py-3 h-auto flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5 text-orange-600" />
              <div className="text-left">
                <div className="font-medium text-gray-900">Educational Mode</div>
                <div className="text-xs text-gray-500">Learn how it works</div>
              </div>
            </Button>
          </div>
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
