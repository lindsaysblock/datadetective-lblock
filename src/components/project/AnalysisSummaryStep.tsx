
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, FileText, Database, MessageSquare, Play, GraduationCap } from 'lucide-react';

interface AnalysisSummaryStepProps {
  researchQuestion: string;
  additionalContext: string;
  file: File | null;
  parsedData: any;
  isProcessingAnalysis: boolean;
  onResearchQuestionChange: (question: string) => void;
  onStartAnalysis: () => void;
  onPrevious: () => void;
}

const AnalysisSummaryStep: React.FC<AnalysisSummaryStepProps> = ({
  researchQuestion,
  additionalContext,
  file,
  parsedData,
  isProcessingAnalysis,
  onStartAnalysis,
  onPrevious
}) => {
  const [educationMode, setEducationMode] = useState(true);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
            4
          </div>
          <h3 className="text-lg font-semibold">Review & Start Analysis</h3>
        </div>

        {/* Education Toggle */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <div>
                <Label htmlFor="education-mode" className="text-sm font-medium text-blue-800">
                  Educational Mode
                </Label>
                <p className="text-xs text-blue-600">
                  Get detailed explanations of analysis steps and methodologies
                </p>
              </div>
            </div>
            <Switch
              id="education-mode"
              checked={educationMode}
              onCheckedChange={setEducationMode}
            />
          </div>
        </div>

        {/* Summary Cards */}
        <div className="space-y-4 mb-6">
          {/* Research Question */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-purple-600" />
              <span className="font-medium text-sm">Research Question</span>
            </div>
            <p className="text-gray-700">{researchQuestion || 'No research question provided'}</p>
          </div>

          {/* Data Source */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span className="font-medium text-sm">Data Source</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-gray-700">{file ? file.name : 'No file uploaded'}</span>
              {parsedData && (
                <Badge variant="outline" className="text-xs">
                  {parsedData.rows || 0} rows
                </Badge>
              )}
            </div>
          </div>

          {/* Business Context */}
          {additionalContext && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-green-600" />
                <span className="font-medium text-sm">Business Context</span>
              </div>
              <p className="text-gray-700">{additionalContext}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious} disabled={isProcessingAnalysis}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button 
            onClick={onStartAnalysis}
            disabled={!researchQuestion || !file || isProcessingAnalysis}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center gap-2"
            size="lg"
          >
            <Play className="w-4 h-4" />
            {isProcessingAnalysis ? 'Starting Analysis...' : 'Start The Case'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisSummaryStep;
