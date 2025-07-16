
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FileSearch } from 'lucide-react';
import { SPACING } from '@/constants/ui';

interface AdditionalContextSectionProps {
  additionalContext: string;
  onAdditionalContextChange: (value: string) => void;
}

const AdditionalContextSection: React.FC<AdditionalContextSectionProps> = ({
  additionalContext,
  onAdditionalContextChange
}) => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardContent className={`p-${SPACING.MD}`}>
        <div className={`flex items-center gap-${SPACING.XS} mb-${SPACING.XS}`}>
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
            3
          </div>
          <FileSearch className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Additional Context</h3>
          <span className="text-sm text-muted-foreground">(Optional)</span>
        </div>
        <p className={`text-muted-foreground mb-${SPACING.SM}`}>
          Provide any business context or background information about your data
        </p>
        <Textarea
          placeholder="e.g., This data comes from our e-commerce platform and includes customer purchase history from the last 6 months..."
          value={additionalContext}
          onChange={(e) => onAdditionalContextChange(e.target.value)}
          className="min-h-[80px] resize-none bg-background/50 border-border/50 focus:border-primary/50"
        />
      </CardContent>
    </Card>
  );
};

export default AdditionalContextSection;
