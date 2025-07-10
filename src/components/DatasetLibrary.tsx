
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Download, Calendar, Database, FileText } from 'lucide-react';
import { useDatasetPersistence } from '@/hooks/useDatasetPersistence';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LoadingCard from './ui/loading-card';
import EmptyState from './ui/empty-state';
import { formatFileSize } from '../utils/dataProcessing';

interface DatasetLibraryProps {
  onDatasetSelect?: (dataset: any) => void;
}

const DatasetLibrary: React.FC<DatasetLibraryProps> = ({ onDatasetSelect }) => {
  const { datasets, loading, deleteDataset } = useDatasetPersistence();
  const { toast } = useToast();

  const handleExport = async (dataset: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('export-data', {
        body: {
          datasetId: dataset.id,
          format: 'json',
          includeAnalysis: true
        }
      });

      if (error) throw error;

      // Create download link
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataset.name}_export.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: `${dataset.name} has been exported successfully.`,
      });
    } catch (error: any) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export dataset",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <LoadingCard />;
  }

  if (datasets.length === 0) {
    return (
      <EmptyState
        icon={Database}
        title="No Datasets Yet"
        description="Upload your first dataset to get started with analysis."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {datasets.map((dataset) => (
        <Card key={dataset.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg truncate">{dataset.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <FileText className="w-3 h-3" />
                  {dataset.original_filename}
                </CardDescription>
              </div>
              <Badge variant="outline" className="ml-2">
                {dataset.mime_type?.split('/')[1]?.toUpperCase() || 'DATA'}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(dataset.created_at)}
                </div>
                <span>{formatFileSize(dataset.file_size)}</span>
              </div>
              
              {dataset.summary && (
                <div className="text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Rows:</span>
                    <span className="font-medium">{dataset.summary.totalRows?.toLocaleString() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Columns:</span>
                    <span className="font-medium">{dataset.summary.totalColumns || 'N/A'}</span>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 pt-2">
                {onDatasetSelect && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => onDatasetSelect(dataset)}
                  >
                    Analyze
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExport(dataset)}
                >
                  <Download className="w-3 h-3" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => deleteDataset(dataset.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DatasetLibrary;
