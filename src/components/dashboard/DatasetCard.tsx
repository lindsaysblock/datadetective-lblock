
/**
 * Dataset Card Component
 * Refactored to meet coding standards with proper constants and semantic theming
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Download } from 'lucide-react';
import { BehavioralDataset } from '../../utils/behavioralDataGenerator';
import { SPACING } from '@/constants/ui';

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
    <Card className={`mb-${SPACING.XL}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-${SPACING.SM}`}>
          <BarChart3 className={`w-${SPACING.MD + 1} h-${SPACING.MD + 1}`} />
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
              <div className={`space-y-${SPACING.XS}`}>
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
          <div className={`flex gap-${SPACING.SM}`}>
            <Button
              onClick={onGenerate}
              disabled={isGenerating}
              variant="outline"
            >
              {isGenerating ? 'Generating...' : 'Generate New Dataset'}
            </Button>
            {dataset && (
              <Button onClick={onDownload} variant="outline">
                <Download className={`w-${SPACING.MD} h-${SPACING.MD} mr-${SPACING.SM}`} />
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
