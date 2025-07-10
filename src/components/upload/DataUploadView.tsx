
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import FeatureCard from './FeatureCard';
import ErrorDisplay from './ErrorDisplay';
import SuccessDisplay from './SuccessDisplay';
import { ParsedData } from '@/utils/dataParser';

interface DataUploadViewProps {
  onStartUpload: () => void;
  uploadError?: string;
  onClearError: () => void;
  parsedData?: ParsedData;
}

const DataUploadView: React.FC<DataUploadViewProps> = ({
  onStartUpload,
  uploadError,
  onClearError,
  parsedData
}) => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">
          Upload Your Data
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Start by uploading your dataset to begin analysis. We support CSV, JSON, and Excel files.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
        <FeatureCard
          icon={Upload}
          title="Upload Data"
          description="Drag and drop or select files to upload your dataset"
        />
        <FeatureCard
          icon={Upload}
          title="Process"
          description="Automatically parse and validate your data structure"
        />
        <FeatureCard
          icon={Upload}
          title="Analyze"
          description="Generate insights and visualizations from your data"
        />
      </div>

      <div className="text-center">
        <Button 
          onClick={onStartUpload}
          size="lg"
          className="px-8"
        >
          <Upload className="w-5 h-5 mr-2" />
          Start Upload Process
        </Button>
      </div>

      <ErrorDisplay error={uploadError} onClear={onClearError} />
      <SuccessDisplay data={parsedData} />
    </div>
  );
};

export default DataUploadView;
