
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Play, CheckCircle, FileText, Database, MessageSquare } from 'lucide-react';

interface AnalysisSummaryStepProps {
  researchQuestion: string;
  files: File[];
  additionalContext: string;
  isProcessingAnalysis: boolean;
  onPrevious: () => void;
  onStartAnalysis: (educationalMode: boolean) => void;
}

const AnalysisSummaryStep: React.FC<AnalysisSummaryStepProps> = ({
  researchQuestion,
  files,
  additionalContext,
  isProcessingAnalysis,
  onPrevious,
  onStartAnalysis
}) => {
  const [educationalMode, setEducationalMode] = useState(false);

  const handleStartAnalysis = () => {
    onStartAnalysis(educationalMode);
  };

  return (
    <Card className="w-full shadow-sm border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
            4
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Review & Start Analysis</h3>
            <p className="text-gray-500 text-sm mt-1">Confirm your settings and begin the analysis</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Research Question */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">Research Question</h4>
              </div>
              <p className="text-blue-700 text-sm">{researchQuestion}</p>
            </div>

            {/* Data Sources */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <Database className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-green-800">Data Sources</h4>
              </div>
              <div className="space-y-1">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-green-600" />
                    <span className="text-green-700 text-sm">{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Context */}
          {additionalContext && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-purple-800">Additional Context</h4>
              </div>
              <p className="text-purple-700 text-sm">{additionalContext}</p>
            </div>
          )}

          {/* Educational Mode Toggle */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="educational-mode" className="text-amber-800 font-semibold">
                  Educational Mode
                </Label>
                <p className="text-amber-700 text-sm mt-1">
                  Enable to see step-by-step explanations of how the analysis is performed
                </p>
              </div>
              <Switch
                id="educational-mode"
                checked={educationalMode}
                onCheckedChange={setEducationalMode}
                className="ml-4"
              />
            </div>
          </div>

          {/* Ready to Analyze */}
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Ready to Analyze</h4>
            <p className="text-gray-600 text-sm mb-4">
              Your data and research question are ready. Click below to start the analysis.
            </p>
            <Button 
              onClick={handleStartAnalysis}
              disabled={isProcessingAnalysis}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 text-lg font-semibold"
            >
              {isProcessingAnalysis ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start Analysis
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2 bg-white hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          <div></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisSummaryStep;
