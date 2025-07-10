
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquareText, Lightbulb, Send, Sparkles } from 'lucide-react';

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
  onSubmitQuestion: (question: string) => void;
}

const AskMoreQuestionsModal: React.FC<AskMoreQuestionsModalProps> = ({
  open,
  onOpenChange,
  currentAnalysis,
  onSubmitQuestion
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
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleSubmitCustomQuestion = () => {
    if (customQuestion.trim()) {
      onSubmitQuestion(customQuestion);
      setCustomQuestion('');
      onOpenChange(false);
    }
  };

  const handleSelectSuggestion = (question: string) => {
    onSubmitQuestion(question);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquareText className="w-5 h-5 text-purple-600" />
            Ask More Questions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Custom Question Input */}
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h3 className="font-medium text-gray-800">Ask Your Own Question</h3>
              </div>
              <Textarea
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="What would you like to know about your data? Be specific about what insights you're looking for..."
                className="min-h-[100px] mb-3"
              />
              <Button 
                onClick={handleSubmitCustomQuestion}
                disabled={!customQuestion.trim()}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                <Send className="w-4 h-4 mr-2" />
                Analyze This Question
              </Button>
            </CardContent>
          </Card>

          {/* Suggested Questions */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-800">💡 Suggested Questions</h3>
            </div>
            
            <div className="grid gap-4">
              {suggestedQuestions.map((suggestion, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 mb-2">{suggestion.question}</h4>
                        <p className="text-sm text-gray-600 mb-2">{suggestion.businessValue}</p>
                      </div>
                      <div className="flex flex-col gap-1 ml-4">
                        <Badge variant="secondary" className="text-xs">
                          {suggestion.category}
                        </Badge>
                        <Badge className={`text-xs ${getDifficultyColor(suggestion.difficulty)}`}>
                          {suggestion.difficulty}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleSelectSuggestion(suggestion.question)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Explore This Question
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
