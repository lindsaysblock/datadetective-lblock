
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lightbulb, TrendingUp, Target, Zap } from 'lucide-react';

interface AIRecommendationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AIRecommendationsModal: React.FC<AIRecommendationsModalProps> = ({
  open,
  onOpenChange
}) => {
  const recommendations = [
    {
      icon: TrendingUp,
      title: "Trend Analysis",
      description: "Focus on seasonal patterns in your data to identify peak performance periods",
      priority: "High"
    },
    {
      icon: Target,
      title: "Targeted Insights",
      description: "Segment your analysis by customer demographics for more actionable insights",
      priority: "Medium"
    },
    {
      icon: Zap,
      title: "Quick Wins",
      description: "Implement A/B testing on your top-performing variables to optimize results",
      priority: "High"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            AI Recommendations
          </DialogTitle>
          <DialogDescription>
            Based on your analysis, here are personalized recommendations to help you get the most out of your data.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <rec.icon className="w-5 h-5 mt-1 text-primary" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold">{rec.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded ${rec.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>
            Got it
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIRecommendationsModal;
