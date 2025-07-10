
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface ReportCreatorProps {
  newReportTitle: string;
  selectedType: Report['type'];
  onTitleChange: (title: string) => void;
  onTypeChange: (type: Report['type']) => void;
}

const ReportCreator: React.FC<ReportCreatorProps> = ({
  newReportTitle,
  selectedType,
  onTitleChange,
  onTypeChange
}) => {
  const getReportIcon = (type: Report['type']) => {
    switch (type) {
      case 'dashboard': return BarChart3;
      case 'chart': return LineChart;
      case 'table': return FileText;
      case 'presentation': return Presentation;
      default: return BarChart3;
    }
  };

  return (
    <Card className="p-4">
      <h4 className="font-semibold mb-4">Create New Report</h4>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="report-title">Report Title</Label>
          <Input
            id="report-title"
            placeholder="Enter report title..."
            value={newReportTitle}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>
        
        <div>
          <Label>Report Type</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {(['dashboard', 'chart', 'table', 'presentation'] as const).map((type) => {
              const IconComponent = getReportIcon(type);
              return (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  onClick={() => onTypeChange(type)}
                  className="flex items-center gap-2 justify-start"
                >
                  <IconComponent className="w-4 h-4" />
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ReportCreator;
