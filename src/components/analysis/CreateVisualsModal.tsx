
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DataVisualization from '../DataVisualization';
import { generateVisualizationRecommendations } from '../../utils/visualizationGenerator';

interface CreateVisualsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysisResults: any;
  researchQuestion: string;
  onSelectVisualization: (type: string, data: any[]) => void;
}

const CreateVisualsModal: React.FC<CreateVisualsModalProps> = ({
  open,
  onOpenChange,
  analysisResults,
  researchQuestion,
  onSelectVisualization
}) => {
  // Generate visualization recommendations based on the analysis results
  const recommendations = generateVisualizationRecommendations(
    researchQuestion,
    { summary: { possibleTimestampColumns: [], columns: [] }, data: [] }, // Mock parsed data structure
    analysisResults?.businessContext
  );

  const handleVisualizationSelect = (type: string, data: any[]) => {
    onSelectVisualization(type, data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            📊 Create Visualizations
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600">
              Choose from AI-recommended visualizations based on your analysis results and research question.
            </p>
          </div>

          <DataVisualization
            recommendations={recommendations}
            onSelectVisualization={handleVisualizationSelect}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVisualsModal;
