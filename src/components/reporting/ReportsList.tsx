
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Share2, Clock } from 'lucide-react';
import { BarChart3, LineChart, FileText, Presentation } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  type: 'dashboard' | 'chart' | 'table' | 'presentation';
  schedule?: 'daily' | 'weekly' | 'monthly' | 'none';
  lastGenerated: Date;
  status: 'active' | 'draft' | 'archived';
  recipients?: string[];
}

interface ReportsListProps {
  reports: Report[];
  onExportReport: (reportId: string, format: string) => void;
}

const ReportsList: React.FC<ReportsListProps> = ({ reports, onExportReport }) => {
  const getReportIcon = (type: Report['type']) => {
    switch (type) {
      case 'dashboard': return BarChart3;
      case 'chart': return LineChart;
      case 'table': return FileText;
      case 'presentation': return Presentation;
      default: return BarChart3;
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'draft': return 'bg-yellow-100 text-yellow-700';
      case 'archived': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="grid gap-4">
      {reports.map((report) => {
        const IconComponent = getReportIcon(report.type);
        
        return (
          <Card key={report.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <IconComponent className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{report.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {report.type}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(report.status)}`}>
                      {report.status}
                    </Badge>
                    {report.schedule && report.schedule !== 'none' && (
                      <Badge className="bg-purple-100 text-purple-700 text-xs">
                        <Clock className="w-3 h-3 mr-1" />
                        {report.schedule}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => onExportReport(report.id, 'pdf')}>
                  <Download className="w-3 h-3 mr-1" />
                  PDF
                </Button>
                <Button size="sm" variant="outline" onClick={() => onExportReport(report.id, 'excel')}>
                  <Download className="w-3 h-3 mr-1" />
                  Excel
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="w-3 h-3 mr-1" />
                  Share
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Last generated: {report.lastGenerated.toLocaleDateString()}</span>
              {report.recipients && (
                <span>{report.recipients.length} recipient(s)</span>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ReportsList;
