import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Database, Globe, FileText, Settings, BarChart3 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { parseRawText } from '../utils/dataParser';
import AmplitudeIntegration from './AmplitudeIntegration';

interface DataSource {
  id: string;
  name: string;
  type: 'file' | 'database' | 'api' | 'warehouse' | 'amplitude' | 'tableau' | 'powerbi' | 'looker';
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
    if (!rawDataText.trim()) return;
    
    try {
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

  const connectAnalytics = () => {
    if (!apiKey.trim()) return;
    
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

  const connectDatabase = () => {
    if (!databaseUrl.trim()) return;
    
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

  const connectBITool = (toolName: 'tableau' | 'powerbi' | 'looker') => {
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Connect Your Data</h2>
        <p className="text-gray-600">Upload files, paste data directly, or connect to your data sources</p>
      </div>

      <Tabs defaultValue="amplitude" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="amplitude" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Amplitude
          </TabsTrigger>
          <TabsTrigger value="paste" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Paste
          </TabsTrigger>
          <TabsTrigger value="file" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Files
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Database
          </TabsTrigger>
          <TabsTrigger value="warehouse" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            BI Tools
          </TabsTrigger>
        </TabsList>

        <TabsContent value="amplitude" className="space-y-4">
          <AmplitudeIntegration onConnect={handleAmplitudeConnect} />
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

        <TabsContent value="file" className="space-y-4">
          <Card className="p-6">
            <div className="text-center">
              <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Data Files</h3>
              <p className="text-gray-600 mb-4">Upload CSV, JSON, or Excel files with your user behavior data</p>
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

        <TabsContent value="analytics" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Analytics Platforms</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="api-key">API Key</Label>
                <Input
                  id="api-key"
                  type="password"
                  placeholder="Enter your analytics API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <Button onClick={connectAnalytics} className="w-full">
                Connect Analytics Platform
              </Button>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>📊 Supports: Google Analytics, Mixpanel, Segment</p>
              <p>🔒 Your API keys are stored securely</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Database Connection</h3>
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
              <p>🗄️ Supports: PostgreSQL, MySQL, SQLite</p>
              <p>🔐 Read-only access recommended for safety</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="warehouse" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Business Intelligence Tools</h3>
            <p className="text-gray-600 mb-6">Connect to popular BI platforms and data warehouses for enterprise-scale analysis</p>
            
            {/* BI Tools Section */}
            <div className="mb-6">
              <h4 className="text-md font-medium mb-4 text-gray-700">Business Intelligence Platforms</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
            </div>

            {/* Data Warehouses Section */}
            <div>
              <h4 className="text-md font-medium mb-4 text-gray-700">Data Warehouses</h4>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <Database className="w-6 h-6" />
                  Snowflake
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <Database className="w-6 h-6" />
                  BigQuery
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <Database className="w-6 h-6" />
                  Redshift
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                  <Database className="w-6 h-6" />
                  Databricks
                </Button>
              </div>
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
