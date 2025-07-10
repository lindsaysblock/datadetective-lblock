import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Database, Globe, FileText, Settings, BarChart3, Code, Cloud, Server, Wrench } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { parseRawText } from '../utils/dataParser';
import AmplitudeIntegration from './AmplitudeIntegration';
import IntegrationProgress from './IntegrationProgress';

interface DataSource {
  id: string;
  name: string;
  type: 'file' | 'database' | 'api' | 'warehouse' | 'amplitude' | 'tableau' | 'powerbi' | 'looker' | 'python' | 'r' | 'matlab' | 'cloud' | 'programming' | 'dbtools';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
}

interface DataSourceConfigProps {
  onDataSourceConnect: (source: DataSource) => void;
  onFileUpload: (file: File) => void;
}

const DataSourceConfig: React.FC<DataSourceConfigProps> = ({ onDataSourceConnect, onFileUpload }) => {
  const [connectedSources, setConnectedSources] = useState<DataSource[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [databaseUrl, setDatabaseUrl] = useState('');
  const [rawDataText, setRawDataText] = useState('');
  const [integrationProgress, setIntegrationProgress] = useState<{
    isConnecting: boolean;
    progress: number;
    status: 'connecting' | 'authenticating' | 'syncing' | 'complete' | 'error';
    serviceName: string;
    estimatedTime: number;
  } | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected for upload:', file.name, file.size, 'bytes');
      onFileUpload(file);
      const newSource: DataSource = {
        id: Date.now().toString(),
        name: file.name,
        type: 'file',
        status: 'connected',
        lastSync: new Date()
      };
      setConnectedSources(prev => [...prev, newSource]);
    }
  };

  const handleRawDataPaste = () => {
    if (!rawDataText.trim()) {
      console.log('No raw data text provided');
      return;
    }
    
    try {
      console.log('Processing pasted data, length:', rawDataText.length);
      const parsedData = parseRawText(rawDataText);
      onFileUpload(new File([rawDataText], 'pasted-data.txt', { type: 'text/plain' }));
      
      const newSource: DataSource = {
        id: Date.now().toString(),
        name: 'Pasted Data',
        type: 'file',
        status: 'connected',
        lastSync: new Date()
      };
      setConnectedSources(prev => [...prev, newSource]);
      setRawDataText('');
      console.log('Pasted data processed successfully');
    } catch (error) {
      console.error('Error parsing pasted data:', error);
    }
  };

  const handleAmplitudeConnect = (config: any, data: any) => {
    console.log('Amplitude connection successful:', config, data);
    
    // Create a mock file from the Amplitude data
    const amplitudeFile = new File([JSON.stringify(data.data)], 'amplitude-events.json', { type: 'application/json' });
    onFileUpload(amplitudeFile);
    
    const newSource: DataSource = {
      id: Date.now().toString(),
      name: `Amplitude Events (${data.summary.totalEvents} events)`,
      type: 'amplitude',
      status: 'connected',
      lastSync: new Date()
    };
    setConnectedSources(prev => [...prev, newSource]);
    onDataSourceConnect(newSource);
  };

  const simulateIntegrationProgress = async (serviceName: string, baseTime: number = 10000) => {
    setIntegrationProgress({
      isConnecting: true,
      progress: 0,
      status: 'connecting',
      serviceName,
      estimatedTime: baseTime
    });

    // Connecting phase (20%)
    await new Promise(resolve => setTimeout(resolve, baseTime * 0.2));
    setIntegrationProgress(prev => prev ? {
      ...prev,
      progress: 20,
      status: 'authenticating',
      estimatedTime: baseTime * 0.8
    } : null);

    // Authentication phase (40%)
    await new Promise(resolve => setTimeout(resolve, baseTime * 0.2));
    setIntegrationProgress(prev => prev ? {
      ...prev,
      progress: 40,
      status: 'syncing',
      estimatedTime: baseTime * 0.6
    } : null);

    // Syncing phase (100%)
    for (let i = 40; i <= 100; i += 20) {
      await new Promise(resolve => setTimeout(resolve, baseTime * 0.15));
      setIntegrationProgress(prev => prev ? {
        ...prev,
        progress: i,
        estimatedTime: baseTime * ((100 - i) / 100)
      } : null);
    }

    setIntegrationProgress(prev => prev ? {
      ...prev,
      progress: 100,
      status: 'complete',
      estimatedTime: 0
    } : null);

    setTimeout(() => {
      setIntegrationProgress(null);
    }, 2000);
  };

  const connectAnalytics = async () => {
    if (!apiKey.trim()) {
      console.log('No API key provided for analytics connection');
      return;
    }
    
    await simulateIntegrationProgress('Analytics Platform', 8000);
    
    const newSource: DataSource = {
      id: Date.now().toString(),
      name: 'Analytics Platform',
      type: 'api',
      status: 'connected',
      lastSync: new Date()
    };
    setConnectedSources(prev => [...prev, newSource]);
    onDataSourceConnect(newSource);
    setApiKey('');
  };

  const connectDatabase = async () => {
    if (!databaseUrl.trim()) {
      console.log('No database URL provided');
      return;
    }
    
    await simulateIntegrationProgress('Database Connection', 12000);
    
    const newSource: DataSource = {
      id: Date.now().toString(),
      name: 'Database Connection',
      type: 'database',
      status: 'connected',
      lastSync: new Date()
    };
    setConnectedSources(prev => [...prev, newSource]);
    onDataSourceConnect(newSource);
    setDatabaseUrl('');
  };

  const connectProgrammingEnv = async (envName: 'python' | 'r' | 'matlab') => {
    await simulateIntegrationProgress(`${envName.toUpperCase()} Environment`, 15000);
    
    const newSource: DataSource = {
      id: Date.now().toString(),
      name: `${envName.toUpperCase()} Environment`,
      type: 'programming',
      status: 'connected',
      lastSync: new Date()
    };
    setConnectedSources(prev => [...prev, newSource]);
    onDataSourceConnect(newSource);
  };

  const connectCloudPlatform = async (platformName: string, type: 'cloud' | 'warehouse') => {
    const estimatedTime = type === 'warehouse' ? 20000 : 12000; // Warehouses take longer
    await simulateIntegrationProgress(platformName, estimatedTime);
    
    const newSource: DataSource = {
      id: Date.now().toString(),
      name: platformName,
      type: type,
      status: 'connected',
      lastSync: new Date()
    };
    setConnectedSources(prev => [...prev, newSource]);
    onDataSourceConnect(newSource);
  };

  const connectBITool = async (toolName: 'tableau' | 'powerbi' | 'looker') => {
    await simulateIntegrationProgress(`${toolName.charAt(0).toUpperCase() + toolName.slice(1)} Integration`, 10000);
    
    const newSource: DataSource = {
      id: Date.now().toString(),
      name: `${toolName.charAt(0).toUpperCase() + toolName.slice(1)} Integration`,
      type: toolName,
      status: 'connected',
      lastSync: new Date()
    };
    setConnectedSources(prev => [...prev, newSource]);
    onDataSourceConnect(newSource);
  };

  const connectDBTool = async (toolName: string) => {
    const estimatedTime = 8000; // DB tools typically connect faster
    await simulateIntegrationProgress(toolName, estimatedTime);
    
    const newSource: DataSource = {
      id: Date.now().toString(),
      name: toolName,
      type: 'dbtools',
      status: 'connected',
      lastSync: new Date()
    };
    setConnectedSources(prev => [...prev, newSource]);
    onDataSourceConnect(newSource);
  };

  if (integrationProgress) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connecting to Data Source</h2>
          <p className="text-gray-600">Please wait while we establish the connection...</p>
        </div>
        <IntegrationProgress
          isConnecting={integrationProgress.isConnecting}
          progress={integrationProgress.progress}
          status={integrationProgress.status}
          serviceName={integrationProgress.serviceName}
          estimatedTime={integrationProgress.estimatedTime}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Connect Your Data</h2>
        <p className="text-gray-600">Upload files, paste data directly, or connect to your data sources</p>
      </div>

      <Tabs defaultValue="files" className="w-full">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="files" className="flex items-center gap-1 text-xs">
            <Upload className="w-3 h-3" />
            Files
          </TabsTrigger>
          <TabsTrigger value="paste" className="flex items-center gap-1 text-xs">
            <FileText className="w-3 h-3" />
            Paste
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-1 text-xs">
            <Database className="w-3 h-3" />
            SQL
          </TabsTrigger>
          <TabsTrigger value="dbtools" className="flex items-center gap-1 text-xs">
            <Wrench className="w-3 h-3" />
            DBTools
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-1 text-xs">
            <Code className="w-3 h-3" />
            Code
          </TabsTrigger>
          <TabsTrigger value="cloud" className="flex items-center gap-1 text-xs">
            <Cloud className="w-3 h-3" />
            Cloud
          </TabsTrigger>
          <TabsTrigger value="warehouse" className="flex items-center gap-1 text-xs">
            <Server className="w-3 h-3" />
            Warehouse
          </TabsTrigger>
          <TabsTrigger value="amplitude" className="flex items-center gap-1 text-xs">
            <Globe className="w-3 h-3" />
            Amplitude
          </TabsTrigger>
          <TabsTrigger value="bi" className="flex items-center gap-1 text-xs">
            <BarChart3 className="w-3 h-3" />
            BI Tools
          </TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-4">
          <Card className="p-6">
            <div className="text-center">
              <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Data Files</h3>
              <p className="text-gray-600 mb-4">Upload CSV, JSON, or Excel files with your data</p>
              <Label htmlFor="file-upload" className="cursor-pointer">
                <div className="border-2 border-dashed border-blue-300 hover:border-blue-400 rounded-lg p-6 transition-colors">
                  <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <span className="text-blue-600 font-medium">Click to upload or drag and drop</span>
                  <p className="text-sm text-gray-500 mt-1">Supports CSV, JSON, XLSX files up to 50MB</p>
                </div>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".csv,.json,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </Label>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="paste" className="space-y-4">
          <Card className="p-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Paste Your Data</h3>
              <p className="text-gray-600 mb-4">
                Copy and paste your data in any format - CSV, JSON, lists, or even unstructured text. 
                I'll automatically detect the format and structure it for analysis.
              </p>
              <div className="space-y-4">
                <Textarea
                  placeholder="Paste your data here... 

