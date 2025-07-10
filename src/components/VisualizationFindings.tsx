
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChartBar, Eye, Download, Share2, BookOpen, FileText } from 'lucide-react';

interface Finding {
  id: string;
  title: string;
  description: string;
  chartType: string;
  insight: string;
  confidence: 'high' | 'medium' | 'low';
  timestamp: Date;
}

interface VisualizationFindingsProps {
  findings: Finding[];
  onExportFinding: (finding: Finding) => void;
  onShareFinding: (finding: Finding) => void;
}

const VisualizationFindings: React.FC<VisualizationFindingsProps> = ({
  findings,
  onExportFinding,
  onShareFinding
}) => {
  const [expandedFinding, setExpandedFinding] = useState<string | null>(null);

  const getConfidenceColor = (confidence: Finding['confidence']) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-red-100 text-red-700';
    }
  };

  const exportAllFindings = () => {
    const exportData = {
      title: 'Data Analysis Findings Report',
      exportDate: new Date().toISOString(),
      totalFindings: allFindings.length,
      findings: allFindings.map(finding => ({
        title: finding.title,
        description: finding.description,
        chartType: finding.chartType,
        insight: finding.insight,
        confidence: finding.confidence,
        timestamp: finding.timestamp.toISOString()
      })),
      summary: {
        highConfidenceFindings: allFindings.filter(f => f.confidence === 'high').length,
        mediumConfidenceFindings: allFindings.filter(f => f.confidence === 'medium').length,
        lowConfidenceFindings: allFindings.filter(f => f.confidence === 'low').length
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `findings-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const mockFindings: Finding[] = [
    {
      id: '1',
      title: 'User Engagement Peak Hours',
      description: 'Analysis of user activity patterns throughout the day',
      chartType: 'Line Chart',
      insight: 'Peak user engagement occurs between 2-4 PM, with 45% higher activity than average. Consider scheduling important updates during this window.',
      confidence: 'high',
      timestamp: new Date()
    },
    {
      id: '2',
      title: 'Feature Adoption Rates',
      description: 'Comparison of feature usage across user segments',
      chartType: 'Bar Chart',
      insight: 'Premium users adopt new features 3x faster than free users. Feature X shows 78% adoption rate among premium users vs 23% among free users.',
      confidence: 'high',
      timestamp: new Date()
    }
  ];

  const allFindings = [...mockFindings, ...findings];

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Eye className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">📊 Visualize My Findings</h3>
        </div>
        
        {allFindings.length > 0 && (
          <Button 
            onClick={exportAllFindings}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <FileText className="w-4 h-4" />
            Export My Findings
          </Button>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Visual insights and patterns discovered from your data analysis. Each finding includes actionable insights and confidence levels.
      </p>

      {allFindings.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <ChartBar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No visualization findings yet.</p>
          <p className="text-sm">Create charts and visualizations to see insights here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {allFindings.map((finding) => (
            <Card key={finding.id} className="p-4 border border-green-100 hover:shadow-md transition-shadow">
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
          ))}
        </div>
      )}
    </Card>
  );
};

export default VisualizationFindings;
