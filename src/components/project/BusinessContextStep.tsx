
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, FileSearch } from 'lucide-react';

interface BusinessContextStepProps {
  researchQuestion: string;
  additionalContext: string;
  onAdditionalContextChange: (value: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const BusinessContextStep: React.FC<BusinessContextStepProps> = ({
  researchQuestion,
  additionalContext,
  onAdditionalContextChange,
  onPrevious,
  onNext
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-semibold">
            3
          </div>
          <FileSearch className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold">Business Context</h3>
          <span className="text-sm text-gray-500">(Optional)</span>
        </div>
        
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-medium mb-1">Your Research Question:</p>
          <p className="text-gray-700">{researchQuestion || 'No question specified yet'}</p>
        </div>
        
        <p className="text-gray-600 mb-4">
          Provide any business context or background information about your data
        </p>
        <Textarea
          placeholder="e.g., This data comes from our e-commerce platform and includes customer purchase history from the last 6 months. I am building a business case for a bundling product feature to increase average order value and customer retention."
          value={additionalContext}
          onChange={(e) => onAdditionalContextChange(e.target.value)}
          className="min-h-[100px] resize-none"
        />
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={onPrevious}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button onClick={onNext}>
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessContextStep;
