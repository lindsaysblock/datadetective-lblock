
import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Database, 
  Upload, 
  Zap, 
  Globe, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Calendar
} from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  type: 'file' | 'database' | 'api' | 'warehouse' | 'amplitude';
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
}

interface DataSourceConfigProps {
  onDataSourceConnect: (source: DataSource) => void;
  onFileUpload: (file: File) => Promise<void>;
}

const DataSourceConfig: React.FC<DataSourceConfigProps> = ({
  onDataSourceConnect,
  onFileUpload
}) => {
  const [connectionForm, setConnectionForm] = useState({
    host: '',
    database: '',
    username: '',
    password: ''
  });
  const { toast } = useToast();

  const dataSources: DataSource[] = [
    {
      id: 'postgres',
      name: 'PostgreSQL',
      type: 'database',
      status: 'disconnected'
    },
    {
      id: 'mysql',
      name: 'MySQL',
      type: 'database', 
      status: 'disconnected'
    },
    {
      id: 'amplitude',
      name: 'Amplitude',
      type: 'amplitude',
      status: 'disconnected'
    },
    {
      id: 'warehouse',
      name: 'Data Warehouse',
      type: 'warehouse',
      status: 'disconnected'
    }
  ];

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onFileUpload(file);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Database className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Upload Data Files</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file-upload" className="block text-sm font-medium mb-2">
              Select File
            </Label>
            <Input
              id="file-upload"
              type="file"
              accept=".csv,.json,.txt,.xlsx"
              onChange={handleFileSelect}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported formats: CSV, JSON, TXT, XLSX (max 100MB)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dataSources.map((source) => (
          <Card key={source.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getStatusIcon(source.status)}
                  <h4 className="font-medium">{source.name}</h4>
                </div>
                <Badge className={getStatusColor(source.status)}>
                  {source.status}
                </Badge>
              </div>
              
              {source.lastSync && (
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                  <Calendar className="w-3 h-3" />
                  Last sync: {source.lastSync.toLocaleDateString()}
                </div>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDataSourceConnect(source)}
                className="w-full"
              >
                {source.status === 'connected' ? 'Reconnect' : 'Connect'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Database Connection Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Custom Database Connection</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="host">Host</Label>
              <Input
                id="host"
                placeholder="localhost"
                value={connectionForm.host}
                onChange={(e) => setConnectionForm({...connectionForm, host: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="database">Database</Label>
              <Input
                id="database"
                placeholder="mydatabase"
                value={connectionForm.database}
                onChange={(e) => setConnectionForm({...connectionForm, database: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="user"
                value={connectionForm.username}
                onChange={(e) => setConnectionForm({...connectionForm, username: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={connectionForm.password}
                onChange={(e) => setConnectionForm({...connectionForm, password: e.target.value})}
              />
            </div>
          </div>
          <Button className="w-full">
            Test Connection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSourceConfig;
