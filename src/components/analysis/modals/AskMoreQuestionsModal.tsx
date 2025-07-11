
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare } from 'lucide-react';

interface AskMoreQuestionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: string;
  onQuestionChange: (question: string) => void;
  onSubmit: () => void;
}

const AskMoreQuestionsModal: React.FC<AskMoreQuestionsModalProps> = ({
  open,
  onOpenChange,
  question,
  onQuestionChange,
  onSubmit
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Ask Additional Questions
          </DialogTitle>
          <DialogDescription>
            What else would you like to know about this data? Ask follow-up questions to dig deeper into your analysis.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            placeholder="What patterns do you see in the seasonal trends?"
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            className="w-full"
          />
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={!question.trim()}>
              Ask Question
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AskMoreQuestionsModal;
