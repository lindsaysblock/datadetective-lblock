
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, HelpCircle } from 'lucide-react';

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

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    console.log('Text change detected:', value);
    
    if (typeof setResearchQuestion === 'function') {
      setResearchQuestion(value);
    } else {
      console.error('setResearchQuestion is not a function!');
    }
  };

  return (
    <div className="container mx-auto px-6 max-w-4xl">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Step Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center text-lg font-semibold">
              1
            </div>
            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-purple-600" />
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              What's your question?
            </h2>
            <p className="text-gray-500">
              What do you want to answer?
            </p>
          </div>
        </div>
        
        {/* Text Input */}
        <Textarea
          placeholder="how many rows"
          value={researchQuestion || ''}
          onChange={handleTextChange}
          className="min-h-[200px] resize-none text-lg border-gray-200 rounded-lg p-4 bg-gray-50 focus:bg-white transition-colors duration-200"
        />
        
        {/* Next Button */}
        <div className="flex justify-end mt-8">
          <Button 
            onClick={onNext}
            disabled={!researchQuestion?.trim()}
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg flex items-center gap-2 text-base font-medium transition-all duration-200"
          >
            Next <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResearchQuestionStep;
