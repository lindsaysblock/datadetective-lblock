
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Upload } from 'lucide-react';
import FileUploadSection from './steps/FileUploadSection';

interface DataSourceStepProps {
  files: File[];
  uploading: boolean;
  parsing: boolean;
  parsedData: any[];
  columnMapping?: any;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => void;
  onRemoveFile: (index: number) => void;
  onColumnMapping: (mapping: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const DataSourceStep: React.FC<DataSourceStepProps> = ({
  files,
  uploading,
  parsing,
  parsedData,
  onFileChange,
  onFileUpload,
  onRemoveFile,
  onNext,
  onPrevious
}) => {
  const hasUploadedData = parsedData && parsedData.length > 0;

  const canProceed = () => {
    // Can proceed with or without data
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 2: Upload Your Data</h2>
        <p className="text-gray-600">Upload your data files or skip to continue without data</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Your Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploadSection
            files={files}
            uploading={uploading}
            parsing={parsing}
            parsedData={parsedData}
            onFileChange={onFileChange}
            onFileUpload={onFileUpload}
            onRemoveFile={onRemoveFile}
            onUploadComplete={() => {}}
          />
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          onClick={onPrevious}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button 
          onClick={onNext}
          disabled={!canProceed()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {hasUploadedData ? 'Next: Business Context' : 'Skip to Business Context'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Summary */}
      {hasUploadedData && (
        <Card className="bg-gray-50 border-gray-200 mt-6">
          <CardContent className="pt-6">
            <h4 className="font-medium text-gray-900 mb-3">Data Summary:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600" />
                <span><strong>Files:</strong> {parsedData.length} uploaded</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataSourceStep;
