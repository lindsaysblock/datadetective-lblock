
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, HelpCircle } from 'lucide-react';

interface ResearchQuestionStepProps {
  researchQuestion: string;
  onResearchQuestionChange: (value: string) => void;
  onNext: () => void;
}

const ResearchQuestionStep: React.FC<ResearchQuestionStepProps> = ({
  researchQuestion,
  onResearchQuestionChange,
  onNext
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-semibold">
            1
          </div>
          <HelpCircle className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold">What's your question?</h3>
        </div>
        <p className="text-gray-600 mb-4">
          What do you want to answer?
        </p>
        <Textarea
          placeholder="e.g., What are the main trends in customer behavior over time?"
          value={researchQuestion}
          onChange={(e) => onResearchQuestionChange(e.target.value)}
          className="min-h-[100px] resize-none"
        />
        <div className="flex justify-end mt-4">
          <Button onClick={onNext}>
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResearchQuestionStep;
