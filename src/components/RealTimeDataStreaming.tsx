
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Play, 
  Pause, 
  Square, 
  RefreshCw, 
  Clock, 
  Activity, 
  Database, 
  Zap,
  Settings,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Calendar,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DataStream {
  id: string;
  name: string;
  source: string;
  status: 'active' | 'paused' | 'error' | 'stopped';
  recordsPerSecond: number;
  totalRecords: number;
  lastUpdate: Date;
  refreshInterval: number; // in seconds
  autoRefresh: boolean;
}

interface ScheduledRefresh {
  id: string;
  name: string;
  schedule: string;
  nextRun: Date;
  lastRun?: Date;
  status: 'scheduled' | 'running' | 'completed' | 'failed';
  dataSource: string;
}

const RealTimeDataStreaming: React.FC = () => {
  const [activeStreams, setActiveStreams] = useState<DataStream[]>([
    {
      id: '1',
      name: 'Sales Data Stream',
      source: 'Salesforce API',
      status: 'active',
      recordsPerSecond: 12,
      totalRecords: 45230,
      lastUpdate: new Date(),
      refreshInterval: 30,
      autoRefresh: true
    },
    {
      id: '2',
      name: 'User Activity Stream',
      source: 'Google Analytics',
      status: 'paused',
      recordsPerSecond: 0,
      totalRecords: 123450,
      lastUpdate: new Date(Date.now() - 300000),
      refreshInterval: 60,
      autoRefresh: false
    }
  ]);

  const [scheduledRefreshes, setScheduledRefreshes] = useState<ScheduledRefresh[]>([
    {
      id: '1',
      name: 'Daily Sales Report',
      schedule: 'Daily at 9:00 AM',
      nextRun: new Date(Date.now() + 86400000),
      lastRun: new Date(Date.now() - 86400000),
      status: 'scheduled',
      dataSource: 'Salesforce'
    },
    {
      id: '2',
      name: 'Weekly Analytics Sync',
      schedule: 'Weekly on Monday',
      nextRun: new Date(Date.now() + 432000000),
      lastRun: new Date(Date.now() - 86400000),
      status: 'completed',
      dataSource: 'Google Analytics'
    }
  ]);

  const [newStreamConfig, setNewStreamConfig] = useState({
    name: '',
    source: '',
    refreshInterval: 60,
    autoRefresh: true
  });

  const { toast } = useToast();

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStreams(prev => prev.map(stream => {
        if (stream.status === 'active') {
          return {
            ...stream,
            recordsPerSecond: Math.floor(Math.random() * 20) + 5,
            totalRecords: stream.totalRecords + Math.floor(Math.random() * 10) + 1,
            lastUpdate: new Date()
          };
        }
        return stream;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleStreamControl = (streamId: string, action: 'play' | 'pause' | 'stop') => {
    setActiveStreams(prev => prev.map(stream => {
      if (stream.id === streamId) {
        let newStatus: DataStream['status'];
        switch (action) {
          case 'play':
            newStatus = 'active';
            break;
          case 'pause':
            newStatus = 'paused';
            break;
          case 'stop':
            newStatus = 'stopped';
            break;
          default:
            newStatus = stream.status;
        }
        return { ...stream, status: newStatus };
      }
      return stream;
    }));

    toast({
      title: `Stream ${action}ed`,
      description: `Successfully ${action}ed the data stream.`,
    });
  };

  const handleCreateStream = () => {
    if (!newStreamConfig.name || !newStreamConfig.source) {
      toast({
        title: "Missing Information",
        description: "Please provide both stream name and data source.",
        variant: "destructive"
      });
      return;
    }

    const newStream: DataStream = {
      id: Date.now().toString(),
      name: newStreamConfig.name,
      source: newStreamConfig.source,
      status: 'active',
      recordsPerSecond: 0,
      totalRecords: 0,
      lastUpdate: new Date(),
      refreshInterval: newStreamConfig.refreshInterval,
      autoRefresh: newStreamConfig.autoRefresh
    };

    setActiveStreams(prev => [...prev, newStream]);
    setNewStreamConfig({ name: '', source: '', refreshInterval: 60, autoRefresh: true });

    toast({
      title: "Stream Created",
      description: "New data stream has been created and started.",
    });
  };

  const getStatusIcon = (status: DataStream['status']) => {
    switch (status) {
      case 'active':
        return <Activity className="w-4 h-4 text-green-600" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'stopped':
        return <Square className="w-4 h-4 text-gray-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: DataStream['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'stopped':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Real-Time Data Streaming</h2>
          <p className="text-gray-600">Monitor and manage live data streams with automated refreshes</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            {activeStreams.filter(s => s.status === 'active').length} Active Streams
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Database className="w-3 h-3" />
            {activeStreams.reduce((sum, s) => sum + s.recordsPerSecond, 0)} Records/sec
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="streams" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="streams" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Live Streams
          </TabsTrigger>
          <TabsTrigger value="scheduled" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Scheduled Refreshes
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="streams" className="space-y-4">
          {/* Active Streams Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeStreams.map(stream => (
              <Card key={stream.id} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{stream.name}</CardTitle>
                    <Badge className={getStatusColor(stream.status)}>
                      {getStatusIcon(stream.status)}
                      {stream.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{stream.source}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Records/sec</p>
                      <p className="font-semibold text-lg">{stream.recordsPerSecond}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Total Records</p>
                      <p className="font-semibold text-lg">{stream.totalRecords.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 text-sm">Last Update</p>
                    <p className="text-sm">{stream.lastUpdate.toLocaleTimeString()}</p>
                  </div>

                  {stream.status === 'active' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Stream Health</span>
                        <span>Excellent</span>
                      </div>
                      <Progress value={95} className="h-2" />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={stream.status === 'active' ? 'secondary' : 'default'}
                      onClick={() => handleStreamControl(stream.id, stream.status === 'active' ? 'pause' : 'play')}
                    >
                      {stream.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStreamControl(stream.id, 'stop')}
                    >
                      <Square className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create New Stream */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Data Stream
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stream-name">Stream Name</Label>
                  <Input
                    id="stream-name"
                    placeholder="e.g., Customer Orders Stream"
                    value={newStreamConfig.name}
                    onChange={(e) => setNewStreamConfig(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="data-source">Data Source</Label>
                  <Select value={newStreamConfig.source} onValueChange={(value) => setNewStreamConfig(prev => ({ ...prev, source: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salesforce">Salesforce API</SelectItem>
                      <SelectItem value="google-analytics">Google Analytics</SelectItem>
                      <SelectItem value="stripe">Stripe Webhooks</SelectItem>
                      <SelectItem value="shopify">Shopify API</SelectItem>
                      <SelectItem value="hubspot">HubSpot CRM</SelectItem>
                      <SelectItem value="custom-api">Custom API</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="refresh-interval">Refresh Interval (seconds)</Label>
                  <Input
                    id="refresh-interval"
                    type="number"
                    min="1"
                    value={newStreamConfig.refreshInterval}
                    onChange={(e) => setNewStreamConfig(prev => ({ ...prev, refreshInterval: parseInt(e.target.value) }))}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="auto-refresh"
                    checked={newStreamConfig.autoRefresh}
                    onCheckedChange={(checked) => setNewStreamConfig(prev => ({ ...prev, autoRefresh: checked }))}
                  />
                  <Label htmlFor="auto-refresh">Enable Auto-Refresh</Label>
                </div>
              </div>
              <Button onClick={handleCreateStream} className="w-full">
                Create Stream
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <div className="grid gap-4">
            {scheduledRefreshes.map(refresh => (
              <Card key={refresh.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{refresh.name}</h3>
                      <p className="text-gray-600">{refresh.dataSource}</p>
                    </div>
                    <Badge className={refresh.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                   refresh.status === 'failed' ? 'bg-red-100 text-red-800' : 
                                   refresh.status === 'running' ? 'bg-blue-100 text-blue-800' : 
                                   'bg-gray-100 text-gray-800'}>
                      {refresh.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {refresh.status === 'failed' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {refresh.status === 'running' && <RefreshCw className="w-3 h-3 mr-1 animate-spin" />}
                      {refresh.status === 'scheduled' && <Calendar className="w-3 h-3 mr-1" />}
                      {refresh.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Schedule</p>
                      <p className="font-medium">{refresh.schedule}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Next Run</p>
                      <p className="font-medium">{refresh.nextRun.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Run</p>
                      <p className="font-medium">
                        {refresh.lastRun ? refresh.lastRun.toLocaleString() : 'Never'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline">
                      Edit Schedule
                    </Button>
                    <Button size="sm" variant="outline">
                      Run Now
                    </Button>
                    <Button size="sm" variant="outline">
                      View Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Global Stream Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Enable Real-Time Monitoring</Label>
                    <p className="text-sm text-gray-600">Monitor all data streams in real-time</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Auto-Retry Failed Connections</Label>
                    <p className="text-sm text-gray-600">Automatically retry failed stream connections</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Data Quality Monitoring</Label>
                    <p className="text-sm text-gray-600">Monitor data quality in real-time streams</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="max-retry">Max Retry Attempts</Label>
                  <Input id="max-retry" type="number" defaultValue="3" className="w-24" />
                </div>
                
                <div>
                  <Label htmlFor="buffer-size">Stream Buffer Size (MB)</Label>
                  <Input id="buffer-size" type="number" defaultValue="100" className="w-24" />
                </div>
              </div>

              <Button className="w-full">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealTimeDataStreaming;
