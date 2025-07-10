import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Target, CheckCircle, XCircle, Clock, Lightbulb } from 'lucide-react';

interface Hypothesis {
  id: string;
  statement: string;
  expectedOutcome: string;
  actualOutcome?: string;
  status: 'testing' | 'confirmed' | 'denied' | 'inconclusive';
  confidence: number;
  businessImpact: 'high' | 'medium' | 'low';
  createdAt: Date;
  updatedAt?: Date;
}

interface HypothesisTrackerProps {
  onHypothesisUpdate: (hypothesis: Hypothesis) => void;
}

const HypothesisTracker: React.FC<HypothesisTrackerProps> = ({ onHypothesisUpdate }) => {
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([
    {
      id: '1',
      statement: 'Users who engage with Feature X in their first week are 3x more likely to become premium subscribers',
      expectedOutcome: 'High correlation between early Feature X usage and premium conversion',
      status: 'testing',
      confidence: 75,
      businessImpact: 'high',
      createdAt: new Date()
    }
  ]);

  const [newHypothesis, setNewHypothesis] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [businessImpact, setBusinessImpact] = useState<'high' | 'medium' | 'low'>('medium');

  const addHypothesis = () => {
    if (!newHypothesis.trim() || !expectedOutcome.trim()) return;

    const hypothesis: Hypothesis = {
      id: Date.now().toString(),
      statement: newHypothesis,
      expectedOutcome,
      status: 'testing',
      confidence: 50,
      businessImpact,
      createdAt: new Date()
    };

    setHypotheses(prev => [...prev, hypothesis]);
    onHypothesisUpdate(hypothesis);
    setNewHypothesis('');
    setExpectedOutcome('');
    setBusinessImpact('medium');
  };

  const updateHypothesisStatus = (id: string, status: Hypothesis['status'], actualOutcome?: string) => {
    setHypotheses(prev => prev.map(h => 
      h.id === id 
        ? { ...h, status, actualOutcome, updatedAt: new Date() }
        : h
    ));
  };

  const getStatusIcon = (status: Hypothesis['status']) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'denied': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'inconclusive': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <Target className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: Hypothesis['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'denied': return 'bg-red-100 text-red-700';
      case 'inconclusive': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-700';
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

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Target className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800">🎯 Hypothesis Tracker</h3>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Track your business hypotheses and validate them with data. This helps prevent confirmation bias and ensures objective analysis.
      </p>

      {/* Add New Hypothesis */}
      <div className="bg-white p-4 rounded-lg border border-purple-100 mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Add New Hypothesis</h4>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="hypothesis">Hypothesis Statement</Label>
            <Textarea
              id="hypothesis"
              placeholder="e.g., Users who complete onboarding are 5x more likely to remain active after 30 days"
              value={newHypothesis}
              onChange={(e) => setNewHypothesis(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="expected">Expected Outcome</Label>
            <Input
              id="expected"
              placeholder="What do you expect to find in the data?"
              value={expectedOutcome}
              onChange={(e) => setExpectedOutcome(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div>
              <Label>Business Impact</Label>
              <div className="flex gap-2 mt-1">
                {(['high', 'medium', 'low'] as const).map((level) => (
                  <Button
                    key={level}
                    variant={businessImpact === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setBusinessImpact(level)}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button onClick={addHypothesis} className="mt-auto">
              <Lightbulb className="w-4 h-4 mr-2" />
              Add Hypothesis
            </Button>
          </div>
        </div>
      </div>

      {/* Existing Hypotheses */}
      <div className="space-y-4">
        {hypotheses.map((hypothesis) => (
          <Card key={hypothesis.id} className="p-4 border border-purple-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(hypothesis.status)}
                <Badge className={`text-xs ${getStatusColor(hypothesis.status)}`}>
                  {hypothesis.status}
                </Badge>
                <Badge className={`text-xs ${getImpactColor(hypothesis.businessImpact)}`}>
                  {hypothesis.businessImpact} impact
                </Badge>
              </div>
              <span className="text-xs text-gray-500">
                {hypothesis.createdAt.toLocaleDateString()}
              </span>
            </div>

            <div className="mb-3">
              <h5 className="font-medium text-gray-800 mb-1">Hypothesis:</h5>
              <p className="text-sm text-gray-700">{hypothesis.statement}</p>
            </div>

            <div className="mb-3">
              <h5 className="font-medium text-gray-800 mb-1">Expected Outcome:</h5>
              <p className="text-sm text-gray-700">{hypothesis.expectedOutcome}</p>
            </div>

            {hypothesis.actualOutcome && (
              <div className="mb-3">
                <h5 className="font-medium text-gray-800 mb-1">Actual Outcome:</h5>
                <p className="text-sm text-gray-700">{hypothesis.actualOutcome}</p>
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateHypothesisStatus(hypothesis.id, 'confirmed', 'Data confirms the hypothesis')}
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Confirmed
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateHypothesisStatus(hypothesis.id, 'denied', 'Data does not support the hypothesis')}
              >
                <XCircle className="w-3 h-3 mr-1" />
                Denied
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateHypothesisStatus(hypothesis.id, 'inconclusive', 'Results are inconclusive')}
              >
                <Clock className="w-3 h-3 mr-1" />
                Inconclusive
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default HypothesisTracker;
