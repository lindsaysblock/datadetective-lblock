
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Lightbulb, BarChart3, Download } from 'lucide-react';

interface DigDeeperCardProps {
  additionalQuestion: string;
  onAdditionalQuestionChange: (value: string) => void;
  onAskMoreQuestions: () => void;
  onShowRecommendations: () => void;
  onCreateVisuals: () => void;
  onExportFindings: () => void;
}

const DigDeeperCard: React.FC<DigDeeperCardProps> = ({
  additionalQuestion,
  onAdditionalQuestionChange,
  onAskMoreQuestions,
  onShowRecommendations,
  onCreateVisuals,
  onExportFindings
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">🔍 Let's Dig Deeper</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ask Additional Questions
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="What else would you like to know about this data?"
              value={additionalQuestion}
              onChange={(e) => onAdditionalQuestionChange(e.target.value)}
              className="flex-1"
            />
            <Button onClick={onAskMoreQuestions} className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Ask
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="outline"
            onClick={onShowRecommendations}
            className="flex items-center gap-2 justify-start"
          >
            <Lightbulb className="w-4 h-4" />
            Get AI Recommendations
          </Button>
          
          <Button
            variant="outline"
            onClick={onCreateVisuals}
            className="flex items-center gap-2 justify-start"
          >
            <BarChart3 className="w-4 h-4" />
            Visualize the Answer
          </Button>
          
          <Button
            variant="outline"
            onClick={onExportFindings}
            className="flex items-center gap-2 justify-start"
          >
            <Download className="w-4 h-4" />
            Export Findings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DigDeeperCard;
