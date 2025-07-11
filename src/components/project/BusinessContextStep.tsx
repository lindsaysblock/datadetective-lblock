
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface BusinessContextStepProps {
  additionalContext: string;
  setAdditionalContext: (value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const BusinessContextStep: React.FC<BusinessContextStepProps> = ({
  additionalContext,
  setAdditionalContext,
  onNext,
  onPrevious
}) => {
  return (
    <Card className="w-full shadow-sm border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
            3
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Business Context</h3>
            <p className="text-gray-500 text-sm mt-1">Help us understand your data better (optional)</p>
          </div>
        </div>
        
        <Textarea
          placeholder="e.g., This data comes from our e-commerce platform and includes customer purchase history from the last 6 months..."
          value={additionalContext}
          onChange={(e) => setAdditionalContext(e.target.value)}
          className="min-h-[120px] resize-none text-base border-gray-300 mb-6 bg-white"
        />
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2 bg-white hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button 
            onClick={onNext}
            className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 flex items-center gap-2"
          >
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessContextStep;
