
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Database, CheckCircle, AlertCircle } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface AmplitudeConfig {
  apiKey: string;
  secretKey: string;
  projectId: string;
  startDate: Date;
  endDate: Date;
  eventTypes: string[];
}

interface AmplitudeIntegrationProps {
  onConnect: (config: AmplitudeConfig, data: any) => void;
}

const AmplitudeIntegration: React.FC<AmplitudeIntegrationProps> = ({ onConnect }) => {
  const [config, setConfig] = useState<AmplitudeConfig>({
    apiKey: '',
    secretKey: '',
    projectId: '',
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
    eventTypes: []
  });
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [availableEvents, setAvailableEvents] = useState<string[]>([]);

  const testConnection = async () => {
    if (!config.apiKey || !config.secretKey) return;
    
    setIsConnecting(true);
    setConnectionStatus('testing');
    
    try {
      // Simulate API call to test connection and fetch events
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock available events (in real implementation, this would come from Amplitude API)
      const mockEvents = [
        'User Sign Up', 
        'Session Start', 
        'Page View', 
        'Button Click', 
        'Purchase Complete',
        'Feature Used',
        'App Open',
        'Form Submit'
      ];
      
      setAvailableEvents(mockEvents);
      setConnectionStatus('success');
      
      // Auto-select common events
      setConfig(prev => ({
        ...prev,
        eventTypes: ['Session Start', 'Page View', 'Button Click']
      }));
      
    } catch (error) {
      setConnectionStatus('error');
      console.error('Connection test failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleConnect = async () => {
    if (connectionStatus !== 'success') {
      await testConnection();
      return;
    }

    setIsConnecting(true);
    
    try {
      // Simulate data fetching from Amplitude
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock data structure similar to what Amplitude Export API would return
      const mockData = {
        data: Array.from({ length: 1000 }, (_, i) => ({
          event_id: `evt_${i}`,
          user_id: `user_${Math.floor(Math.random() * 100)}`,
          event_type: config.eventTypes[Math.floor(Math.random() * config.eventTypes.length)],
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          event_properties: {
            page_url: `/page-${Math.floor(Math.random() * 10)}`,
            button_name: `button-${Math.floor(Math.random() * 5)}`,
            session_id: `session_${Math.floor(Math.random() * 200)}`
          },
          user_properties: {
            platform: ['web', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
            country: ['US', 'UK', 'CA', 'DE', 'FR'][Math.floor(Math.random() * 5)]
          }
        })),
        summary: {
          totalEvents: 1000,
          dateRange: `${format(config.startDate, 'MMM dd')} - ${format(config.endDate, 'MMM dd')}`,
          eventTypes: config.eventTypes
        }
      };

      onConnect(config, mockData);
      
    } catch (error) {
      console.error('Data fetch failed:', error);
      setConnectionStatus('error');
    } finally {
      setIsConnecting(false);
    }
  };

  const toggleEventType = (eventType: string) => {
    setConfig(prev => ({
      ...prev,
      eventTypes: prev.eventTypes.includes(eventType)
        ? prev.eventTypes.filter(e => e !== eventType)
        : [...prev.eventTypes, eventType]
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Database className="w-5 h-5 text-purple-600" />
          Connect to Amplitude
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* API Credentials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="api-key">API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter your Amplitude API key"
              value={config.apiKey}
              onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="secret-key">Secret Key</Label>
            <Input
              id="secret-key"
              type="password"
              placeholder="Enter your Amplitude Secret key"
              value={config.secretKey}
              onChange={(e) => setConfig(prev => ({ ...prev, secretKey: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="project-id">Project ID (Optional)</Label>
          <Input
            id="project-id"
            placeholder="Leave blank for default project"
            value={config.projectId}
            onChange={(e) => setConfig(prev => ({ ...prev, projectId: e.target.value }))}
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !config.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {config.startDate ? format(config.startDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={config.startDate}
                  onSelect={(date) => date && setConfig(prev => ({ ...prev, startDate: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !config.endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {config.endDate ? format(config.endDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={config.endDate}
                  onSelect={(date) => date && setConfig(prev => ({ ...prev, endDate: date }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Connection Test */}
        <div className="flex items-center gap-3">
          <Button 
            onClick={testConnection}
            disabled={!config.apiKey || !config.secretKey || isConnecting}
            variant="outline"
          >
            {isConnecting && connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
          </Button>
          {connectionStatus === 'success' && (
            <Badge variant="secondary" className="bg-green-100 text-green-700 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Connected
            </Badge>
          )}
          {connectionStatus === 'error' && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Connection Failed
            </Badge>
          )}
        </div>

        {/* Event Selection */}
        {availableEvents.length > 0 && (
          <div>
            <Label className="text-base font-medium">Select Events to Import</Label>
            <p className="text-sm text-gray-600 mb-3">Choose which events you want to analyze</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableEvents.map((eventType) => (
                <Button
                  key={eventType}
                  variant={config.eventTypes.includes(eventType) ? "default" : "outline"}
                  size="sm"
                  className="justify-start"
                  onClick={() => toggleEventType(eventType)}
                >
                  {eventType}
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Selected: {config.eventTypes.length} event types
            </p>
          </div>
        )}

        {/* Connect Button */}
        <Button 
          onClick={handleConnect}
          disabled={!config.apiKey || !config.secretKey || config.eventTypes.length === 0 || isConnecting}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          {isConnecting ? 'Importing Data...' : connectionStatus === 'success' ? 'Import Selected Events' : 'Connect & Import Data'}
        </Button>

        {/* Info */}
        <div className="text-sm text-gray-600 space-y-2">
          <p>📊 We'll import event data from your selected date range</p>
          <p>🔒 Your API credentials are used only for this session and not stored</p>
          <p>⚡ Data is processed locally in your browser for security</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AmplitudeIntegration;
