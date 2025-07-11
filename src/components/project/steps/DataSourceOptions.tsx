
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Upload, 
  FileText, 
  Database, 
  BarChart3, 
  Cloud, 
  Globe,
  Activity,
  Eye,
  Table,
  Layers
} from 'lucide-react';

interface DataSourceOptionsProps {
  onFileUpload: (files: File[]) => void;
  onDataPaste: (data: string) => void;
  onDatabaseConnect: (config: any) => void;
  onPlatformConnect: (platform: string, config: any) => void;
}

const DataSourceOptions: React.FC<DataSourceOptionsProps> = ({
  onFileUpload,
  onDataPaste,
  onDatabaseConnect,
  onPlatformConnect
}) => {
  const [pasteData, setPasteData] = useState('');
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [connectionConfig, setConnectionConfig] = useState<any>({});

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileUpload(Array.from(files));
    }
  };

  const handlePasteSubmit = () => {
    if (pasteData.trim()) {
      onDataPaste(pasteData);
      setPasteData('');
    }
  };

  const handleDatabaseConnect = () => {
    onDatabaseConnect(connectionConfig);
    setSelectedSource(null);
    setConnectionConfig({});
  };

  const handlePlatformConnect = (platform: string) => {
    onPlatformConnect(platform, connectionConfig);
    setSelectedSource(null);
    setConnectionConfig({});
  };

  const dataSources = [
    {
      id: 'upload',
      title: 'Upload File',
      description: 'CSV, JSON, Excel, or TXT',
      icon: Upload,
      color: 'blue',
      type: 'file'
    },
    {
      id: 'paste',
      title: 'Paste Data',
      description: 'Copy & paste your data',
      icon: FileText,
      color: 'green',
      type: 'paste'
    },
    {
      id: 'database',
      title: 'Connect Database',
      description: 'MySQL, PostgreSQL, SQL Server',
      icon: Database,
      color: 'purple',
      type: 'database'
    },
    {
      id: 'amplitude',
      title: 'Amplitude',
      description: 'Product analytics platform',
      icon: Activity,
      color: 'orange',
      type: 'platform'
    },
    {
      id: 'looker',
      title: 'Looker',
      description: 'Business intelligence platform',
      icon: Eye,
      color: 'teal',
      type: 'platform'
    },
    {
      id: 'powerbi',
      title: 'Power BI',
      description: 'Microsoft business analytics',
      icon: BarChart3,
      color: 'yellow',
      type: 'platform'
    },
    {
      id: 'tableau',
      title: 'Tableau',
      description: 'Data visualization platform',
      icon: Layers,
      color: 'indigo',
      type: 'platform'
    },
    {
      id: 'snowflake',
      title: 'Snowflake',
      description: 'Cloud data warehouse',
      icon: Cloud,
      color: 'cyan',
      type: 'platform'
    },
    {
      id: 'bigquery',
      title: 'BigQuery',
      description: 'Google Cloud data warehouse',
      icon: Globe,
      color: 'red',
      type: 'platform'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700',
      green: 'border-green-300 bg-green-50 hover:bg-green-100 text-green-700',
      purple: 'border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-700',
      orange: 'border-orange-300 bg-orange-50 hover:bg-orange-100 text-orange-700',
      teal: 'border-teal-300 bg-teal-50 hover:bg-teal-100 text-teal-700',
      yellow: 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100 text-yellow-700',
      indigo: 'border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-indigo-700',
      cyan: 'border-cyan-300 bg-cyan-50 hover:bg-cyan-100 text-cyan-700',
      red: 'border-red-300 bg-red-50 hover:bg-red-100 text-red-700'
    };
    return colorMap[color] || colorMap.blue;
  };

  if (selectedSource === 'paste') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" onClick={() => setSelectedSource(null)}>
            ← Back
          </Button>
          <h3 className="text-lg font-semibold">Paste Your Data</h3>
        </div>
        <div className="space-y-4">
          <Label htmlFor="paste-data">Paste your data (CSV format recommended)</Label>
          <Textarea
            id="paste-data"
            placeholder="user_id,event,timestamp&#10;user1,click,2024-01-01&#10;user2,view,2024-01-02"
            value={pasteData}
            onChange={(e) => setPasteData(e.target.value)}
            rows={10}
            className="font-mono text-sm"
          />
          <Button onClick={handlePasteSubmit} disabled={!pasteData.trim()}>
            Process Data
          </Button>
        </div>
      </div>
    );
  }

  if (selectedSource === 'database') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" onClick={() => setSelectedSource(null)}>
            ← Back
          </Button>
          <h3 className="text-lg font-semibold">Connect Database</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="db-type">Database Type</Label>
            <select
              id="db-type"
              className="w-full p-2 border rounded-md"
              value={connectionConfig.type || ''}
              onChange={(e) => setConnectionConfig({...connectionConfig, type: e.target.value})}
            >
              <option value="">Select Database</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="mysql">MySQL</option>
              <option value="sqlserver">SQL Server</option>
              <option value="sqlite">SQLite</option>
            </select>
          </div>
          <div>
            <Label htmlFor="db-host">Host</Label>
            <Input
              id="db-host"
              placeholder="localhost"
              value={connectionConfig.host || ''}
              onChange={(e) => setConnectionConfig({...connectionConfig, host: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="db-port">Port</Label>
            <Input
              id="db-port"
              placeholder="5432"
              value={connectionConfig.port || ''}
              onChange={(e) => setConnectionConfig({...connectionConfig, port: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="db-name">Database Name</Label>
            <Input
              id="db-name"
              placeholder="mydatabase"
              value={connectionConfig.database || ''}
              onChange={(e) => setConnectionConfig({...connectionConfig, database: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="db-user">Username</Label>
            <Input
              id="db-user"
              placeholder="username"
              value={connectionConfig.username || ''}
              onChange={(e) => setConnectionConfig({...connectionConfig, username: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="db-pass">Password</Label>
            <Input
              id="db-pass"
              type="password"
              placeholder="password"
              value={connectionConfig.password || ''}
              onChange={(e) => setConnectionConfig({...connectionConfig, password: e.target.value})}
            />
          </div>
        </div>
        <Button onClick={handleDatabaseConnect} className="w-full">
          Test Connection & Connect
        </Button>
      </div>
    );
  }

  if (selectedSource && dataSources.find(ds => ds.id === selectedSource)?.type === 'platform') {
    const platform = dataSources.find(ds => ds.id === selectedSource);
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" onClick={() => setSelectedSource(null)}>
            ← Back
          </Button>
          <h3 className="text-lg font-semibold">Connect to {platform?.title}</h3>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="api-key">API Key / Access Token</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your API key"
              value={connectionConfig.apiKey || ''}
              onChange={(e) => setConnectionConfig({...connectionConfig, apiKey: e.target.value})}
            />
          </div>
          {selectedSource === 'amplitude' && (
            <div>
              <Label htmlFor="secret-key">Secret Key</Label>
              <Input
                id="secret-key"
                type="password"
                placeholder="Enter your secret key"
                value={connectionConfig.secretKey || ''}
                onChange={(e) => setConnectionConfig({...connectionConfig, secretKey: e.target.value})}
              />
            </div>
          )}
          <div>
            <Label htmlFor="project-id">Project/Workspace ID</Label>
            <Input
              id="project-id"
              placeholder="Enter project or workspace ID"
              value={connectionConfig.projectId || ''}
              onChange={(e) => setConnectionConfig({...connectionConfig, projectId: e.target.value})}
            />
          </div>
          <Button onClick={() => handlePlatformConnect(selectedSource)} className="w-full">
            Connect to {platform?.title}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Data</h2>
        <p className="text-gray-600">Upload files or connect to your data sources</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dataSources.map((source) => {
          const Icon = source.icon;
          return (
            <Card
              key={source.id}
              className={`cursor-pointer transition-all duration-200 border-2 border-dashed ${getColorClasses(source.color)}`}
              onClick={() => {
                if (source.type === 'file') {
                  document.getElementById('file-upload')?.click();
                } else {
                  setSelectedSource(source.id);
                }
              }}
            >
              <CardContent className="pt-6">
                <div className="text-center space-y-3">
                  <Icon className="w-12 h-12 mx-auto" />
                  <div>
                    <h3 className="font-semibold text-lg">{source.title}</h3>
                    <p className="text-sm opacity-80">{source.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <input
        id="file-upload"
        type="file"
        multiple
        accept=".csv,.json,.xlsx,.xls,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default DataSourceOptions;
