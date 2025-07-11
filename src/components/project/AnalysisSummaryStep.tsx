
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Sparkles } from 'lucide-react';

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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Analysis Summary</h2>
          <p className="text-gray-600">Review your case details before starting the analysis</p>
        </div>

        <div className="space-y-6">
          {/* Research Question Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Research Question</h3>
            <p className="text-blue-800">{researchQuestion}</p>
          </div>

          {/* Data Source Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">Data Source</h3>
            <p className="text-green-800">
              {files.length > 0 
                ? `Data source confirmed: ${files.length} file${files.length > 1 ? 's' : ''} uploaded`
                : 'Data source connected: Database connection'
              }
            </p>
          </div>

          {/* Educational Mode Toggle */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="educational-mode" className="text-amber-800 font-semibold">
                  Learn to Code
                </Label>
                <p className="text-amber-700 text-sm mt-1">
                  Learn how to code for data analysis with step-by-step explanations of the process
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

          {/* Start Analysis Button */}
          <Button 
            onClick={handleStartAnalysis}
            disabled={isProcessingAnalysis}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold h-auto"
          >
            {isProcessingAnalysis ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing Analysis...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Start the Case
              </>
            )}
          </Button>
        </div>

        <div className="flex justify-between mt-8">
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
