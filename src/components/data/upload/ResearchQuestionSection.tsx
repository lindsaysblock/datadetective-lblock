
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle } from 'lucide-react';
import { SPACING } from '@/constants/ui';

interface ResearchQuestionSectionProps {
  researchQuestion: string;
  onResearchQuestionChange: (value: string) => void;
}

const ResearchQuestionSection: React.FC<ResearchQuestionSectionProps> = ({
  researchQuestion,
  onResearchQuestionChange
}) => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className={`p-${SPACING.MD}`}>
        <div className={`flex items-center gap-${SPACING.XS} mb-${SPACING.XS}`}>
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
            1
          </div>
          <HelpCircle className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">What's your question?</h3>
        </div>
        <p className={`text-muted-foreground mb-${SPACING.SM}`}>
          What do you want to answer?
        </p>
        <Textarea
          placeholder="e.g., What are the main trends in customer behavior over time?"
          value={researchQuestion}
          onChange={(e) => onResearchQuestionChange(e.target.value)}
          className="min-h-[100px] resize-none bg-background/50 border-border/50 focus:border-primary/50"
        />
      </CardContent>
    </Card>
  );
};

export default ResearchQuestionSection;
