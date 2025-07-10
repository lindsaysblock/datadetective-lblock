
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, FileText, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ReportsList from './reporting/ReportsList';
import ReportCreator from './reporting/ReportCreator';
import ReportScheduler from './reporting/ReportScheduler';

interface Report {
  id: string;
  title: string;
  type: 'dashboard' | 'chart' | 'table' | 'presentation';
  schedule?: 'daily' | 'weekly' | 'monthly' | 'none';
  lastGenerated: Date;
  status: 'active' | 'draft' | 'archived';
  recipients?: string[];
}

interface VisualizationReportingProps {
  onReportGenerated?: (report: Report) => void;
}

const VisualizationReporting: React.FC<VisualizationReportingProps> = ({ onReportGenerated }) => {
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      title: 'Weekly Executive Summary',
      type: 'dashboard',
      schedule: 'weekly',
      lastGenerated: new Date(),
      status: 'active',
      recipients: ['exec@company.com']
    },
    {
      id: '2',
      title: 'Sales Performance Analysis',
      type: 'chart',
      schedule: 'monthly',
      lastGenerated: new Date(Date.now() - 86400000),
      status: 'active',
      recipients: ['sales@company.com']
    },
    {
      id: '3',
      title: 'Customer Insights Presentation',
      type: 'presentation',
      schedule: 'none',
      lastGenerated: new Date(Date.now() - 259200000),
      status: 'draft'
    }
  ]);

  const [newReportTitle, setNewReportTitle] = useState('');
  const [selectedType, setSelectedType] = useState<Report['type']>('dashboard');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const createReport = async () => {
    if (!newReportTitle.trim()) return;

    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newReport: Report = {
      id: Date.now().toString(),
      title: newReportTitle,
      type: selectedType,
      schedule: 'none',
      lastGenerated: new Date(),
      status: 'draft'
    };

    setReports(prev => [newReport, ...prev]);
    if (onReportGenerated) {
      onReportGenerated(newReport);
    }
    
    setNewReportTitle('');
    setIsGenerating(false);
    
    toast({
      title: "Report Created!",
      description: `Your ${selectedType} report has been generated successfully.`,
    });
  };

  const exportReport = (reportId: string, format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting report in ${format.toUpperCase()} format...`,
    });
  };

  const scheduleReport = (reportId: string, schedule: Report['schedule']) => {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, schedule } : report
    ));
    
    toast({
      title: "Schedule Updated",
      description: `Report will now be generated ${schedule === 'none' ? 'manually' : schedule}.`,
    });
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">📊 Visualization & Reporting</h3>
            <p className="text-sm text-gray-600">Create, schedule, and share visual reports</p>
          </div>
        </div>
        
        <Button 
          onClick={createReport}
          disabled={isGenerating || !newReportTitle.trim()}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          {isGenerating ? (
            <>
              <Settings className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Create Report
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="reports">My Reports</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
          <TabsTrigger value="schedule">Scheduling</TabsTrigger>
        </TabsList>

        <TabsContent value="reports">
          <ReportsList reports={reports} onExportReport={exportReport} />
        </TabsContent>

        <TabsContent value="create">
          <ReportCreator
            newReportTitle={newReportTitle}
            selectedType={selectedType}
            onTitleChange={setNewReportTitle}
            onTypeChange={setSelectedType}
          />
        </TabsContent>

        <TabsContent value="schedule">
          <ReportScheduler reports={reports} onScheduleReport={scheduleReport} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default VisualizationReporting;
