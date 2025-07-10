
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, FileText, Settings } from 'lucide-react';

interface ReportsHeaderProps {
  isGenerating: boolean;
  newReportTitle: string;
  onCreateReport: () => void;
}

const ReportsHeader: React.FC<ReportsHeaderProps> = ({
  isGenerating,
  newReportTitle,
  onCreateReport
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <BarChart3 className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">📊 Visualization & Reporting</h3>
          <p className="text-sm text-gray-600">Create, schedule, and share visual reports</p>
        </div>
      </div>
      
      <Button 
        onClick={onCreateReport}
        disabled={isGenerating || !newReportTitle.trim()}
        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
      >
        {isGenerating ? (
          <>
            <Settings className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <FileText className="w-4 h-4 mr-2" />
            Create Report
          </>
        )}
      </Button>
    </div>
  );
};

export default ReportsHeader;
