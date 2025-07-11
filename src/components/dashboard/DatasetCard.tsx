
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Download } from 'lucide-react';
import { BehavioralDataset } from '../../utils/behavioralDataGenerator';

interface DatasetCardProps {
  dataset: BehavioralDataset | null;
  isGenerating: boolean;
  onGenerate: () => void;
  onDownload: () => void;
}

const DatasetCard: React.FC<DatasetCardProps> = ({
  dataset,
  isGenerating,
  onGenerate,
  onDownload
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Behavioral Dataset
        </CardTitle>
        <CardDescription>
          Large-scale behavioral dataset with user activities, sessions, and conversions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            {dataset ? (
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  <strong>{dataset.users.length}</strong> users • <strong>{dataset.events.length}</strong> events • <strong>{dataset.sessions.length}</strong> sessions
                </p>
                <p className="text-xs text-gray-500">
                  Date range: {new Date(dataset.metadata.dateRange.start).toLocaleDateString()} - {new Date(dataset.metadata.dateRange.end).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No dataset generated yet</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onGenerate}
              disabled={isGenerating}
              variant="outline"
            >
              {isGenerating ? 'Generating...' : 'Generate New Dataset'}
            </Button>
            {dataset && (
              <Button onClick={onDownload} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatasetCard;
