
import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Database, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Activity,
  Zap,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface EnhancedUploadProgressProps {
  isUploading: boolean;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  filename?: string;
  error?: string;
  estimatedTime?: number;
  onSaveToAccount?: () => void;
  showSaveOption?: boolean;
}

const EnhancedUploadProgress: React.FC<EnhancedUploadProgressProps> = ({ 
  isUploading, 
  progress, 
  status, 
  filename,
  error,
  estimatedTime = 0,
  onSaveToAccount,
  showSaveOption = false
}) => {
  const [processingStage, setProcessingStage] = useState('parsing');
  const [backgroundTasks, setBackgroundTasks] = useState<string[]>([]);
  const { user, session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (status === 'processing') {
      const stages = ['parsing', 'analyzing', 'generating-insights', 'finalizing'];
      const currentStageIndex = Math.floor((progress / 100) * stages.length);
      setProcessingStage(stages[Math.min(currentStageIndex, stages.length - 1)]);

      // Simulate background tasks
      const tasks = [
        'Validating data structure',
        'Detecting column types',
        'Calculating statistics',
        'Generating quality metrics',
        'Creating visualizations'
      ];
      
      const activeTasks = tasks.slice(0, Math.floor((progress / 100) * tasks.length));
      setBackgroundTasks(activeTasks);
    }
  }, [progress, status]);

  const runQualityCheck = async () => {
    if (!filename) return;
    
    // Check authentication before proceeding
    if (!user || !session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to run quality checks.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('data-quality-check', {
        body: {
          datasetId: 'current', // We'd need to pass the actual dataset ID
          checks: ['completeness', 'consistency', 'accuracy', 'validity']
        }
      });

      if (error) throw error;

      toast({
        title: "Quality Check Complete",
        description: `Data quality score: ${data.overallScore}%`,
      });
    } catch (error: any) {
      console.error('Quality check failed:', error);
      toast({
        title: "Quality Check Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!isUploading && status !== 'complete' && status !== 'error') return null;

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${Math.ceil(seconds)}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.ceil(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return <Upload className="w-5 h-5 text-blue-600 animate-bounce" />;
      case 'processing':
        return <Database className="w-5 h-5 text-purple-600 animate-spin" />;
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Upload className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return 'Uploading and parsing file...';
      case 'processing':
        return getProcessingText();
      case 'complete':
        return 'Upload complete!';
      case 'error':
        return 'Upload failed';
      default:
        return 'Preparing upload...';
    }
  };

  const getProcessingText = () => {
    switch (processingStage) {
      case 'parsing':
        return 'Parsing data structure...';
      case 'analyzing':
        return 'Analyzing data patterns...';
      case 'generating-insights':
        return 'Generating insights...';
      case 'finalizing':
        return 'Finalizing analysis...';
      default:
        return 'Processing data...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'uploading':
        return 'from-blue-50 to-indigo-50 border-blue-200';
      case 'processing':
        return 'from-purple-50 to-blue-50 border-purple-200';
      case 'complete':
        return 'from-green-50 to-emerald-50 border-green-200';
      case 'error':
        return 'from-red-50 to-pink-50 border-red-200';
      default:
        return 'from-gray-50 to-slate-50 border-gray-200';
    }
  };

  return (
    <Card className={`bg-gradient-to-br ${getStatusColor()} border shadow-sm`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          {getStatusIcon()}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-800">{getStatusText()}</span>
              <div className="flex items-center gap-3">
                <Badge variant="outline">{progress}%</Badge>
                {estimatedTime > 0 && status !== 'complete' && status !== 'error' && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(estimatedTime / 1000)}</span>
                  </div>
                )}
              </div>
            </div>
            {filename && (
              <p className="text-sm text-gray-600 truncate">{filename}</p>
            )}
            {error && (
              <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
          </div>
        </div>
        
        <Progress value={progress} className="h-2 mb-4" />
        
        {status === 'processing' && backgroundTasks.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-purple-600 mb-2">
              <Activity className="w-4 h-4" />
              <span>Background Tasks</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {backgroundTasks.map((task, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>{task}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {status === 'complete' && (
          <div className="flex gap-2 pt-2">
            {showSaveOption && onSaveToAccount && (
              <Button variant="outline" size="sm" onClick={onSaveToAccount}>
                <Save className="w-4 h-4 mr-2" />
                Save to Account
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={runQualityCheck}
              disabled={!user || !session}
              title={!user || !session ? "Sign in to run quality checks" : "Run quality check"}
            >
              <Zap className="w-4 h-4 mr-2" />
              Run Quality Check
            </Button>
          </div>
        )}
        
        {(status === 'uploading' || status === 'processing') && estimatedTime > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            Please don't navigate away - analysis in progress
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedUploadProgress;
