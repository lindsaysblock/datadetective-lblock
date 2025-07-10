
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquareText, Brain, BarChart3, Sparkles } from 'lucide-react';

interface AnalysisActionBarProps {
  onAskMoreQuestions: () => void;
  onShowAIRecommendations: () => void;
  onCreateVisuals: () => void;
}

const AnalysisActionBar: React.FC<AnalysisActionBarProps> = ({
  onAskMoreQuestions,
  onShowAIRecommendations,
  onCreateVisuals
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200 mb-8">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">🚀 What's Next?</h3>
        <p className="text-sm text-gray-600">Dive deeper into your data with these powerful tools</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={onAskMoreQuestions}
          className="h-auto p-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 flex flex-col items-center gap-2"
        >
          <MessageSquareText className="w-6 h-6" />
          <div className="text-center">
            <div className="font-medium">Ask More Questions</div>
            <div className="text-xs opacity-90">Get deeper insights</div>
          </div>
        </Button>

        <Button
          onClick={onShowAIRecommendations}
          className="h-auto p-4 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 flex flex-col items-center gap-2"
        >
          <Brain className="w-6 h-6" />
          <div className="text-center">
            <div className="font-medium">AI Recommendations</div>
            <div className="text-xs opacity-90">Better metrics & questions</div>
          </div>
        </Button>

        <Button
          onClick={onCreateVisuals}
          className="h-auto p-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 flex flex-col items-center gap-2"
        >
          <BarChart3 className="w-6 h-6" />
          <div className="text-center">
            <div className="font-medium">Create Visuals</div>
            <div className="text-xs opacity-90">Charts & graphs</div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default AnalysisActionBar;
