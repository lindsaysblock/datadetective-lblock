
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle } from 'lucide-react';

interface ResearchQuestionSectionProps {
  researchQuestion: string;
  onResearchQuestionChange: (value: string) => void;
}

const ResearchQuestionSection: React.FC<ResearchQuestionSectionProps> = ({
  researchQuestion,
  onResearchQuestionChange
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-semibold">
            1
          </div>
          <HelpCircle className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Step 1: Research Question</h3>
        </div>
        <p className="text-gray-600 mb-4">
          What specific question would you like to explore with this data?
        </p>
        <Textarea
          placeholder="e.g., What are the main trends in customer behavior over time?"
          value={researchQuestion}
          onChange={(e) => onResearchQuestionChange(e.target.value)}
          className="min-h-[100px] resize-none"
        />
      </CardContent>
    </Card>
  );
};

export default ResearchQuestionSection;