Examples:
• CSV: name,age,city
       John,25,NYC
• JSON: [{'name':'John','age':25}]
• Lists: Item 1
        Item 2
• Key-value: name: John
           age: 25"
                  value={rawDataText}
                  onChange={(e) => setRawDataText(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
                <Button onClick={handleRawDataPaste} className="w-full" disabled={!rawDataText.trim()}>
                  Parse and Connect Data
                </Button>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p>✨ Supports: CSV, JSON, TSV, pipe-delimited, key-value pairs, and simple lists</p>
                <p>🔍 Automatic format detection - just paste and I'll figure it out!</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">SQL Database Connection</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="db-url">Database Connection String</Label>
                <Input
                  id="db-url"
                  type="password"
                  placeholder="postgresql://user:pass@host:port/database"
                  value={databaseUrl}
                  onChange={(e) => setDatabaseUrl(e.target.value)}
                />
              </div>
              <Button onClick={connectDatabase} className="w-full">
                Connect Database
              </Button>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>🗄️ Supports: PostgreSQL, MySQL, SQLite, SQL Server</p>
              <p>🔐 Read-only access recommended for safety</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="dbtools" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Database Management Tools</h3>
            <p className="text-gray-600 mb-6">Connect to popular database administration and development tools</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center gap-2 hover:bg-blue-50 border-blue-200"
                onClick={() => connectDBTool('DBeaver')}
              >
                <Database className="w-8 h-8 text-blue-600" />
                <div className="text-center">
                  <div className="font-medium">DBeaver</div>
                  <div className="text-xs text-gray-500">Universal DB tool</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center gap-2 hover:bg-green-50 border-green-200"
                onClick={() => connectDBTool('TablePlus')}
              >
                <Database className="w-8 h-8 text-green-600" />
                <div className="text-center">
                  <div className="font-medium">TablePlus</div>
                  <div className="text-xs text-gray-500">Modern DB client</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center gap-2 hover:bg-purple-50 border-purple-200"
                onClick={() => connectDBTool('DataGrip')}
              >
                <Database className="w-8 h-8 text-purple-600" />
                <div className="text-center">
                  <div className="font-medium">DataGrip</div>
                  <div className="text-xs text-gray-500">JetBrains IDE</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center gap-2 hover:bg-red-50 border-red-200"
                onClick={() => connectDBTool('phpMyAdmin')}
              >
                <Database className="w-8 h-8 text-red-600" />
                <div className="text-center">
                  <div className="font-medium">phpMyAdmin</div>
                  <div className="text-xs text-gray-500">MySQL web admin</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center gap-2 hover:bg-indigo-50 border-indigo-200"
                onClick={() => connectDBTool('pgAdmin')}
              >
                <Database className="w-8 h-8 text-indigo-600" />
                <div className="text-center">
                  <div className="font-medium">pgAdmin</div>
                  <div className="text-xs text-gray-500">PostgreSQL admin</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center gap-2 hover:bg-orange-50 border-orange-200"
                onClick={() => connectDBTool('MySQL Workbench')}
              >
                <Database className="w-8 h-8 text-orange-600" />
                <div className="text-center">
                  <div className="font-medium">MySQL Workbench</div>
                  <div className="text-xs text-gray-500">Visual DB design</div>
                </div>
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-2"
                onClick={() => connectDBTool('Adminer')}
              >
                <Wrench className="w-5 h-5" />
                <span className="text-sm">Adminer</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-2"
                onClick={() => connectDBTool('Sequel Pro')}
              >
                <Wrench className="w-5 h-5" />
                <span className="text-sm">Sequel Pro</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-2"
                onClick={() => connectDBTool('HeidiSQL')}
              >
                <Wrench className="w-5 h-5" />
                <span className="text-sm">HeidiSQL</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-2"
                onClick={() => connectDBTool('Navicat')}
              >
                <Wrench className="w-5 h-5" />
                <span className="text-sm">Navicat</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-2"
                onClick={() => connectDBTool('SQLiteStudio')}
              >
                <Wrench className="w-5 h-5" />
                <span className="text-sm">SQLiteStudio</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-2"
                onClick={() => connectDBTool('MongoDB Compass')}
              >
                <Wrench className="w-5 h-5" />
                <span className="text-sm">MongoDB Compass</span>
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium mb-2">🛠️ Database Tools Integration</p>
              <p className="text-sm text-blue-700">
                Connect to your favorite database management tools. Import schemas, query results, 
                and database metadata for comprehensive data analysis and visualization.
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Programming Languages & Environments</h3>
            <p className="text-gray-600 mb-6">Connect to popular data science and analysis environments</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center gap-2 hover:bg-green-50 border-green-200"
                onClick={() => connectProgrammingEnv('python')}
              >
                <Code className="w-8 h-8 text-green-600" />
                <div className="text-center">
                  <div className="font-medium">Python/Jupyter</div>
                  <div className="text-xs text-gray-500">pandas, numpy, matplotlib</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center gap-2 hover:bg-blue-50 border-blue-200"
                onClick={() => connectProgrammingEnv('r')}
              >
                <Code className="w-8 h-8 text-blue-600" />
                <div className="text-center">
                  <div className="font-medium">R/RStudio</div>
                  <div className="text-xs text-gray-500">Statistical computing</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center gap-2 hover:bg-orange-50 border-orange-200"
                onClick={() => connectProgrammingEnv('matlab')}
              >
                <Code className="w-8 h-8 text-orange-600" />
                <div className="text-center">
                  <div className="font-medium">MATLAB</div>
                  <div className="text-xs text-gray-500">Scientific computing</div>
                </div>
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800 font-medium mb-2">🚀 Code Environment Integration</p>
              <p className="text-sm text-green-700">
                Import notebooks, scripts, and analysis results. Sync with your development environment 
                and leverage existing data processing workflows.
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="cloud" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Cloud Analytics Platforms</h3>
            <p className="text-gray-600 mb-6">Connect to popular cloud-based analytics and tracking platforms</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-1"
                onClick={() => connectCloudPlatform('Google Analytics 4', 'cloud')}
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs">Google Analytics 4</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-1"
                onClick={() => connectCloudPlatform('Adobe Analytics', 'cloud')}
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs">Adobe Analytics</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-1"
                onClick={() => connectCloudPlatform('Mixpanel', 'cloud')}
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs">Mixpanel</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-1"
                onClick={() => connectCloudPlatform('Segment', 'cloud')}
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs">Segment</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-1"
                onClick={() => connectCloudPlatform('Heap Analytics', 'cloud')}
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs">Heap Analytics</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-1"
                onClick={() => connectCloudPlatform('Salesforce Analytics', 'cloud')}
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs">Salesforce</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-1"
                onClick={() => connectCloudPlatform('HubSpot', 'cloud')}
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs">HubSpot</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-1"
                onClick={() => connectCloudPlatform('Klaviyo', 'cloud')}
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs">Klaviyo</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-1"
                onClick={() => connectCloudPlatform('Shopify Analytics', 'cloud')}
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs">Shopify</span>
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium mb-2">☁️ Cloud Platform Integration</p>
              <p className="text-sm text-blue-700">
                Seamlessly connect to your cloud analytics platforms. Import user behavior data, 
                marketing metrics, and business intelligence from your existing tools.
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="warehouse" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Data Warehouses & Lakes</h3>
            <p className="text-gray-600 mb-6">Connect to enterprise data storage and processing platforms</p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center gap-2 hover:bg-blue-50 border-blue-200"
                onClick={() => connectCloudPlatform('Snowflake', 'warehouse')}
              >
                <Server className="w-8 h-8 text-blue-600" />
                <div className="text-center">
                  <div className="font-medium">Snowflake</div>
                  <div className="text-xs text-gray-500">Cloud data platform</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center gap-2 hover:bg-red-50 border-red-200"
                onClick={() => connectCloudPlatform('BigQuery', 'warehouse')}
              >
                <Server className="w-8 h-8 text-red-600" />
                <div className="text-center">
                  <div className="font-medium">BigQuery</div>
                  <div className="text-xs text-gray-500">Google Cloud</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center gap-2 hover:bg-orange-50 border-orange-200"
                onClick={() => connectCloudPlatform('Redshift', 'warehouse')}
              >
                <Server className="w-8 h-8 text-orange-600" />
                <div className="text-center">
                  <div className="font-medium">Redshift</div>
                  <div className="text-xs text-gray-500">Amazon AWS</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center gap-2 hover:bg-purple-50 border-purple-200"
                onClick={() => connectCloudPlatform('Databricks', 'warehouse')}
              >
                <Server className="w-8 h-8 text-purple-600" />
                <div className="text-center">
                  <div className="font-medium">Databricks</div>
                  <div className="text-xs text-gray-500">Unified analytics</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center gap-2 hover:bg-green-50 border-green-200"
                onClick={() => connectCloudPlatform('Amazon S3', 'warehouse')}
              >
                <Server className="w-8 h-8 text-green-600" />
                <div className="text-center">
                  <div className="font-medium">Amazon S3</div>
                  <div className="text-xs text-gray-500">Data lake storage</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center gap-2 hover:bg-indigo-50 border-indigo-200"
                onClick={() => connectCloudPlatform('Azure Data Lake', 'warehouse')}
              >
                <Server className="w-8 h-8 text-indigo-600" />
                <div className="text-center">
                  <div className="font-medium">Azure Data Lake</div>
                  <div className="text-xs text-gray-500">Microsoft Azure</div>
                </div>
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-800 font-medium mb-2">🏢 Enterprise Data Integration</p>
              <p className="text-sm text-purple-700">
                Connect to your enterprise data infrastructure. Access large-scale datasets, 
                data lakes, and warehouses with enterprise-grade security and performance.
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="amplitude" className="space-y-4">
          <AmplitudeIntegration onConnect={handleAmplitudeConnect} />
        </TabsContent>

        <TabsContent value="bi" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Business Intelligence Tools</h3>
            <p className="text-gray-600 mb-6">Connect to popular BI platforms for enterprise-scale analysis</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center gap-2 hover:bg-blue-50 border-blue-200"
                onClick={() => connectBITool('tableau')}
              >
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <div className="text-center">
                  <div className="font-medium">Tableau</div>
                  <div className="text-xs text-gray-500">Data visualization</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center gap-2 hover:bg-yellow-50 border-yellow-200"
                onClick={() => connectBITool('powerbi')}
              >
                <BarChart3 className="w-8 h-8 text-yellow-600" />
                <div className="text-center">
                  <div className="font-medium">Power BI</div>
                  <div className="text-xs text-gray-500">Microsoft analytics</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="h-24 flex flex-col items-center gap-2 hover:bg-green-50 border-green-200"
                onClick={() => connectBITool('looker')}
              >
                <BarChart3 className="w-8 h-8 text-green-600" />
                <div className="text-center">
                  <div className="font-medium">Looker</div>
                  <div className="text-xs text-gray-500">Google Cloud BI</div>
                </div>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-2"
                onClick={() => connectCloudPlatform('Qlik Sense', 'cloud')}
              >
                <BarChart3 className="w-6 h-6" />
                Qlik Sense
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-2"
                onClick={() => connectCloudPlatform('Sisense', 'cloud')}
              >
                <BarChart3 className="w-6 h-6" />
                Sisense
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-2"
                onClick={() => connectCloudPlatform('Domo', 'cloud')}
              >
                <BarChart3 className="w-6 h-6" />
                Domo
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center gap-2"
                onClick={() => connectCloudPlatform('Looker Studio', 'cloud')}
              >
                <BarChart3 className="w-6 h-6" />
                Looker Studio
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 font-medium mb-2">✨ Enhanced BI Integration</p>
              <p className="text-sm text-blue-700">
                Connect your existing dashboards and reports. Import data models, sync with scheduled refreshes, 
                and leverage AI insights alongside your current BI workflows.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {connectedSources.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Connected Data Sources</h3>
          <div className="space-y-3">
            {connectedSources.map((source) => (
              <div key={source.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    {source.type === 'file' && <FileText className="w-4 h-4 text-green-600" />}
                    {source.type === 'database' && <Database className="w-4 h-4 text-green-600" />}
                    {(source.type === 'api' || source.type === 'amplitude') && <Globe className="w-4 h-4 text-green-600" />}
                    {(source.type === 'tableau' || source.type === 'powerbi' || source.type === 'looker') && <BarChart3 className="w-4 h-4 text-green-600" />}
                    {source.type === 'programming' && <Code className="w-4 h-4 text-green-600" />}
                    {(source.type === 'cloud' || source.type === 'warehouse') && <Server className="w-4 h-4 text-green-600" />}
                    {source.type === 'dbtools' && <Wrench className="w-4 h-4 text-green-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{source.name}</p>
                    <p className="text-sm text-gray-600">Last synced: {source.lastSync?.toLocaleString()}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Connected
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default DataSourceConfig;
