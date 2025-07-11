
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

interface AnalysisSummaryStepProps {
  researchQuestion: string;
  file: File | null;
  additionalContext: string;
  isProcessingAnalysis: boolean;
  onPrevious: () => void;
  onStartAnalysis: (educationalMode: boolean) => void;
}

const AnalysisSummaryStep: React.FC<AnalysisSummaryStepProps> = ({
  researchQuestion,
  file,
  additionalContext,
  isProcessingAnalysis,
  onPrevious,
  onStartAnalysis
}) => {
  const [educationalMode, setEducationalMode] = React.useState(true);

  const handleStartAnalysis = () => {
    onStartAnalysis(educationalMode);
  };

  return (
    <Card className="w-full shadow-sm border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
            4
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Analysis</h3>
            <p className="text-gray-500 text-sm mt-1">Review your inputs and begin the analysis</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-6 mb-6">
          <h4 className="font-semibold mb-4 text-gray-900">Summary:</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium text-gray-900">Question:</span> {researchQuestion || 'Not specified'}</p>
            <p><span className="font-medium text-gray-900">Data:</span> {file ? file.name : 'No file uploaded'}</p>
            {additionalContext && (
              <p><span className="font-medium text-gray-900">Context:</span> {additionalContext}</p>
            )}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Educational Mode</h4>
              <p className="text-sm text-gray-600">Show step-by-step SQL query breakdown and learning insights in results</p>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="educational-mode"
                checked={educationalMode}
                onCheckedChange={setEducationalMode}
              />
              <Label htmlFor="educational-mode" className="text-sm font-medium">
                {educationalMode ? 'On' : 'Off'}
              </Label>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious} disabled={isProcessingAnalysis} className="flex items-center gap-2 bg-white hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button 
            onClick={handleStartAnalysis}
            disabled={!researchQuestion || !file || isProcessingAnalysis}
            className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-8 py-3 text-lg"
          >
            {isProcessingAnalysis ? 'Starting Analysis...' : 'Start the Case'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisSummaryStep;
