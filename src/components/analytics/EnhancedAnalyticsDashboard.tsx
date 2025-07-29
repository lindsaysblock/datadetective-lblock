
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Brain, 
  Clock, 
  Download, 
  Upload, 
  Settings,
  Play,
  Pause,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp
} from 'lucide-react';
import { RealTimeAnalyticsEngine } from '@/utils/analytics/realTimeAnalyticsEngine';
import { MLAnalyticsEngine } from '@/utils/ml/mlAnalyticsEngine';

import { AnalyticsExportImport } from '@/utils/analytics/analyticsExportImport';
import { AnalyticsScheduler } from '@/utils/analytics/analyticsScheduler';
import { ParsedData } from '@/utils/dataParser';
import { AnalysisResult } from '@/utils/analysis/types';

interface EnhancedAnalyticsDashboardProps {
  data?: ParsedData;
  onAnalysisComplete?: (results: AnalysisResult[]) => void;
}

const EnhancedAnalyticsDashboard: React.FC<EnhancedAnalyticsDashboardProps> = ({
  data,
  onAnalysisComplete
}) => {
  const [realTimeEngine] = useState(() => new RealTimeAnalyticsEngine());
  const [mlEngine] = useState(() => new MLAnalyticsEngine());
  const [cacheManager] = useState(() => ({ getStats: () => ({}), invalidate: (pattern?: string) => 0, stop: () => {} }));
  const [exportImport] = useState(() => new AnalyticsExportImport());
  const [scheduler] = useState(() => new AnalyticsScheduler());
  
  const [realTimeResults, setRealTimeResults] = useState<AnalysisResult[]>([]);
  const [mlPredictions, setMLPredictions] = useState<any[]>([]);
  const [cacheStats, setCacheStats] = useState<any>({});
  const [scheduledJobs, setScheduledJobs] = useState<any[]>([]);
  const [isRealTimeActive, setIsRealTimeActive] = useState(false);

  useEffect(() => {
    // Subscribe to real-time updates
    realTimeEngine.subscribe('dashboard', (results) => {
      setRealTimeResults(results);
      if (onAnalysisComplete) {
        onAnalysisComplete(results);
      }
    });

    // Update cache stats periodically
    const statsInterval = setInterval(() => {
      setCacheStats(cacheManager.getStats());
    }, 5000);

    // Update scheduled jobs
    const jobsInterval = setInterval(() => {
      setScheduledJobs(scheduler.getAllJobs());
    }, 10000);

    return () => {
      clearInterval(statsInterval);
      clearInterval(jobsInterval);
      realTimeEngine.stop();
      cacheManager.stop();
      scheduler.stop();
    };
  }, []);

  useEffect(() => {
    if (data) {
      runMLAnalysis(data);
      if (isRealTimeActive) {
        realTimeEngine.addData(data);
      }
    }
  }, [data, isRealTimeActive]);

  const runMLAnalysis = async (analysisData: ParsedData) => {
    try {
      const [trends, anomalies, clusters] = await Promise.all([
        mlEngine.predictTrends(analysisData),
        mlEngine.detectAnomalies(analysisData),
        mlEngine.clusterUsers(analysisData)
      ]);
      
      setMLPredictions([...trends, ...anomalies, ...clusters]);
    } catch (error) {
      console.error('ML analysis failed:', error);
    }
  };

  const toggleRealTime = () => {
    setIsRealTimeActive(!isRealTimeActive);
  };

  const handleExport = async (format: 'json' | 'csv' | 'xlsx' | 'pdf') => {
    if (!data) return;
    
    try {
      const blob = await exportImport.exportAnalytics(data, realTimeResults, { format });
      const filename = `analytics_export_${Date.now()}.${format}`;
      exportImport.downloadBlob(blob, filename);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedData = await exportImport.importAnalytics(file);
      console.log('Imported analytics data:', importedData);
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  const scheduleNewJob = () => {
    const jobId = scheduler.scheduleAnalysis({
      name: 'Daily Analytics Report',
      schedule: 'daily',
      dataSource: async () => data || { columns: [], rows: [], rowCount: 0, fileSize: 0, summary: { totalRows: 0, totalColumns: 0 } },
      analysisConfig: { enableLogging: false },
      enabled: true,
      notifications: {
        webhook: 'https://example.com/webhook'
      }
    });
    
    console.log('Scheduled job:', jobId);
    setScheduledJobs(scheduler.getAllJobs());
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Enhanced Analytics Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button
            variant={isRealTimeActive ? "destructive" : "default"}
            size="sm"
            onClick={toggleRealTime}
          >
            {isRealTimeActive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            Real-time {isRealTimeActive ? 'ON' : 'OFF'}
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </span>
            </Button>
            <input
              type="file"
              accept=".json,.csv,.xlsx"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <Tabs defaultValue="realtime" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
          <TabsTrigger value="ml">ML Insights</TabsTrigger>
          <TabsTrigger value="cache">Cache</TabsTrigger>
          <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
          <TabsTrigger value="export">Export/Import</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Real-time Status</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isRealTimeActive ? 'Active' : 'Inactive'}
                </div>
                <Badge variant={isRealTimeActive ? "default" : "secondary"}>
                  {realTimeResults.length} results
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Processing</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data?.rowCount || 0}</div>
                <p className="text-xs text-muted-foreground">rows processed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Analysis Quality</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {realTimeResults.filter(r => r.confidence === 'high').length}
                </div>
                <p className="text-xs text-muted-foreground">high confidence results</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Real-time Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {realTimeResults.map((result, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{result.title}</h4>
                      <Badge variant={result.confidence === 'high' ? 'default' : 'secondary'}>
                        {result.confidence}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{result.insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ml" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ML Models</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mlEngine.getModelStatus().map(model => (
                    <div key={model.name} className="flex items-center justify-between">
                      <span className="text-sm">{model.name}</span>
                      <Badge variant={model.trained ? "default" : "secondary"}>
                        {model.trained ? 'Trained' : 'Training'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Predictions</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mlPredictions.length}</div>
                <p className="text-xs text-muted-foreground">active predictions</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>ML Predictions & Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mlPredictions.map((prediction, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold capitalize">{prediction.type} Analysis</h4>
                      <Badge variant="outline">
                        {(prediction.confidence * 100).toFixed(0)}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Model: {prediction.model}
                    </p>
                    <div className="mt-2">
                      <Progress value={prediction.confidence * 100} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cache" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hit Rate</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cacheStats.hitRate?.toFixed(1) || 0}%</div>
                <Progress value={cacheStats.hitRate || 0} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cache Size</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cacheStats.cacheSize || 0}</div>
                <p className="text-xs text-muted-foreground">entries</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {((cacheStats.memoryUsage || 0) / 1024).toFixed(1)}KB
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(cacheStats.totalHits || 0) + (cacheStats.totalMisses || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {cacheStats.totalHits || 0} hits, {cacheStats.totalMisses || 0} misses
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cache Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => cacheManager.invalidate()}
                >
                  Clear All Cache
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => cacheManager.invalidate('analytics_*')}
                >
                  Clear Analytics Cache
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduler" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Scheduled Jobs</h3>
            <Button onClick={scheduleNewJob}>
              <Clock className="w-4 h-4 mr-2" />
              Schedule New Job
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scheduledJobs.map(job => (
              <Card key={job.id}>
                <CardHeader>
                  <CardTitle className="text-base">{job.name}</CardTitle>
                  <Badge variant={job.enabled ? "default" : "secondary"}>
                    {job.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p><strong>Schedule:</strong> {job.schedule}</p>
                    <p><strong>Last Run:</strong> {job.lastRun ? new Date(job.lastRun).toLocaleString() : 'Never'}</p>
                    <p><strong>Next Run:</strong> {job.nextRun ? new Date(job.nextRun).toLocaleString() : 'Not scheduled'}</p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => scheduler.runJobNow(job.id)}
                    >
                      Run Now
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => job.enabled ? scheduler.pauseJob(job.id) : scheduler.resumeJob(job.id)}
                    >
                      {job.enabled ? 'Pause' : 'Resume'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleExport('json')}
                  >
                    Export as JSON
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleExport('csv')}
                  >
                    Export as CSV
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleExport('xlsx')}
                  >
                    Export as Excel
                  </Button>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => handleExport('pdf')}
                  >
                    Export as PDF
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Import Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <label className="cursor-pointer">
                      <div className="space-y-2">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          JSON, CSV, or Excel files
                        </p>
                      </div>
                      <input
                        type="file"
                        accept=".json,.csv,.xlsx"
                        onChange={handleImport}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Analytics Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Real-time Processing</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      Enable real-time analytics
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      Auto-refresh dashboard
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Machine Learning</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      Enable predictive analytics
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      Anomaly detection
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      User clustering
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Performance</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      Enable caching
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      Compress exports
                    </label>
                  </div>
                </div>

                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalyticsDashboard;
