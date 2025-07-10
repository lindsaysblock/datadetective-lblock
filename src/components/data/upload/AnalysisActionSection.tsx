
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Save, Sparkles } from 'lucide-react';

interface AnalysisActionSectionProps {
  isReadyToAnalyze: boolean;
  parsedData: any;
  onStartAnalysis: () => void;
  onSaveDataset: () => void;
}

const AnalysisActionSection: React.FC<AnalysisActionSectionProps> = ({
  isReadyToAnalyze,
  parsedData,
  onStartAnalysis,
  onSaveDataset
}) => {
  return (
    <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-800">Ready to Investigate?</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Let our AI detective analyze your data and uncover insights
            </p>
          </div>
          
          <div className="flex gap-3">
            {parsedData && (
              <Button 
                onClick={onSaveDataset}
                variant="outline"
                className="border-purple-200 hover:bg-purple-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Dataset
              </Button>
            )}
            
            <Button 
              onClick={onStartAnalysis}
              disabled={!isReadyToAnalyze}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start Detective Analysis
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisActionSection;
