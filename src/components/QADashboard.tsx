
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Play, 
  Download,
  RefreshCw,
  Zap,
  FileText,
  TrendingUp,
  Settings,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AutoQASystem, type QAReport, type QATestResult } from '../utils/qaSystem';

const QADashboard: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentReport, setCurrentReport] = useState<QAReport | null>(null);
  const [autoQAEnabled, setAutoQAEnabled] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Auto-run QA on component mount
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

  const getStatusIcon = (status: QATestResult['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'fail': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: QATestResult['status']) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-700';
      case 'fail': return 'bg-red-100 text-red-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Overall Status</p>
                    <p className="text-2xl font-bold">
                      <Badge className={getStatusColor(currentReport.overall)}>
                        {currentReport.overall.toUpperCase()}
                      </Badge>
                    </p>
                  </div>
                  {getStatusIcon(currentReport.overall)}
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Tests Passed</p>
                    <p className="text-2xl font-bold text-green-600">
                      {currentReport.passed}/{currentReport.totalTests}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <Progress 
                  value={(currentReport.passed / currentReport.totalTests) * 100} 
                  className="mt-2"
                />
              </Card>

              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Render Time</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {currentReport.performanceMetrics.renderTime.toFixed(0)}ms
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
              </Card>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Last run: {currentReport.timestamp.toLocaleString()}
                </span>
              </div>
              
              <Button onClick={exportReport} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export Report
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="tests" className="space-y-4">
            <div className="grid gap-3">
              {currentReport.results.map((result, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{result.testName}</h4>
                          <Badge className={`text-xs ${getStatusColor(result.status)}`}>
                            {result.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{result.message}</p>
                        {result.performance && (
                          <p className="text-xs text-blue-600">
                            Performance: {result.performance.toFixed(2)}ms
                          </p>
                        )}
                        {result.suggestions && (
                          <div className="mt-2">
                            <p className="text-xs font-medium text-gray-700 mb-1">Suggestions:</p>
                            <ul className="text-xs text-gray-600 list-disc list-inside">
                              {result.suggestions.map((suggestion, i) => (
                                <li key={i}>{suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center">
                <h4 className="font-semibold text-gray-700">Render Time</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {currentReport.performanceMetrics.renderTime.toFixed(0)}ms
                </p>
              </Card>
              
              <Card className="p-4 text-center">
                <h4 className="font-semibold text-gray-700">Memory Usage</h4>
                <p className="text-2xl font-bold text-green-600">
                  {(currentReport.performanceMetrics.memoryUsage / 1024 / 1024).toFixed(1)}MB
                </p>
              </Card>
              
              <Card className="p-4 text-center">
                <h4 className="font-semibold text-gray-700">Bundle Size</h4>
                <p className="text-2xl font-bold text-orange-600">
                  {currentReport.performanceMetrics.bundleSize}KB
                </p>
              </Card>
              
              <Card className="p-4 text-center">
                <h4 className="font-semibold text-gray-700">Components</h4>
                <p className="text-2xl font-bold text-purple-600">
                  {currentReport.performanceMetrics.componentCount}
                </p>
              </Card>
            </div>

            <Card className="p-4">
              <h4 className="font-semibold mb-3">Large Files</h4>
              <div className="space-y-2">
                {currentReport.performanceMetrics.largeFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm">{file}</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="refactoring" className="space-y-4">
            <div className="grid gap-4">
              {currentReport.refactoringRecommendations.map((rec, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{rec.file}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {rec.type}
                        </Badge>
                        <Badge className={`text-xs ${
                          rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                          rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {rec.priority} priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                  <div className="p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                    <p className="text-sm font-medium text-blue-800">Suggestion:</p>
                    <p className="text-sm text-blue-700">{rec.suggestion}</p>
                  </div>
                </Card>
              ))}
            </div>
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
