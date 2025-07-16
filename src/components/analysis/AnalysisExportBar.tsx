
/**
 * Analysis Export Bar Component
 * Refactored to meet coding standards with proper constants and semantic theming
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, BarChart3, Calendar, Share2 } from 'lucide-react';
import { SPACING } from '@/constants/ui';

interface AnalysisExportBarProps {
  onExportFindings: () => void;
  onExportVisuals: () => void;
  onCreateRecurringReport: () => void;
}

const AnalysisExportBar: React.FC<AnalysisExportBarProps> = ({
  onExportFindings,
  onExportVisuals,
  onCreateRecurringReport
}) => {
  return (
    <div className={`bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-${SPACING.MD} mb-${SPACING.LG}`}>
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-${SPACING.SM}`}>
          <Share2 className={`w-${SPACING.MD + 1} h-${SPACING.MD + 1} text-blue-600`} />
          <h3 className="font-semibold text-gray-800">Export & Share</h3>
          <span className="text-sm text-gray-600">Download your analysis or create reports</span>
        </div>
        
        <div className={`flex items-center gap-${SPACING.SM}`}>
          <Button 
            variant="outline"
            onClick={onExportFindings}
            className={`flex items-center gap-${SPACING.SM} hover:bg-blue-50`}
          >
            <FileText className={`w-${SPACING.MD} h-${SPACING.MD}`} />
            Export Findings
          </Button>
          
          <Button 
            variant="outline"
            onClick={onExportVisuals}
            className="flex items-center gap-2 hover:bg-purple-50"
          >
            <BarChart3 className="w-4 h-4" />
            Download Charts
          </Button>
          
          <Button 
            onClick={onCreateRecurringReport}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Calendar className="w-4 h-4" />
            Create Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisExportBar;
