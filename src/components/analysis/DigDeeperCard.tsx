
/**
 * Dig Deeper Card Component
 * Refactored to meet coding standards with proper constants and semantic styling
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Lightbulb, BarChart3, Download } from 'lucide-react';
import { useAnalysisModals } from '@/hooks/useAnalysisModals';
import AskMoreQuestionsModal from './modals/AskMoreQuestionsModal';
import AIRecommendationsModal from './modals/AIRecommendationsModal';
import CreateVisualsModal from './modals/CreateVisualsModal';
import { SPACING, TEXT_SIZES, ICON_SIZES } from '@/constants/ui';

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
          <CardTitle className={TEXT_SIZES.LARGE}>🔍 Let's Dig Deeper</CardTitle>
        </CardHeader>
        <CardContent className={`space-y-${SPACING.SM}`}>
          <Button
            onClick={actions.openQuestionsModal}
            className={`w-full flex items-center gap-${SPACING.SM} justify-start`}
          >
            <MessageSquare className={ICON_SIZES.SM} />
            Ask Additional Questions
          </Button>
          
          <Button
            variant="outline"
            onClick={actions.openRecommendationsModal}
            className={`w-full flex items-center gap-${SPACING.SM} justify-start`}
          >
            <Lightbulb className={ICON_SIZES.SM} />
            Get AI Recommendations
          </Button>
          
          <Button
            variant="outline"
            onClick={actions.openVisualsModal}
            className={`w-full flex items-center gap-${SPACING.SM} justify-start`}
          >
            <BarChart3 className={ICON_SIZES.SM} />
            Visualize the Answer
          </Button>
          
          <Button
            variant="outline"
            onClick={onExportFindings}
            className={`w-full flex items-center gap-${SPACING.SM} justify-start`}
          >
            <Download className={ICON_SIZES.SM} />
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
