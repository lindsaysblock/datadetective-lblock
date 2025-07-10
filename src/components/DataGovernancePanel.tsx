
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Lock,
  Users,
  Database,
  FileText,
  Settings,
  TrendingUp,
  Calendar,
  Zap,
  Star,
  Target,
  Award
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GovernanceRule {
  id: string;
  name: string;
  description: string;
  category: 'privacy' | 'security' | 'quality' | 'compliance';
  status: 'passing' | 'warning' | 'failing';
  score: number;
  lastChecked: Date;
  suggestions: string[];
}

interface DataGovernancePanelProps {
  onRuleUpdate?: (rule: GovernanceRule) => void;
}

const DataGovernancePanel: React.FC<DataGovernancePanelProps> = ({ onRuleUpdate }) => {
  const [rules, setRules] = useState<GovernanceRule[]>([
    {
      id: '1',
      name: 'Data Privacy Protection',
      description: 'Ensure personal data is properly protected and anonymized',
      category: 'privacy',
      status: 'passing',
      score: 92,
      lastChecked: new Date(),
      suggestions: [
        'Consider implementing field-level encryption for sensitive data',
        'Review data retention policies quarterly'
      ]
    },
    {
      id: '2',
      name: 'Access Control Management',
      description: 'Monitor and manage who has access to sensitive data',
      category: 'security',
      status: 'warning',
      score: 78,
      lastChecked: new Date(Date.now() - 3600000),
      suggestions: [
        'Remove unused user accounts',
        'Implement role-based access controls',
        'Set up regular access reviews'
      ]
    },
    {
      id: '3',
      name: 'Data Quality Standards',
      description: 'Maintain high data quality and consistency',
      category: 'quality',
      status: 'passing',
      score: 88,
      lastChecked: new Date(Date.now() - 1800000),
      suggestions: [
        'Add validation rules for email formats',
        'Implement data completeness checks'
      ]
    },
    {
      id: '4',
      name: 'Regulatory Compliance',
      description: 'Ensure compliance with GDPR, CCPA, and other regulations',
      category: 'compliance',
      status: 'failing',
      score: 45,
      lastChecked: new Date(Date.now() - 7200000),
      suggestions: [
        'Implement data subject rights management',
        'Add consent tracking mechanisms',
        'Create data processing records',
        'Set up automated compliance reporting'
      ]
    }
  ]);

  const { toast } = useToast();

  const getCategoryIcon = (category: GovernanceRule['category']) => {
    switch (category) {
      case 'privacy': return Eye;
      case 'security': return Lock;
      case 'quality': return Database;
      case 'compliance': return FileText;
      default: return Shield;
    }
  };

  const getStatusColor = (status: GovernanceRule['status']) => {
    switch (status) {
      case 'passing': return 'bg-green-100 text-green-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
      case 'failing': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: GovernanceRule['status']) => {
    switch (status) {
      case 'passing': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'failing': return XCircle;
      default: return Shield;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const overallScore = Math.round(rules.reduce((sum, rule) => sum + rule.score, 0) / rules.length);

  const handleApplySuggestion = (ruleId: string, suggestion: string) => {
    const updatedRules = rules.map(rule => {
      if (rule.id === ruleId) {
        const updatedRule = {
          ...rule,
          suggestions: rule.suggestions.filter(s => s !== suggestion),
          score: Math.min(100, rule.score + 5),
          lastChecked: new Date()
        };
        if (onRuleUpdate) {
          onRuleUpdate(updatedRule);
        }
        return updatedRule;
      }
      return rule;
    });
    
    setRules(updatedRules);
    
    toast({
      title: "Suggestion Applied",
      description: "Your data governance has been improved!",
    });
  };

  const handleRunCheck = (ruleId: string) => {
    const updatedRules = rules.map(rule => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          lastChecked: new Date(),
          score: Math.max(0, Math.min(100, rule.score + Math.floor(Math.random() * 10) - 5))
        };
      }
      return rule;
    });
    
    setRules(updatedRules);
    
    toast({
      title: "Governance Check Complete",
      description: "Data governance rules have been re-evaluated.",
    });
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Shield className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">🛡️ Data Governance & Compliance</h3>
            <p className="text-sm text-gray-600">Keep your data safe and compliant</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Overall Score:</span>
            <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.floor(overallScore / 20) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rules">Rules & Policies</TabsTrigger>
          <TabsTrigger value="suggestions">Smart Suggestions</TabsTrigger>
          <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {['privacy', 'security', 'quality', 'compliance'].map(category => {
              const categoryRules = rules.filter(rule => rule.category === category);
              const avgScore = Math.round(categoryRules.reduce((sum, rule) => sum + rule.score, 0) / categoryRules.length);
              const Icon = getCategoryIcon(category as GovernanceRule['category']);
              
              return (
                <Card key={category} className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold capitalize">{category}</h4>
                      <p className="text-sm text-gray-600">{categoryRules.length} rules</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Score</span>
                      <span className={`font-bold ${getScoreColor(avgScore)}`}>{avgScore}%</span>
                    </div>
                    <Progress value={avgScore} className="h-2" />
                  </div>
                </Card>
              );
            })}
          </div>

          <Card className="p-4">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Recent Improvements
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">Access Controls Updated</p>
                  <p className="text-sm text-gray-600">+12% security score improvement</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Award className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Data Quality Enhanced</p>
                  <p className="text-sm text-gray-600">+8% quality score improvement</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid gap-4">
            {rules.map((rule) => {
              const StatusIcon = getStatusIcon(rule.status);
              const CategoryIcon = getCategoryIcon(rule.category);
              
              return (
                <Card key={rule.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <CategoryIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{rule.name}</h4>
                        <p className="text-gray-600 text-sm mt-1">{rule.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs capitalize">
                            {rule.category}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(rule.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {rule.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(rule.score)}`}>
                        {rule.score}%
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleRunCheck(rule.id)}
                        className="mt-2"
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        Check Now
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <Progress value={rule.score} className="h-2" />
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    Last checked: {rule.lastChecked.toLocaleString()}
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <div className="grid gap-4">
            {rules.filter(rule => rule.suggestions.length > 0).map((rule) => (
              <Card key={rule.id} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-5 h-5 text-orange-600" />
                  <h4 className="font-semibold">{rule.name} Suggestions</h4>
                </div>
                <div className="space-y-2">
                  {rule.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start justify-between p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm flex-1">{suggestion}</p>
                      <Button 
                        size="sm" 
                        onClick={() => handleApplySuggestion(rule.id, suggestion)}
                        className="ml-3 bg-orange-600 hover:bg-orange-700"
                      >
                        Apply
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Compliance Reports</h3>
            <p className="text-gray-500">
              Generate detailed compliance reports for auditors and stakeholders - Coming soon!
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default DataGovernancePanel;
