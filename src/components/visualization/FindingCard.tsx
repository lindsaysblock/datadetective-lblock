
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChartBar, BookOpen, Download, Share2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis } from 'recharts';

interface Finding {
  id: string;
  title: string;
  description: string;
  chartType: string;
  insight: string;
  confidence: 'high' | 'medium' | 'low';
  timestamp: Date;
  chartData?: any[];
}

interface FindingCardProps {
  finding: Finding;
  expandedFinding: string | null;
  setExpandedFinding: (id: string | null) => void;
  onExportFinding: (finding: Finding) => void;
  onShareFinding: (finding: Finding) => void;
}

const FindingCard: React.FC<FindingCardProps> = ({
  finding,
  expandedFinding,
  setExpandedFinding,
  onExportFinding,
  onShareFinding
}) => {
  const getConfidenceColor = (confidence: Finding['confidence']) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-red-100 text-red-700';
    }
  };

  const renderMiniChart = (finding: Finding) => {
    if (!finding.chartData || finding.chartData.length === 0) {
      return <div className="h-24 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm">No chart data</div>;
    }

    const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

    if (finding.chartType.toLowerCase().includes('line')) {
      return (
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={finding.chartData}>
            <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
            <XAxis dataKey="time" hide />
            <YAxis hide />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (finding.chartType.toLowerCase().includes('bar')) {
      return (
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={finding.chartData}>
            <Bar dataKey="adoption" fill="hsl(var(--primary))" />
            <XAxis dataKey="segment" hide />
            <YAxis hide />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (finding.chartType.toLowerCase().includes('pie')) {
      return (
        <ResponsiveContainer width="100%" height={100}>
          <PieChart>
            <Pie
              data={finding.chartData}
              cx="50%"
              cy="50%"
              innerRadius={20}
              outerRadius={40}
              dataKey="value"
            >
              {finding.chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      );
    }

    return <div className="h-24 bg-gray-100 rounded flex items-center justify-center text-gray-500 text-sm">Chart preview</div>;
  };

  return (
    <Card className="p-4 border border-green-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <ChartBar className="w-5 h-5 text-green-600" />
          <div>
            <h4 className="font-medium text-gray-800">{finding.title}</h4>
            <p className="text-sm text-gray-600">{finding.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {finding.chartType}
          </Badge>
          <Badge className={`text-xs ${getConfidenceColor(finding.confidence)}`}>
            {finding.confidence} confidence
          </Badge>
        </div>
      </div>

      <div className="mb-4 bg-white p-3 rounded-lg border border-green-100">
        <h5 className="text-sm font-medium text-gray-800 mb-2">📈 Chart Preview:</h5>
        {renderMiniChart(finding)}
      </div>

      <div className="bg-white p-3 rounded-lg border border-green-100 mb-3">
        <h5 className="font-medium text-gray-800 mb-2">💡 Key Insight:</h5>
        <p className="text-sm text-gray-700">{finding.insight}</p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Generated {finding.timestamp.toLocaleString()}
        </span>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setExpandedFinding(
              expandedFinding === finding.id ? null : finding.id
            )}
          >
            <BookOpen className="w-4 h-4 mr-1" />
            {expandedFinding === finding.id ? 'Less' : 'Details'}
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onExportFinding(finding)}
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onShareFinding(finding)}
          >
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>
      </div>

      {expandedFinding === finding.id && (
        <div className="mt-4 pt-4 border-t border-green-100">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg">
            <h5 className="font-medium text-gray-800 mb-2">📈 Recommended Actions:</h5>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Review and validate these patterns with stakeholders</li>
              <li>• Consider A/B testing to confirm causal relationships</li>
              <li>• Monitor these metrics over time to track changes</li>
              <li>• Share insights with relevant teams for implementation</li>
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
};

export default FindingCard;
