
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FileSearch } from 'lucide-react';

interface AdditionalContextSectionProps {
  additionalContext: string;
  onAdditionalContextChange: (value: string) => void;
}

const AdditionalContextSection: React.FC<AdditionalContextSectionProps> = ({
  additionalContext,
  onAdditionalContextChange
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <FileSearch className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Step 3: Additional Context</h3>
          <span className="text-sm text-gray-500">(Optional)</span>
        </div>
        <p className="text-gray-600 mb-4">
          Provide any business context or background information about your data
        </p>
        <Textarea
          placeholder="e.g., This data comes from our e-commerce platform and includes customer purchase history from the last 6 months..."
          value={additionalContext}
          onChange={(e) => onAdditionalContextChange(e.target.value)}
          className="min-h-[80px] resize-none"
        />
      </CardContent>
    </Card>
  );
};

export default AdditionalContextSection;
