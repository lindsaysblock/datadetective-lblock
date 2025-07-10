
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefactoringRecommendation } from '../../utils/qa/types';

interface QARefactoringRecommendationsProps {
  recommendations: RefactoringRecommendation[];
}

const QARefactoringRecommendations: React.FC<QARefactoringRecommendationsProps> = ({ recommendations }) => {
  return (
    <div className="grid gap-4">
      {recommendations.map((rec, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold">{rec.file}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {rec.type}
                </Badge>
                <Badge className={`text-xs ${
                  rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                  rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {rec.priority} priority
                </Badge>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
          <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
            <p className="text-sm font-medium text-blue-800">Suggestion:</p>
            <p className="text-sm text-blue-700">{rec.suggestion}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default QARefactoringRecommendations;
