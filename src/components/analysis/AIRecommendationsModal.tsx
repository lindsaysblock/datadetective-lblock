
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, Target, AlertCircle, CheckCircle, Zap } from 'lucide-react';

interface MetricRecommendation {
  title: string;
  description: string;
  currentState: string;
  recommendedAction: string;
  impact: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'metrics' | 'questions' | 'data-quality' | 'analysis';
}

interface AIRecommendationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysisResults: any;
  onImplementRecommendation: (recommendation: MetricRecommendation) => void;
}

const AIRecommendationsModal: React.FC<AIRecommendationsModalProps> = ({
  open,
  onOpenChange,
  analysisResults,
  onImplementRecommendation
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const recommendations: MetricRecommendation[] = [
    {
      title: "Track User Engagement Score",
      description: "Create a composite metric combining session duration, feature usage, and return frequency",
      currentState: "Currently tracking individual metrics separately",
      recommendedAction: "Implement a weighted engagement score to get holistic user health view",
      impact: 'high',
      difficulty: 'medium',
      category: 'metrics'
    },
    {
      title: "Cohort Retention Analysis",
      description: "Analyze user retention by signup cohorts to identify improvement opportunities",
      currentState: "Limited retention visibility",
      recommendedAction: "Segment users by signup date and track retention patterns over time",
      impact: 'high',
      difficulty: 'easy',
      category: 'analysis'
    },
    {
      title: "Feature Adoption Funnel",
      description: "Track how users progress through key feature adoption stages",
      currentState: "Missing visibility into feature adoption journey",
      recommendedAction: "Create funnel analysis to identify drop-off points in feature adoption",
      impact: 'medium',
      difficulty: 'medium',
      category: 'metrics'
    },
    {
      title: "Predictive Churn Indicators",
      description: "Identify early warning signs that predict user churn",
      currentState: "Reactive approach to user retention",
      recommendedAction: "Analyze behavior patterns that precede churn events",
      impact: 'high',
      difficulty: 'hard',
      category: 'questions'
    },
    {
      title: "Data Quality Assessment",
      description: "Regular validation of data completeness and accuracy",
      currentState: "Ad-hoc data quality checks",
      recommendedAction: "Implement automated data quality monitoring and alerts",
      impact: 'medium',
      difficulty: 'easy',
      category: 'data-quality'
    }
  ];

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
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'metrics': return <TrendingUp className="w-4 h-4" />;
      case 'questions': return <Target className="w-4 h-4" />;
      case 'data-quality': return <CheckCircle className="w-4 h-4" />;
      case 'analysis': return <Brain className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.category === selectedCategory);

  const categories = [
    { key: 'all', label: 'All Recommendations' },
    { key: 'metrics', label: 'Better Metrics' },
    { key: 'questions', label: 'Deeper Questions' },
    { key: 'analysis', label: 'Analysis Methods' },
    { key: 'data-quality', label: 'Data Quality' }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-green-600" />
            🤖 AI-Powered Recommendations
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.key)}
                className={selectedCategory === category.key ? "bg-gradient-to-r from-green-500 to-teal-500" : ""}
              >
                {category.label}
              </Button>
            ))}
          </div>

          {/* Recommendations Grid */}
          <div className="grid gap-6">
            {filteredRecommendations.map((recommendation, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border border-green-100">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-50 rounded-lg text-green-600">
                        {getCategoryIcon(recommendation.category)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{recommendation.title}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{recommendation.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge className={`text-xs ${getImpactColor(recommendation.impact)}`}>
                        {recommendation.impact} impact
                      </Badge>
                      <Badge className={`text-xs ${getDifficultyColor(recommendation.difficulty)}`}>
                        {recommendation.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-800 mb-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Current State
                      </h5>
                      <p className="text-xs text-gray-700">{recommendation.currentState}</p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 p-3 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-800 mb-1 flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        Recommended Action
                      </h5>
                      <p className="text-xs text-gray-700">{recommendation.recommendedAction}</p>
                    </div>
                  </div>

                  <Button
                    onClick={() => onImplementRecommendation(recommendation)}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Implement This Recommendation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIRecommendationsModal;
