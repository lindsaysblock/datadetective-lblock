
/**
 * Analysis Action Bar Component
 * Refactored to meet coding standards with proper constants and semantic theming
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquareText, Brain, BarChart3, Download } from 'lucide-react';
import { SPACING } from '@/constants/ui';

interface AnalysisActionBarProps {
  onAskMoreQuestions: () => void;
  onShowAIRecommendations: () => void;
  onCreateVisuals: () => void;
  onExportFindings: () => void;
}

const AnalysisActionBar: React.FC<AnalysisActionBarProps> = ({
  onAskMoreQuestions,
  onShowAIRecommendations,
  onCreateVisuals,
  onExportFindings
}) => {
  return (
    <div className={`bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 p-${SPACING.XL} rounded-xl border-2 border-blue-200 mb-${SPACING.XL} shadow-lg`}>
      <div className={`text-center mb-${SPACING.LG}`}>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">🚀 What's Next?</h3>
        <p className="text-lg text-gray-700">Dive deeper into your data with these powerful tools</p>
      </div>
      
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-${SPACING.LG}`}>
        <Button
          onClick={onAskMoreQuestions}
          size="lg"
          className={`h-auto p-${SPACING.LG} bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex flex-col items-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200`}
        >
          <MessageSquareText className={`w-${SPACING.XL} h-${SPACING.XL}`} />
          <div className="text-center">
            <div className="font-bold text-lg">Ask More Questions</div>
            <div className="text-sm opacity-90 mt-1">Get deeper insights</div>
          </div>
        </Button>

        <Button
          onClick={onShowAIRecommendations}
          size="lg"
          className={`h-auto p-${SPACING.LG} bg-gradient-to-br from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 flex flex-col items-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200`}
        >
          <Brain className={`w-${SPACING.XL} h-${SPACING.XL}`} />
          <div className="text-center">
            <div className="font-bold text-lg">AI Recommendations</div>
            <div className="text-sm opacity-90 mt-1">Better metrics & questions</div>
          </div>
        </Button>

        <Button
          onClick={onCreateVisuals}
          size="lg"
          className="h-auto p-6 bg-gradient-to-br from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 flex flex-col items-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
        >
          <BarChart3 className="w-8 h-8" />
          <div className="text-center">
            <div className="font-bold text-lg">Create Visuals</div>
            <div className="text-sm opacity-90 mt-1">Charts & graphs</div>
          </div>
        </Button>

        <Button
          onClick={onExportFindings}
          size="lg"
          className="h-auto p-6 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex flex-col items-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
        >
          <Download className="w-8 h-8" />
          <div className="text-center">
            <div className="font-bold text-lg">Export Report</div>
            <div className="text-sm opacity-90 mt-1">Download findings</div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default AnalysisActionBar;
