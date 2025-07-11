
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, Upload, FileText } from 'lucide-react';
import FileUploadSection from './steps/FileUploadSection';
import ColumnIdentificationStep, { ColumnMapping } from '../data/ColumnIdentificationStep';

interface DataSourceStepProps {
  files: File[];
  uploading: boolean;
  parsing: boolean;
  parsedData: any[];
  columnMapping?: ColumnMapping;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => void;
  onRemoveFile: (index: number) => void;
  onColumnMapping: (mapping: ColumnMapping) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const DataSourceStep: React.FC<DataSourceStepProps> = ({
  files,
  uploading,
  parsing,
  parsedData,
  columnMapping,
  onFileChange,
  onFileUpload,
  onRemoveFile,
  onColumnMapping,
  onNext,
  onPrevious
}) => {
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const hasUploadedData = parsedData && parsedData.length > 0;
  const hasColumnMapping = columnMapping && (
    columnMapping.userIdColumn || 
    columnMapping.timestampColumn || 
    columnMapping.eventColumn || 
    columnMapping.valueColumns?.length > 0 || 
    columnMapping.categoryColumns?.length > 0
  );

  const handleFileUploadComplete = () => {
    if (hasUploadedData) {
      setCurrentSubStep(2);
    }
  };

  const handleColumnMappingComplete = (mapping: ColumnMapping) => {
    onColumnMapping(mapping);
  };

  const handleNextStep = () => {
    if (currentSubStep === 1 && hasUploadedData) {
      setCurrentSubStep(2);
    } else if (currentSubStep === 2 && hasColumnMapping) {
      onNext();
    } else if (currentSubStep === 1 && !hasUploadedData) {
      // Skip column mapping if no data uploaded
      onNext();
    }
  };

  const handlePreviousStep = () => {
    if (currentSubStep === 2) {
      setCurrentSubStep(1);
    } else {
      onPrevious();
    }
  };

  const renderCurrentSubStep = () => {
    if (currentSubStep === 1) {
      return (
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
              onUploadComplete={handleFileUploadComplete}
            />
          </CardContent>
        </Card>
      );
    }

    if (currentSubStep === 2 && hasUploadedData) {
      return (
        <ColumnIdentificationStep
          parsedData={parsedData}
          onColumnMappingComplete={handleColumnMappingComplete}
          onNext={() => setCurrentSubStep(3)}
          onPrevious={() => setCurrentSubStep(1)}
        />
      );
    }

    return null;
  };

  const getStepTitle = () => {
    if (currentSubStep === 1) {
      return "Step 2.1: Upload Your Data";
    }
    if (currentSubStep === 2) {
      return "Step 2.2: Understand Your Data";
    }
    return "Step 2: Data Source";
  };

  const canProceed = () => {
    if (currentSubStep === 1) {
      return hasUploadedData || files.length === 0; // Can proceed with or without data
    }
    if (currentSubStep === 2) {
      return hasColumnMapping; // Need column mapping to proceed
    }
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{getStepTitle()}</h2>
        {currentSubStep === 1 && (
          <p className="text-gray-600">Upload your data files or connect to a database</p>
        )}
        {currentSubStep === 2 && (
          <p className="text-gray-600">Help us understand what your data represents</p>
        )}
      </div>

      {/* Progress indicator for sub-steps */}
      {hasUploadedData && (
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentSubStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              <Upload className="w-4 h-4" />
            </div>
            <div className={`w-8 h-0.5 ${
              currentSubStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentSubStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              <FileText className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {renderCurrentSubStep()}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          onClick={handlePreviousStep}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentSubStep === 1 ? 'Previous' : 'Back to Upload'}
        </Button>
        
        <Button 
          onClick={handleNextStep}
          disabled={!canProceed()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {currentSubStep === 2 || !hasUploadedData ? 'Next Step' : 'Configure Data'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Summary */}
      {(hasUploadedData || hasColumnMapping) && (
        <Card className="bg-gray-50 border-gray-200 mt-6">
          <CardContent className="pt-6">
            <h4 className="font-medium text-gray-900 mb-3">Data Summary:</h4>
            <div className="space-y-1 text-sm">
              {hasUploadedData && (
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-600" />
                  <span><strong>Files:</strong> {parsedData.length} uploaded</span>
                </div>
              )}
              {hasColumnMapping && (
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span><strong>Mapping:</strong> Data structure configured</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataSourceStep;
