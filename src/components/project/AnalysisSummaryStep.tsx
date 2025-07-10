
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { AnalysisActionSection } from '@/components/data/upload/AnalysisActionSection';

interface AnalysisSummaryStepProps {
  researchQuestion: string;
  additionalContext: string;
  file: File | null;
  parsedData: any;
  isProcessingAnalysis: boolean;
  onResearchQuestionChange: (value: string) => void;
  onStartAnalysis: () => void;
  onPrevious: () => void;
}

const AnalysisSummaryStep: React.FC<AnalysisSummaryStepProps> = ({
  researchQuestion,
  additionalContext,
  file,
  parsedData,
  isProcessingAnalysis,
  onResearchQuestionChange,
  onStartAnalysis,
  onPrevious
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-2">1. Research Question</h4>
            <p className="text-green-700">{researchQuestion}</p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">2. Data Source</h4>
            <p className="text-blue-700">
              {file ? `File uploaded: ${file.name}` : 'Database connection established'}
            </p>
          </div>
          
          {additionalContext && (
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">3. Business Context</h4>
              <p className="text-purple-700">{additionalContext}</p>
            </div>
          )}
        </div>

        <AnalysisActionSection
          researchQuestion={researchQuestion}
          setResearchQuestion={onResearchQuestionChange}
          parsedData={parsedData}
          onStartAnalysis={onStartAnalysis}
          buttonText="Start the Case"
          showProgress={isProcessingAnalysis}
        />

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={onPrevious}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisSummaryStep;
