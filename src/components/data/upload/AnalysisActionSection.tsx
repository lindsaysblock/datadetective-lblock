
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Search, Save, Sparkles, GraduationCap } from 'lucide-react';

interface AnalysisActionSectionProps {
  isReadyToAnalyze: boolean;
  parsedData: any;
  onStartAnalysis: () => void;
  onSaveDataset: () => void;
  teachModeEnabled?: boolean;
  onTeachModeToggle?: (enabled: boolean) => void;
}

const AnalysisActionSection: React.FC<AnalysisActionSectionProps> = ({
  isReadyToAnalyze,
  parsedData,
  onStartAnalysis,
  onSaveDataset,
  teachModeEnabled = false,
  onTeachModeToggle
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
            
            {/* Education Toggle */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="teach-mode"
                  checked={teachModeEnabled}
                  onCheckedChange={onTeachModeToggle}
                />
                <Label htmlFor="teach-mode" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  Teach me how to code queries
                </Label>
              </div>
            </div>
            
            {teachModeEnabled && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-blue-700 text-sm">
                  🎓 <strong>Learning Mode Enabled:</strong> We'll show you how to write SQL queries 
                  and explain each step of the analysis process.
                </p>
              </div>
            )}
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
