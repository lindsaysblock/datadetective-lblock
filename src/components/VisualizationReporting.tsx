
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Download,
  Share2,
  Calendar,
  Filter,
  Eye,
  Mail,
  FileText,
  Image,
  Presentation,
  Clock,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

        <TabsContent value="reports" className="space-y-4">
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
                      <Button size="sm" variant="outline" onClick={() => exportReport(report.id, 'pdf')}>
                        <Download className="w-3 h-3 mr-1" />
                        PDF
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => exportReport(report.id, 'excel')}>
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
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card className="p-4">
            <h4 className="font-semibold mb-4">Create New Report</h4>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="report-title">Report Title</Label>
                <Input
                  id="report-title"
                  placeholder="Enter report title..."
                  value={newReportTitle}
                  onChange={(e) => setNewReportTitle(e.target.value)}
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
                        onClick={() => setSelectedType(type)}
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
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
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
                        onClick={() => scheduleReport(report.id, schedule)}
                      >
                        {schedule === 'none' ? 'Manual' : schedule}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default VisualizationReporting;
