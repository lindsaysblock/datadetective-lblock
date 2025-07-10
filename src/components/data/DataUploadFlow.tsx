
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, FileText, Upload, Database, Type } from 'lucide-react';
import FileUploadSection from './FileUploadSection';
import { useToast } from '@/hooks/use-toast';

interface DataUploadFlowProps {
  file: File | null;
  uploading: boolean;
  parsing: boolean;
  parsedData: any;
  researchQuestion: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => void;
  onResearchQuestionChange: (value: string) => void;
  onStartAnalysis: () => void;
  onSaveDataset: () => void;
}

const DataUploadFlow: React.FC<DataUploadFlowProps> = ({
  file,
  uploading,
  parsing,
  parsedData,
  researchQuestion,
  onFileChange,
  onFileUpload,
  onResearchQuestionChange,
  onStartAnalysis,
  onSaveDataset
}) => {
  const [activeUploadMethod, setActiveUploadMethod] = useState<'file' | 'connect' | 'text'>('file');
  const [textData, setTextData] = useState('');
  const { toast } = useToast();

  const handleTextDataUpload = () => {
    if (!textData.trim()) {
      toast({
        title: "No Data",
        description: "Please paste some text data to analyze.",
        variant: "destructive",
      });
      return;
    }
    
    // Create a mock file-like object for text data
    const textBlob = new Blob([textData], { type: 'text/plain' });
    const textFile = new File([textBlob], 'pasted-data.txt', { type: 'text/plain' });
    
    // Trigger the file change handler with our text file
    const fakeEvent = {
      target: { files: [textFile] }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onFileChange(fakeEvent);
  };

  return (
    <div className="space-y-6">
      {/* Step 1: Data Upload Options */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-3 h-3 rounded-full ${parsedData ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <h3 className="font-medium">Step 1: Add Your Data</h3>
        </div>

        {parsedData ? (
          <div className="flex items-center gap-2 text-sm text-green-700">
            <FileText className="w-4 h-4" />
            <span>Loaded: {file?.name} ({parsedData.rows?.length || 0} rows, {parsedData.columns?.length || 0} columns)</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Upload Method Selection */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={activeUploadMethod === 'file' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveUploadMethod('file')}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Choose File
              </Button>
              <Button
                variant={activeUploadMethod === 'connect' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveUploadMethod('connect')}
                className="flex items-center gap-2"
              >
                <Database className="w-4 h-4" />
                Connect Source
              </Button>
              <Button
                variant={activeUploadMethod === 'text' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveUploadMethod('text')}
                className="flex items-center gap-2"
              >
                <Type className="w-4 h-4" />
                Paste Text
              </Button>
            </div>

            {/* Upload Method Content */}
            {activeUploadMethod === 'file' && (
              <FileUploadSection
                file={file}
                uploading={uploading}
                parsing={parsing}
                onFileChange={onFileChange}
                onFileUpload={onFileUpload}
              />
            )}

            {activeUploadMethod === 'connect' && (
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">Connect to external data sources</p>
                <p className="text-sm text-gray-500">Coming soon: Database connections, APIs, and more</p>
              </div>
            )}

            {activeUploadMethod === 'text' && (
              <div className="space-y-3">
                <label htmlFor="textData" className="text-sm font-medium text-gray-700">
                  Paste your data below (CSV, JSON, or structured text)
                </label>
                <Textarea
                  id="textData"
                  placeholder="Paste your CSV data, JSON, or any structured text here..."
                  value={textData}
                  onChange={(e) => setTextData(e.target.value)}
                  className="min-h-32"
                />
                <Button 
                  onClick={handleTextDataUpload}
                  disabled={!textData.trim() || uploading || parsing}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploading || parsing ? 'Processing...' : 'Process Text Data'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Step 2: Research Question */}
      <ResearchQuestionSection 
        researchQuestion={researchQuestion}
        onResearchQuestionChange={onResearchQuestionChange}
      />

      {/* Action Buttons */}
      {parsedData && (
        <DataActionButtons 
          researchQuestion={researchQuestion}
          onSaveDataset={onSaveDataset}
          onStartAnalysis={onStartAnalysis}
        />
      )}
    </div>
  );
};

const ResearchQuestionSection: React.FC<{
  researchQuestion: string;
  onResearchQuestionChange: (value: string) => void;
}> = ({ researchQuestion, onResearchQuestionChange }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <div className="flex items-center gap-3 mb-2">
      <div className={`w-3 h-3 rounded-full ${researchQuestion.trim() ? 'bg-green-500' : 'bg-gray-300'}`}></div>
      <h3 className="font-medium">Step 2: What do you want to discover?</h3>
    </div>
    <div className="space-y-3">
      <label htmlFor="researchQuestion" className="text-sm text-gray-700">
        Describe your research question or what you want to analyze
      </label>
      <input
        id="researchQuestion"
        placeholder="e.g., What factors influence customer satisfaction? Are there any sales trends over time?"
        value={researchQuestion}
        onChange={(e) => onResearchQuestionChange(e.target.value)}
        className="w-full text-sm p-2 border rounded"
      />
    </div>
  </div>
);

const DataActionButtons: React.FC<{
  researchQuestion: string;
  onSaveDataset: () => void;
  onStartAnalysis: () => void;
}> = ({ researchQuestion, onSaveDataset, onStartAnalysis }) => (
  <div className="flex justify-between items-center pt-4 border-t">
    <Button 
      onClick={onSaveDataset}
      variant="outline"
      className="flex items-center gap-2"
    >
      Save Dataset
    </Button>
    
    <Button 
      onClick={onStartAnalysis}
      disabled={!researchQuestion.trim()}
      className="flex items-center gap-2"
    >
      <CheckCircle2 className="w-4 h-4" />
      Start Analysis
    </Button>
  </div>
);

export default DataUploadFlow;
