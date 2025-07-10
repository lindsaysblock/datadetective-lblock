
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, FileText } from 'lucide-react';
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
  return (
    <div className="space-y-6">
      {/* Step 1: Data Status */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-3 h-3 rounded-full ${parsedData ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          <h3 className="font-medium">Step 1: Your Data</h3>
        </div>
        {parsedData ? (
          <div className="flex items-center gap-2 text-sm text-green-700">
            <FileText className="w-4 h-4" />
            <span>Loaded: {file?.name} ({parsedData.rows?.length || 0} rows, {parsedData.columns?.length || 0} columns)</span>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">No data loaded. Upload a file to get started.</p>
            <FileUploadSection
              file={file}
              uploading={uploading}
              parsing={parsing}
              onFileChange={onFileChange}
              onFileUpload={onFileUpload}
            />
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
