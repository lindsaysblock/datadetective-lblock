import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, CheckCircle, XCircle, AlertCircle, Edit, Save, X } from 'lucide-react';

interface BusinessHypothesis {
  id: string;
  hypothesis: string;
  businessValue: string;
  kpis: string[];
  status: 'testing' | 'confirmed' | 'denied' | 'inconclusive';
  findings?: string;
}

interface BusinessInsightsProps {
  onUpdateHypothesis: (hypothesis: BusinessHypothesis) => void;
}

const BusinessInsights: React.FC<BusinessInsightsProps> = ({ onUpdateHypothesis }) => {
  const [hypotheses, setHypotheses] = useState<BusinessHypothesis[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newHypothesis, setNewHypothesis] = useState({
    hypothesis: '',
    businessValue: '',
    kpis: [''],
  });

  const handleAddHypothesis = () => {
    if (!newHypothesis.hypothesis.trim() || !newHypothesis.businessValue.trim()) return;

    const hypothesis: BusinessHypothesis = {
      id: Date.now().toString(),
      hypothesis: newHypothesis.hypothesis,
      businessValue: newHypothesis.businessValue,
      kpis: newHypothesis.kpis.filter(kpi => kpi.trim()),
      status: 'testing'
    };

    setHypotheses(prev => [...prev, hypothesis]);
    onUpdateHypothesis(hypothesis);
    setNewHypothesis({ hypothesis: '', businessValue: '', kpis: [''] });
    setIsAdding(false);
  };

  const handleUpdateStatus = (id: string, status: BusinessHypothesis['status'], findings?: string) => {
    setHypotheses(prev => prev.map(h => 
      h.id === id ? { ...h, status, findings } : h
    ));
  };

  const addKpiField = () => {
    setNewHypothesis(prev => ({
      ...prev,
      kpis: [...prev.kpis, '']
    }));
  };

  const updateKpi = (index: number, value: string) => {
    setNewHypothesis(prev => ({
      ...prev,
      kpis: prev.kpis.map((kpi, i) => i === index ? value : kpi)
    }));
  };

  const getStatusIcon = (status: BusinessHypothesis['status']) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'denied': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'inconclusive': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      default: return <Target className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: BusinessHypothesis['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'denied': return 'bg-red-100 text-red-700';
      case 'inconclusive': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <TrendingUp className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">🎯 Business Insights & KPIs</h3>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Define what you're trying to discover and how it relates to business value. Track whether your findings confirm or deny your hypotheses.
      </p>

      {/* Add New Hypothesis */}
      {!isAdding ? (
        <Button 
          onClick={() => setIsAdding(true)}
          className="mb-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          + Add Business Hypothesis
        </Button>
      ) : (
        <Card className="p-4 mb-6 border-purple-200">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💭 What are you trying to find out?
              </label>
              <Textarea
                value={newHypothesis.hypothesis}
                onChange={(e) => setNewHypothesis(prev => ({ ...prev, hypothesis: e.target.value }))}
                placeholder="e.g., Users who engage with feature X have higher retention rates"
                className="min-h-[80px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💼 Business Value & Impact
              </label>
              <Textarea
                value={newHypothesis.businessValue}
                onChange={(e) => setNewHypothesis(prev => ({ ...prev, businessValue: e.target.value }))}
                placeholder="e.g., If confirmed, we can focus development on feature X to improve user retention by 15%, potentially increasing revenue by $50k/month"
                className="min-h-[80px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📊 Key Performance Indicators (KPIs)
              </label>
              {newHypothesis.kpis.map((kpi, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    value={kpi}
                    onChange={(e) => updateKpi(index, e.target.value)}
                    placeholder="e.g., User retention rate, Feature adoption rate"
                    className="flex-1"
                  />
                  {index === newHypothesis.kpis.length - 1 && (
                    <Button size="sm" variant="outline" onClick={addKpiField}>
                      + KPI
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddHypothesis} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save Hypothesis
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsAdding(false);
                  setNewHypothesis({ hypothesis: '', businessValue: '', kpis: [''] });
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Existing Hypotheses */}
      <div className="space-y-4">
        {hypotheses.map((hypothesis) => (
          <Card key={hypothesis.id} className="p-4 border border-purple-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(hypothesis.status)}
                <Badge className={`text-xs ${getStatusColor(hypothesis.status)}`}>
                  {hypothesis.status}
                </Badge>
              </div>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setEditingId(editingId === hypothesis.id ? null : hypothesis.id)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Hypothesis:</h4>
                <p className="text-sm text-gray-700">{hypothesis.hypothesis}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-1">Business Value:</h4>
                <p className="text-sm text-gray-700">{hypothesis.businessValue}</p>
              </div>

              {hypothesis.kpis.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">KPIs:</h4>
                  <div className="flex flex-wrap gap-1">
                    {hypothesis.kpis.map((kpi, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {kpi}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {hypothesis.findings && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Findings:</h4>
                  <p className="text-sm text-gray-700">{hypothesis.findings}</p>
                </div>
              )}

              {editingId === hypothesis.id && (
                <div className="border-t pt-3 space-y-2">
                  <h4 className="font-medium text-gray-800">Update Status:</h4>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleUpdateStatus(hypothesis.id, 'confirmed', 'Data confirms this hypothesis')}
                      className="text-green-600 border-green-200"
                    >
                      ✅ Confirmed
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleUpdateStatus(hypothesis.id, 'denied', 'Data does not support this hypothesis')}
                      className="text-red-600 border-red-200"
                    >
                      ❌ Denied
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleUpdateStatus(hypothesis.id, 'inconclusive', 'Results are inconclusive')}
                      className="text-yellow-600 border-yellow-200"
                    >
                      ⚠️ Inconclusive
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {hypotheses.length === 0 && !isAdding && (
        <div className="text-center py-8 text-gray-500">
          <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No business hypotheses defined yet.</p>
          <p className="text-sm">Add one to track your business insights and KPIs!</p>
        </div>
      )}
    </Card>
  );
};

export default BusinessInsights;
