
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Download,
  RefreshCw,
  Zap,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AutoQASystem, type QAReport } from '../utils/qaSystem';
import QAOverview from './qa/QAOverview';
import QATestResults from './qa/QATestResults';
import QAPerformanceMetrics from './qa/QAPerformanceMetrics';
import QARefactoringRecommendations from './qa/QARefactoringRecommendations';

const QADashboard: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentReport, setCurrentReport] = useState<QAReport | null>(null);
  const [autoQAEnabled, setAutoQAEnabled] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (autoQAEnabled) {
      runQA();
    }
  }, [autoQAEnabled]);

  const runQA = async () => {
    setIsRunning(true);
    try {
      const qaSystem = new AutoQASystem();
      const report = await qaSystem.runFullQA();
      setCurrentReport(report);
      
      toast({
        title: "QA Testing Complete",
        description: `${report.passed}/${report.totalTests} tests passed`,
        variant: report.overall === 'fail' ? 'destructive' : 'default'
      });
    } catch (error) {
      toast({
        title: "QA Testing Failed",
        description: "An error occurred during testing",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const exportReport = () => {
    if (!currentReport) return;
    
    const reportData = {
      ...currentReport,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qa-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Exported",
      description: "QA report has been downloaded successfully",
    });
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Settings className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">🔍 Quality Assurance Dashboard</h3>
            <p className="text-sm text-gray-600">Automated testing and performance monitoring</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoQAEnabled(!autoQAEnabled)}
            className={autoQAEnabled ? 'bg-green-50 border-green-200' : ''}
          >
            <Zap className="w-4 h-4 mr-1" />
            Auto QA: {autoQAEnabled ? 'ON' : 'OFF'}
          </Button>
          
          <Button 
            onClick={runQA}
            disabled={isRunning}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Full QA
              </>
            )}
          </Button>
        </div>
      </div>

      {currentReport && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tests">Test Results</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="refactoring">Refactoring</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <QAOverview report={currentReport} />
            <div className="flex justify-end">
              <Button onClick={exportReport} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export Report
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="tests" className="space-y-4">
            <QATestResults results={currentReport.results} />
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <QAPerformanceMetrics metrics={currentReport.performanceMetrics} />
          </TabsContent>

          <TabsContent value="refactoring" className="space-y-4">
            <QARefactoringRecommendations recommendations={currentReport.refactoringRecommendations} />
          </TabsContent>
        </Tabs>
      )}

      {!currentReport && !isRunning && (
        <Card className="p-8 text-center">
          <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No QA Report Available</h3>
          <p className="text-gray-500 mb-4">
            Run a comprehensive quality assurance test to analyze your application
          </p>
          <Button onClick={runQA} className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Play className="w-4 h-4 mr-2" />
            Run First QA Test
          </Button>
        </Card>
      )}
    </Card>
  );
};

export default QADashboard;
