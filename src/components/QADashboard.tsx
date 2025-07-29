
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Download,
  RefreshCw,
  Zap,
  Settings,
  Activity,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AutoQASystem, type QAReport } from '../utils/qaSystem';
import E2ETestRunner from './testing/E2ETestRunner';

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
    <div className="container mx-auto p-6 space-y-8">
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">🔍 Quality Assurance Dashboard</h1>
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
                    Run QA Tests
                  </>
                )}
              </Button>

              {currentReport && (
                <Button 
                  variant="outline" 
                  onClick={exportReport}
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              )}
            </div>
          </div>

          {currentReport && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold text-gray-800">{currentReport.totalTests}</div>
                    <div className="text-xs text-gray-600">Total Tests</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{currentReport.passed}</div>
                    <div className="text-xs text-gray-600">Passed</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border border-red-200">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✗</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{currentReport.failed}</div>
                    <div className="text-xs text-gray-600">Failed</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 border">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold text-gray-800">
                      {currentReport.performanceMetrics.renderTime.toFixed(0)}ms
                    </div>
                    <div className="text-xs text-gray-600">Render Time</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Tabs defaultValue="e2e" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/50 backdrop-blur">
          <TabsTrigger value="e2e" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            E2E Testing & Optimization
          </TabsTrigger>
          <TabsTrigger value="results" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Test Results
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Performance
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="e2e" className="space-y-4">
          <E2ETestRunner />
        </TabsContent>
        
        <TabsContent value="results" className="space-y-4">
          {currentReport ? (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Latest Test Results</h3>
                <div className="space-y-2">
                  {currentReport.results.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <div className="font-medium">{result.testName}</div>
                        <div className="text-sm text-gray-600">{result.message}</div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        result.status === 'pass' ? 'bg-green-100 text-green-800' :
                        result.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {result.status.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="p-6 text-center text-gray-500">
                No test results available. Run QA tests to see results.
              </div>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          {currentReport ? (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">System Performance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Render Time:</span>
                        <span>{currentReport.performanceMetrics.renderTime.toFixed(2)}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Memory Usage:</span>
                        <span>{currentReport.performanceMetrics.memoryUsage.toFixed(2)}MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Component Count:</span>
                        <span>{currentReport.performanceMetrics.componentCount}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Efficiency Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>System Efficiency:</span>
                        <span>{currentReport.performanceMetrics.systemEfficiency?.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Memory Efficiency:</span>
                        <span>{currentReport.performanceMetrics.memoryEfficiency?.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Enhanced Mode:</span>
                        <span>{currentReport.performanceMetrics.enhancedMode ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="p-6 text-center text-gray-500">
                No performance data available. Run QA tests to see metrics.
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QADashboard;
