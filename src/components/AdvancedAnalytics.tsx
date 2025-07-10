
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Lightbulb,
  Star,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsInsight {
  id: string;
  title: string;
  description: string;
  type: 'trend' | 'anomaly' | 'correlation' | 'prediction' | 'opportunity';
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  status: 'new' | 'reviewed' | 'implemented';
  createdAt: Date;
  data?: any;
}

interface AdvancedAnalyticsProps {
  onInsightGenerated?: (insight: AnalyticsInsight) => void;
}

const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ onInsightGenerated }) => {
  const [insights, setInsights] = useState<AnalyticsInsight[]>([
    {
      id: '1',
      title: 'Seasonal Revenue Pattern Detected',
      description: 'Revenue shows consistent 23% increase during Q4 months over the past 3 years',
      type: 'trend',
      confidence: 94,
      impact: 'high',
      status: 'new',
      createdAt: new Date(),
      data: { trend: 'increasing', percentage: 23 }
    },
    {
      id: '2',
      title: 'Customer Churn Risk Identified',
      description: 'Users with <2 logins in 30 days have 78% churn probability',
      type: 'prediction',
      confidence: 87,
      impact: 'high',
      status: 'new',
      createdAt: new Date(),
      data: { churnRate: 78, timeframe: 30 }
    },
    {
      id: '3',
      title: 'Feature Adoption Correlation',
      description: 'Users engaging with Feature X are 4.2x more likely to upgrade to premium',
      type: 'correlation',
      confidence: 91,
      impact: 'medium',
      status: 'reviewed',
      createdAt: new Date(),
      data: { multiplier: 4.2, feature: 'Feature X' }
    }
  ]);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const getInsightIcon = (type: AnalyticsInsight['type']) => {
    switch (type) {
      case 'trend': return TrendingUp;
      case 'anomaly': return AlertTriangle;
      case 'correlation': return Target;
      case 'prediction': return Brain;
      case 'opportunity': return Lightbulb;
      default: return BarChart3;
    }
  };

  const getInsightColor = (type: AnalyticsInsight['type']) => {
    switch (type) {
      case 'trend': return 'bg-blue-100 text-blue-700';
      case 'anomaly': return 'bg-red-100 text-red-700';
      case 'correlation': return 'bg-green-100 text-green-700';
      case 'prediction': return 'bg-purple-100 text-purple-700';
      case 'opportunity': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: AnalyticsInsight['status']) => {
    switch (status) {
      case 'new': return Clock;
      case 'reviewed': return CheckCircle;
      case 'implemented': return Star;
      default: return Clock;
    }
  };

  const runAdvancedAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newInsight: AnalyticsInsight = {
      id: Date.now().toString(),
      title: 'Revenue Opportunity Identified',
      description: 'Cross-selling Product B to users who purchased Product A could increase revenue by 18%',
      type: 'opportunity',
      confidence: 85,
      impact: 'high',
      status: 'new',
      createdAt: new Date(),
      data: { opportunity: 'cross-selling', increase: 18 }
    };

    setInsights(prev => [newInsight, ...prev]);
    if (onInsightGenerated) {
      onInsightGenerated(newInsight);
    }
    
    setIsAnalyzing(false);
    toast({
      title: "New Insight Generated!",
      description: "Advanced AI analysis has identified a new business opportunity.",
    });
  };

  const updateInsightStatus = (id: string, status: AnalyticsInsight['status']) => {
    setInsights(prev => prev.map(insight => 
      insight.id === id ? { ...insight, status } : insight
    ));
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Brain className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">🧠 Advanced Analytics & Intelligence</h3>
            <p className="text-sm text-gray-600">AI-powered insights and pattern detection</p>
          </div>
        </div>
        
        <Button 
          onClick={runAdvancedAnalysis}
          disabled={isAnalyzing}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isAnalyzing ? (
            <>
              <Activity className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Run AI Analysis
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="insights">Smart Insights</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Detection</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            {insights.map((insight) => {
              const IconComponent = getInsightIcon(insight.type);
              const StatusIcon = getStatusIcon(insight.status);
              
              return (
                <Card key={insight.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{insight.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getImpactColor(insight.impact)}`}>
                        {insight.impact} impact
                      </Badge>
                      <StatusIcon className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">Confidence:</span>
                        <span className="text-sm font-medium text-blue-600">{insight.confidence}%</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {insight.type}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      {insight.status === 'new' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateInsightStatus(insight.id, 'reviewed')}
                          >
                            Review
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => updateInsightStatus(insight.id, 'implemented')}
                          >
                            Implement
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold">Growth Patterns</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Weekly Growth Rate</span>
                  <div className="flex items-center gap-1">
                    <ArrowUp className="w-3 h-3 text-green-600" />
                    <span className="text-sm font-medium text-green-600">+12.5%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">User Engagement</span>
                  <div className="flex items-center gap-1">
                    <ArrowUp className="w-3 h-3 text-green-600" />
                    <span className="text-sm font-medium text-green-600">+8.3%</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold">Anomalies Detected</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Traffic Spike</span>
                  <Badge className="bg-orange-100 text-orange-700 text-xs">+340%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Conversion Drop</span>
                  <Badge className="bg-red-100 text-red-700 text-xs">-15%</Badge>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <div className="grid gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold">Revenue Forecast</h4>
              </div>
              <p className="text-2xl font-bold text-purple-600 mb-2">$145,320</p>
              <p className="text-sm text-gray-600">Predicted revenue for next month (87% confidence)</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold">User Growth Prediction</h4>
              </div>
              <p className="text-2xl font-bold text-blue-600 mb-2">+2,847</p>
              <p className="text-sm text-gray-600">Expected new users next quarter (91% confidence)</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AdvancedAnalytics;
