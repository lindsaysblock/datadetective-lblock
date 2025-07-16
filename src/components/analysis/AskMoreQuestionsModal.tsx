
/**
 * Ask More Questions Modal Component
 * Refactored to meet coding standards with proper constants and semantic styling
 */

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquareText, Lightbulb, Send, Sparkles, Loader2 } from 'lucide-react';
import { DataAnalysisContext } from '@/types/data';
import { SPACING, TEXT_SIZES, ICON_SIZES } from '@/constants/ui';

interface QuestionSuggestion {
  question: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  businessValue: string;
  category: string;
}

interface AskMoreQuestionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAnalysis: any;
  onSubmitQuestion: (question: string, context: DataAnalysisContext) => Promise<void>;
  isAnalyzing?: boolean;
  analysisContext: DataAnalysisContext;
}

const AskMoreQuestionsModal: React.FC<AskMoreQuestionsModalProps> = ({
  open,
  onOpenChange,
  currentAnalysis,
  onSubmitQuestion,
  isAnalyzing = false,
  analysisContext
}) => {
  const [customQuestion, setCustomQuestion] = useState('');

  // Generate suggested questions based on analysis
  const suggestedQuestions: QuestionSuggestion[] = [
    {
      question: "What are the key factors that drive user retention in my dataset?",
      difficulty: 'intermediate',
      businessValue: 'Identify retention drivers to improve user engagement strategies',
      category: 'User Behavior'
    },
    {
      question: "Are there seasonal patterns or trends I should be aware of?",
      difficulty: 'beginner',
      businessValue: 'Plan for seasonal variations and optimize resource allocation',
      category: 'Trends'
    },
    {
      question: "Which user segments show the highest lifetime value?",
      difficulty: 'advanced',
      businessValue: 'Focus marketing and product efforts on high-value segments',
      category: 'Segmentation'
    },
    {
      question: "What anomalies or outliers exist in my data?",
      difficulty: 'intermediate',
      businessValue: 'Identify potential issues or opportunities hidden in outliers',
      category: 'Data Quality'
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success/20 text-success';
      case 'intermediate': return 'bg-warning/20 text-warning';
      case 'advanced': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleSubmitCustomQuestion = async () => {
    if (customQuestion.trim() && !isAnalyzing) {
      await onSubmitQuestion(customQuestion, analysisContext);
      setCustomQuestion('');
      onOpenChange(false);
    }
  };

  const handleSelectSuggestion = async (question: string) => {
    if (!isAnalyzing) {
      await onSubmitQuestion(question, analysisContext);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquareText className={`${ICON_SIZES.SM} text-primary`} />
            Ask More Questions
          </DialogTitle>
        </DialogHeader>

        <div className={`space-y-${SPACING.LG}`}>
          {/* Custom Question Input */}
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className={`p-${SPACING.MD}`}>
              <div className={`flex items-center gap-${SPACING.SM} mb-${SPACING.SM}`}>
                <Sparkles className={`${ICON_SIZES.SM} text-primary`} />
                <h3 className={`${TEXT_SIZES.MEDIUM} font-medium text-foreground`}>Ask Your Own Question</h3>
              </div>
              <Textarea
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="What would you like to know about your data? Be specific about what insights you're looking for..."
                className={`min-h-[100px] mb-${SPACING.SM}`}
                disabled={isAnalyzing}
              />
              <Button 
                onClick={handleSubmitCustomQuestion}
                disabled={!customQuestion.trim() || isAnalyzing}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className={`${ICON_SIZES.SM} mr-${SPACING.SM} animate-spin`} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className={`${ICON_SIZES.SM} mr-${SPACING.SM}`} />
                    Analyze This Question
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Suggested Questions */}
          <div>
            <div className={`flex items-center gap-${SPACING.SM} mb-${SPACING.MD}`}>
              <Lightbulb className={`${ICON_SIZES.SM} text-warning`} />
              <h3 className={`${TEXT_SIZES.LARGE} font-semibold text-foreground`}>💡 Suggested Questions</h3>
            </div>
            
            <div className={`grid gap-${SPACING.MD}`}>
              {suggestedQuestions.map((suggestion, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow border">
                  <CardContent className={`p-${SPACING.MD}`}>
                    <div className={`flex items-start justify-between mb-${SPACING.SM}`}>
                      <div className="flex-1">
                        <h4 className={`font-medium text-foreground mb-${SPACING.XS}`}>{suggestion.question}</h4>
                        <p className={`${TEXT_SIZES.SMALL} text-muted-foreground mb-${SPACING.XS}`}>{suggestion.businessValue}</p>
                      </div>
                      <div className={`flex flex-col gap-1 ml-${SPACING.MD}`}>
                        <Badge variant="secondary" className={TEXT_SIZES.SMALL}>
                          {suggestion.category}
                        </Badge>
                        <Badge className={`${TEXT_SIZES.SMALL} ${getDifficultyColor(suggestion.difficulty)}`}>
                          {suggestion.difficulty}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleSelectSuggestion(suggestion.question)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? 'Processing...' : 'Explore This Question'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AskMoreQuestionsModal;
