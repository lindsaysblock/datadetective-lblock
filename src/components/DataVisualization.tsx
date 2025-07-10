
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3 } from 'lucide-react';
import { VisualizationRecommendation } from '../utils/visualization/recommendationEngine';
import { DataPoint } from '../utils/visualization/sampleDataGenerator';
import ChartRenderer from './visualization/ChartRenderer';
import QualityIndicator from './visualization/QualityIndicator';

interface DataVisualizationProps {
  recommendations: VisualizationRecommendation[];
  onSelectVisualization: (type: string, data: DataPoint[]) => void;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({
  recommendations,
  onSelectVisualization
}) => {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getIconComponent = (iconName: string) => {
    // Return the appropriate icon component based on the icon name
    return BarChart3; // Default fallback
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <BarChart3 className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">📊 Visualization Recommendations</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-6">
        Based on your data, here are some visualizations that could help you understand the patterns better:
      </p>

      <div className="grid gap-6">
        {recommendations.map((rec, index) => {
          const IconComponent = getIconComponent(rec.icon);
          
          return (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow border border-blue-100">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg">
                    <IconComponent className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{rec.title}</h4>
                    <p className="text-sm text-gray-600">{rec.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {rec.type}
                  </Badge>
                  <Badge className={`text-xs ${getConfidenceColor(rec.confidence)}`}>
                    {rec.confidence} confidence
                  </Badge>
                </div>
              </div>

              <QualityIndicator 
                qualityScore={rec.qualityScore} 
                validation={rec.validation} 
              />
              
              <div className="mb-4 mt-4">
                <ChartRenderer recommendation={rec} />
              </div>

              {/* Business Relevance */}
              <div className="mb-4 bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg">
                <h5 className="text-sm font-medium text-gray-800 mb-1">🎯 Business Impact:</h5>
                <p className="text-xs text-gray-700">{rec.businessRelevance}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">💡 {rec.reason}</p>
                <Button 
                  size="sm" 
                  onClick={() => onSelectVisualization(rec.type, rec.data)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  Use This Chart
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
};

export default DataVisualization;
