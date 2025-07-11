
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles } from 'lucide-react';

interface ResearchQuestionCardProps {
  researchQuestion: string;
  businessContext: string;
  setResearchQuestion: (value: string) => void;
  setBusinessContext: (value: string) => void;
  onAnalyze: () => void;
  canAnalyze: boolean;
}

const ResearchQuestionCard: React.FC<ResearchQuestionCardProps> = ({
  researchQuestion,
  businessContext,
  setResearchQuestion,
  setBusinessContext,
  onAnalyze,
  canAnalyze
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          What do you want to discover?
        </CardTitle>
        <CardDescription>
          Ask a question about user behavior, engagement, or business metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="research-question">Research Question</Label>
          <Input
            id="research-question"
            placeholder="e.g., What user behaviors predict high lifetime value? How do engagement patterns differ across user segments?"
            value={researchQuestion}
            onChange={(e) => setResearchQuestion(e.target.value)}
            className="text-sm"
          />
        </div>
        
        <div>
          <Label htmlFor="business-context">Business Context (Optional)</Label>
          <Textarea
            id="business-context"
            placeholder="e.g., We're a SaaS platform focused on improving user retention. Our main concern is understanding which early behaviors indicate long-term success..."
            value={businessContext}
            onChange={(e) => setBusinessContext(e.target.value)}
            className="text-sm min-h-[80px]"
          />
        </div>

        <Button 
          onClick={onAnalyze}
          disabled={!researchQuestion.trim() || !canAnalyze}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          🔍 Analyze Question
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResearchQuestionCard;
