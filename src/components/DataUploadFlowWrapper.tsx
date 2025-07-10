
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DataUploadFlow from './data/DataUploadFlow';
import { useDataUpload } from '@/hooks/useDataUpload';

const DataUploadFlowWrapper: React.FC = () => {
  const [showUploadFlow, setShowUploadFlow] = useState(false);
  const { toast } = useToast();
  const {
    file,
    uploading,
    uploadProgress,
    parsedData,
    uploadError,
    handleFileChange,
    handleFileUpload,
    researchQuestion,
    handleResearchQuestionChange,
    handleStartAnalysis,
    handleSaveDataset,
    resetUpload
  } = useDataUpload();

  const handleFileSelectWrapper = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      handleFileChange(selectedFile);
    }
  };

  const handleUploadClick = async () => {
    if (file) {
      try {
        await handleFileUpload(file);
        toast({
          title: "Upload Successful",
          description: "Your file has been processed successfully.",
        });
      } catch (error) {
        toast({
          title: "Upload Failed",
          description: "There was an error processing your file.",
          variant: "destructive",
        });
      }
    }
  };

  if (showUploadFlow) {
    return (
      <div className="min-h-screen bg-background">
        <DataUploadFlow 
          file={file}
          uploading={uploading}
          parsing={false}
          parsedData={parsedData}
          researchQuestion={researchQuestion}
          onFileChange={handleFileSelectWrapper}
          onFileUpload={handleUploadClick}
          onResearchQuestionChange={handleResearchQuestionChange}
          onStartAnalysis={handleStartAnalysis}
          onSaveDataset={handleSaveDataset}
        />
      </div>
    );
  }

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
        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <Upload className="w-12 h-12 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg">Upload Data</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Drag and drop or select files to upload your dataset
            </p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <FileText className="w-12 h-12 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg">Process</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Automatically parse and validate your data structure
            </p>
          </CardContent>
        </Card>

        <Card className="text-center hover:shadow-lg transition-shadow">
          <CardHeader>
            <BarChart3 className="w-12 h-12 mx-auto text-primary mb-2" />
            <CardTitle className="text-lg">Analyze</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Generate insights and visualizations from your data
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button 
          onClick={() => setShowUploadFlow(true)}
          size="lg"
          className="px-8"
        >
          <Upload className="w-5 h-5 mr-2" />
          Start Upload Process
        </Button>
      </div>

      {uploadError && (
        <div className="mt-4 text-center">
          <p className="text-destructive">{uploadError}</p>
          <Button onClick={resetUpload} variant="outline" className="mt-2">
            Clear Error
          </Button>
        </div>
      )}

      {parsedData && (
        <div className="mt-8 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Upload Complete</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Successfully processed {parsedData.summary.totalRows} rows and {parsedData.summary.totalColumns} columns
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DataUploadFlowWrapper;
