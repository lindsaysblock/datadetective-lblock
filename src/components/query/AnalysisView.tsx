
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, History } from 'lucide-react';
import AnalysisDashboard from '../AnalysisDashboard';

interface AnalysisViewProps {
  analysisData: any;
  currentFilename: string;
  findings: any[];
  setActiveTab: (tab: string) => void;
  setAnalysisData: (data: any) => void;
  handleStartNewProject: () => void;
  handleResumeProject: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({
  analysisData,
  currentFilename,
  findings,
  setActiveTab,
  setAnalysisData,
  handleStartNewProject,
  handleResumeProject
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => setActiveTab('upload')}
          className="mb-4"
        >
          ← Back to Dashboard
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleStartNewProject}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Button>
          <Button 
            variant="outline"
            onClick={handleResumeProject}
            className="flex items-center gap-2"
          >
            <History className="w-4 h-4" />
            Project History
          </Button>
        </div>
      </div>
      
      <AnalysisDashboard
        parsedData={analysisData}
        filename={currentFilename}
        findings={findings}
        onDataUpdate={setAnalysisData}
      />
    </div>
  );
};

export default AnalysisView;
