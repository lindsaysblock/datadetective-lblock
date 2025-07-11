
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Lightbulb, BarChart3, Download } from 'lucide-react';
import { useAnalysisModals } from '@/hooks/useAnalysisModals';
import AskMoreQuestionsModal from './modals/AskMoreQuestionsModal';
import AIRecommendationsModal from './modals/AIRecommendationsModal';
import CreateVisualsModal from './modals/CreateVisualsModal';

interface DigDeeperCardProps {
  onExportFindings: () => void;
}

const DigDeeperCard: React.FC<DigDeeperCardProps> = ({
  onExportFindings
}) => {
  const [additionalQuestion, setAdditionalQuestion] = useState('');
  const { modals, actions } = useAnalysisModals();

  const handleAskQuestion = () => {
    console.log('Asking question:', additionalQuestion);
    setAdditionalQuestion('');
    actions.closeQuestionsModal();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">🔍 Let's Dig Deeper</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={actions.openQuestionsModal}
            className="w-full flex items-center gap-2 justify-start"
          >
            <MessageSquare className="w-4 h-4" />
            Ask Additional Questions
          </Button>
          
          <Button
            variant="outline"
            onClick={actions.openRecommendationsModal}
            className="w-full flex items-center gap-2 justify-start"
          >
            <Lightbulb className="w-4 h-4" />
            Get AI Recommendations
          </Button>
          
          <Button
            variant="outline"
            onClick={actions.openVisualsModal}
            className="w-full flex items-center gap-2 justify-start"
          >
            <BarChart3 className="w-4 h-4" />
            Visualize the Answer
          </Button>
          
          <Button
            variant="outline"
            onClick={onExportFindings}
            className="w-full flex items-center gap-2 justify-start"
          >
            <Download className="w-4 h-4" />
            Export Findings
          </Button>
        </CardContent>
      </Card>

      <AskMoreQuestionsModal
        open={modals.showQuestionsModal}
        onOpenChange={actions.closeQuestionsModal}
        question={additionalQuestion}
        onQuestionChange={setAdditionalQuestion}
        onSubmit={handleAskQuestion}
      />

      <AIRecommendationsModal
        open={modals.showRecommendationsModal}
        onOpenChange={actions.closeRecommendationsModal}
      />

      <CreateVisualsModal
        open={modals.showVisualsModal}
        onOpenChange={actions.closeVisualsModal}
      />
    </>
  );
};

export default DigDeeperCard;
