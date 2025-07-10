
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Eye, ChartBar } from 'lucide-react';
import ReportExporter from './visualization/ReportExporter';
import FindingCard from './visualization/FindingCard';

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
        timestamp: finding.timestamp.toISOString(),
        chartData: finding.chartData || []
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

  const exportVisualReport = () => {
    const reportHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Data Analysis Findings Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; background: #f8fafc; }
          .header { text-align: center; margin-bottom: 40px; }
          .finding { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .confidence-high { border-left: 4px solid #22c55e; }
          .confidence-medium { border-left: 4px solid #eab308; }
          .confidence-low { border-left: 4px solid #ef4444; }
          .chart-container { margin: 15px 0; padding: 15px; background: #f1f5f9; border-radius: 6px; }
          .insight-box { background: #e0f2fe; padding: 15px; border-radius: 6px; margin: 10px 0; }
          .summary { background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 Data Analysis Findings Report</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
          <div class="summary">
            <h3>Summary</h3>
            <p><strong>Total Findings:</strong> ${allFindings.length}</p>
            <p><strong>High Confidence:</strong> ${allFindings.filter(f => f.confidence === 'high').length}</p>
            <p><strong>Medium Confidence:</strong> ${allFindings.filter(f => f.confidence === 'medium').length}</p>
            <p><strong>Low Confidence:</strong> ${allFindings.filter(f => f.confidence === 'low').length}</p>
          </div>
        </div>
        
        ${allFindings.map(finding => `
          <div class="finding confidence-${finding.confidence}">
            <h2>${finding.title}</h2>
            <p><strong>Chart Type:</strong> ${finding.chartType}</p>
            <p>${finding.description}</p>
            
            <div class="chart-container">
              <h4>📈 Visualization Data</h4>
              <p><em>Chart data would be rendered here in a full implementation</em></p>
              ${finding.chartData ? `<pre>${JSON.stringify(finding.chartData, null, 2)}</pre>` : '<p>No chart data available</p>'}
            </div>
            
            <div class="insight-box">
              <h4>💡 Key Insight</h4>
              <p>${finding.insight}</p>
            </div>
            
            <p><small><strong>Confidence Level:</strong> ${finding.confidence} | <strong>Generated:</strong> ${finding.timestamp.toLocaleString()}</small></p>
          </div>
        `).join('')}
      </body>
      </html>
    `;

    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `visual-findings-report-${new Date().toISOString().split('T')[0]}.html`;
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
      timestamp: new Date(),
      chartData: [
        { time: '6AM', users: 120 },
        { time: '9AM', users: 280 },
        { time: '12PM', users: 450 },
        { time: '2PM', users: 680 },
        { time: '4PM', users: 620 },
        { time: '6PM', users: 380 },
        { time: '9PM', users: 200 }
      ]
    },
    {
      id: '2',
      title: 'Feature Adoption Rates',
      description: 'Comparison of feature usage across user segments',
      chartType: 'Bar Chart',
      insight: 'Premium users adopt new features 3x faster than free users. Feature X shows 78% adoption rate among premium users vs 23% among free users.',
      confidence: 'high',
      timestamp: new Date(),
      chartData: [
        { segment: 'Premium Users', adoption: 78 },
        { segment: 'Free Users', adoption: 23 },
        { segment: 'Trial Users', adoption: 45 }
      ]
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
        
        <ReportExporter
          findings={allFindings}
          onExportAllFindings={exportAllFindings}
          onExportVisualReport={exportVisualReport}
        />
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
            <FindingCard
              key={finding.id}
              finding={finding}
              expandedFinding={expandedFinding}
              setExpandedFinding={setExpandedFinding}
              onExportFinding={onExportFinding}
              onShareFinding={onShareFinding}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

export default VisualizationFindings;
