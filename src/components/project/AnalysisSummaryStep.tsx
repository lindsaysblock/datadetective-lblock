
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Analysis</h2>
        </div>

        <div className="space-y-6">
          {/* Research Question Section */}
          <div className="space-y-2">
            <Label htmlFor="research-question" className="text-base font-medium text-gray-900">
              Research Question
            </Label>
            <Textarea
              id="research-question"
              value={researchQuestion}
              readOnly
              className="min-h-[120px] bg-gray-50 border-gray-200 text-gray-700 resize-none"
              placeholder="What do you want to discover from this data? (e.g., 'What are the main trends in sales over time?')"
            />
          </div>

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

          {/* Start Analysis Button */}
          <Button 
            onClick={handleStartAnalysis}
            disabled={isProcessingAnalysis}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold h-auto"
          >
            {isProcessingAnalysis ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
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
