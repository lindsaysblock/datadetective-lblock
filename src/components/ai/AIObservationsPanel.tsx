
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Lightbulb, TrendingUp, AlertTriangle, Target, ChevronDown, ChevronRight } from 'lucide-react';
import { DataObservation, QuestionRecommendation, generateAIObservations, generateRecommendedQuestions, generateContextualObservations } from '../../utils/aiObservationsEngine';

interface AIObservationsPanelProps {
  query: string;
  datasetType?: 'behavioral' | 'transactional' | 'survey' | 'mixed';
  businessContext?: string;
  onQuestionSelect: (question: string) => void;
}

const AIObservationsPanel: React.FC<AIObservationsPanelProps> = ({
  query,
  datasetType = 'behavioral',
  businessContext,
  onQuestionSelect
}) => {
  const [expandedObservation, setExpandedObservation] = useState<string | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState(false);

  const observations = [
    ...generateAIObservations(query, datasetType),
    ...generateContextualObservations(query, businessContext)
  ];
  
  const recommendedQuestions = generateRecommendedQuestions(query, observations, datasetType);

  const getObservationIcon = (type: DataObservation['type']) => {
    switch (type) {
      case 'pattern': return <TrendingUp className="w-4 h-4" />;
      case 'anomaly': return <AlertTriangle className="w-4 h-4" />;
      case 'correlation': return <Target className="w-4 h-4" />;
      case 'trend': return <TrendingUp className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Observations */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">🤖 AI-Driven Observations</h3>
            <p className="text-sm text-gray-600">Automated insights and patterns detected in your data</p>
          </div>
        </div>

        <div className="space-y-4">
          {observations.map((observation) => (
            <Card key={observation.id} className="p-4 border border-purple-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                    {getObservationIcon(observation.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{observation.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{observation.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${getConfidenceColor(observation.confidence)}`}>
                    {observation.confidence} confidence
                  </Badge>
                  <Badge className={`text-xs ${getImpactColor(observation.businessImpact)}`}>
                    {observation.businessImpact} impact
                  </Badge>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg mb-3">
                <h5 className="text-sm font-medium text-gray-800 mb-1">💡 Actionable Insight:</h5>
                <p className="text-xs text-gray-700">{observation.actionableInsight}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpandedObservation(
                  expandedObservation === observation.id ? null : observation.id
                )}
                className="flex items-center gap-2"
              >
                {expandedObservation === observation.id ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                View Recommended Questions
              </Button>

              {expandedObservation === observation.id && (
                <div className="mt-3 space-y-2">
                  {observation.recommendedQuestions.map((question, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border">
                      <span className="text-sm text-gray-700">{question}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onQuestionSelect(question)}
                      >
                        Ask This
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      </Card>

      {/* Recommended Next Questions */}
      <Card className="p-6 bg-gradient-to-br from-green-50 to-yellow-50 border-green-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Lightbulb className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">💭 Recommended Next Questions</h3>
              <p className="text-sm text-gray-600">AI-suggested questions to deepen your analysis</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedQuestions(!expandedQuestions)}
          >
            {expandedQuestions ? 'Show Less' : 'Show All'}
          </Button>
        </div>

        <div className="grid gap-4">
          {recommendedQuestions.slice(0, expandedQuestions ? undefined : 3).map((rec, index) => (
            <Card key={index} className="p-4 border border-green-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 mb-2">{rec.question}</h4>
                  <p className="text-sm text-gray-600 mb-2">{rec.rationale}</p>
                </div>
                <div className="flex flex-col gap-1 ml-4">
                  <Badge className={`text-xs ${getDifficultyColor(rec.difficulty)}`}>
                    {rec.difficulty}
                  </Badge>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg mb-3">
                <h5 className="text-sm font-medium text-gray-800 mb-1">📈 Business Value:</h5>
                <p className="text-xs text-gray-700">{rec.businessValue}</p>
              </div>

              <div className="mb-3">
                <h5 className="text-sm font-medium text-gray-800 mb-1">Expected Insights:</h5>
                <ul className="text-xs text-gray-600 list-disc list-inside">
                  {rec.expectedInsights.map((insight, idx) => (
                    <li key={idx}>{insight}</li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => onQuestionSelect(rec.question)}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                Explore This Question
              </Button>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AIObservationsPanel;
