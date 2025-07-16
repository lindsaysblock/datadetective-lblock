
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle, ArrowRight } from 'lucide-react';

interface ResearchQuestionStepProps {
  researchQuestion: string;
  setResearchQuestion: (value: string) => void;
  onNext: () => void;
}

const ResearchQuestionStep: React.FC<ResearchQuestionStepProps> = ({
  researchQuestion,
  setResearchQuestion,
  onNext
}) => {
  console.log('ResearchQuestionStep rendering with question:', researchQuestion);
  console.log('setResearchQuestion function:', typeof setResearchQuestion);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    console.log('Text change detected:', value);
    console.log('setResearchQuestion type:', typeof setResearchQuestion);
    
    if (typeof setResearchQuestion === 'function') {
      setResearchQuestion(value);
    } else {
      console.error('setResearchQuestion is not a function!');
    }
  };

  return (
    <Card className="w-full shadow-sm border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
            1
          </div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-500" />
            <div>
              <h3 className="text-xl font-semibold text-gray-900">What's your question?</h3>
              <p className="text-gray-500 text-sm mt-1">What do you want to answer?</p>
            </div>
          </div>
        </div>
        
        <Textarea
          placeholder="e.g., What are the main trends in customer behavior over time?"
          value={researchQuestion || ''}
          onChange={handleTextChange}
          className="min-h-[120px] resize-none text-base border-gray-300 mb-6 bg-white"
        />
        
        <div className="flex justify-end">
          <Button 
            onClick={onNext}
            disabled={!researchQuestion?.trim()}
            className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 flex items-center gap-2"
          >
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResearchQuestionStep;
