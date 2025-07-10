
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Report {
  id: string;
  title: string;
  type: 'dashboard' | 'chart' | 'table' | 'presentation';
  schedule?: 'daily' | 'weekly' | 'monthly' | 'none';
  lastGenerated: Date;
  status: 'active' | 'draft' | 'archived';
  recipients?: string[];
}

interface ReportSchedulerProps {
  reports: Report[];
  onScheduleReport: (reportId: string, schedule: Report['schedule']) => void;
}

const ReportScheduler: React.FC<ReportSchedulerProps> = ({ reports, onScheduleReport }) => {
  return (
    <div className="grid gap-4">
      {reports.map((report) => (
        <Card key={report.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">{report.title}</h4>
              <p className="text-sm text-gray-600 mt-1">
                Current schedule: {report.schedule === 'none' ? 'Manual' : report.schedule}
              </p>
            </div>
            
            <div className="flex gap-2">
              {(['daily', 'weekly', 'monthly', 'none'] as const).map((schedule) => (
                <Button
                  key={schedule}
                  size="sm"
                  variant={report.schedule === schedule ? "default" : "outline"}
                  onClick={() => onScheduleReport(report.id, schedule)}
                >
                  {schedule === 'none' ? 'Manual' : schedule}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ReportScheduler;
