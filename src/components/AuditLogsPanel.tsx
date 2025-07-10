
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield,
  Eye,
  Download,
  Upload,
  Edit,
  Trash2,
  User,
  Clock,
  Filter,
  Search,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuditLog {
  id: string;
  timestamp: Date;
  user: string;
  action: 'view' | 'edit' | 'delete' | 'export' | 'upload' | 'share';
  resource: string;
  details: string;
  status: 'success' | 'warning' | 'error' | 'info';
  ipAddress?: string;
  userAgent?: string;
}

interface AuditLogsPanelProps {
  onExportLogs?: (logs: AuditLog[]) => void;
}

const AuditLogsPanel: React.FC<AuditLogsPanelProps> = ({ onExportLogs }) => {
  const [logs, setLogs] = useState<AuditLog[]>([
    {
      id: '1',
      timestamp: new Date(),
      user: 'sarah@company.com',
      action: 'view',
      resource: 'Sales Data Report',
      details: 'Accessed monthly sales dashboard',
      status: 'success',
      ipAddress: '192.168.1.100'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 3600000),
      user: 'john@company.com',
      action: 'export',
      resource: 'Customer Analytics',
      details: 'Downloaded customer insights as PDF',
      status: 'success',
      ipAddress: '192.168.1.101'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 7200000),
      user: 'mike@company.com',
      action: 'edit',
      resource: 'Marketing Campaign Data',
      details: 'Modified campaign performance metrics',
      status: 'warning',
      ipAddress: '192.168.1.102'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 10800000),
      user: 'admin@company.com',
      action: 'delete',
      resource: 'Old Survey Data',
      details: 'Removed outdated survey responses',
      status: 'info',
      ipAddress: '192.168.1.103'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { toast } = useToast();

  const getActionIcon = (action: AuditLog['action']) => {
    switch (action) {
      case 'view': return Eye;
      case 'edit': return Edit;
      case 'delete': return Trash2;
      case 'export': return Download;
      case 'upload': return Upload;
      case 'share': return FileText;
      default: return Info;
    }
  };

  const getStatusColor = (status: AuditLog['status']) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
      case 'error': return 'bg-red-100 text-red-700';
      case 'info': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: AuditLog['status']) => {
    switch (status) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      case 'info': return Info;
      default: return Info;
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    
    return matchesSearch && matchesAction && matchesStatus;
  });

  const handleExportLogs = () => {
    if (onExportLogs) {
      onExportLogs(filteredLogs);
    }
    
    // Create downloadable CSV
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Details', 'Status', 'IP Address'],
      ...filteredLogs.map(log => [
        log.timestamp.toISOString(),
        log.user,
        log.action,
        log.resource,
        log.details,
        log.status,
        log.ipAddress || 'N/A'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Audit Logs Exported",
      description: "Your audit logs have been downloaded as a CSV file.",
    });
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Shield className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">🔐 Audit Logs & Security</h3>
            <p className="text-sm text-gray-600">Track who accessed what and when</p>
          </div>
        </div>
        
        <Button onClick={handleExportLogs} className="bg-slate-600 hover:bg-slate-700">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      <Tabs defaultValue="logs" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          <TabsTrigger value="security">Security Events</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="action-filter">Action</Label>
              <select
                id="action-filter"
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Actions</option>
                <option value="view">View</option>
                <option value="edit">Edit</option>
                <option value="delete">Delete</option>
                <option value="export">Export</option>
                <option value="upload">Upload</option>
                <option value="share">Share</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="status-filter">Status</Label>
              <select
                id="status-filter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Status</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
                <option value="info">Info</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>

          {/* Logs List */}
          <div className="space-y-3">
            {filteredLogs.map((log) => {
              const ActionIcon = getActionIcon(log.action);
              const StatusIcon = getStatusIcon(log.status);
              
              return (
                <Card key={log.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <ActionIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-800">{log.resource}</h4>
                          <Badge variant="outline" className="text-xs">
                            {log.action}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(log.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {log.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{log.details}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {log.user}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {log.timestamp.toLocaleString()}
                          </span>
                          {log.ipAddress && (
                            <span>IP: {log.ipAddress}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Security Monitoring</h3>
            <p className="text-gray-500">
              Advanced security event tracking and threat detection - Coming soon!
            </p>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Compliance Reports</h3>
            <p className="text-gray-500">
              GDPR, HIPAA, and other compliance reporting tools - Coming soon!
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuditLogsPanel;
