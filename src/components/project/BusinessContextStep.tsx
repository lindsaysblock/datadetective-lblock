
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, FileText, Database } from 'lucide-react';
import ColumnIdentificationStep, { ColumnMapping } from '../data/ColumnIdentificationStep';

interface BusinessContextStepProps {
  additionalContext: string;
  setAdditionalContext: (value: string) => void;
  parsedData?: any[];
  columnMapping?: ColumnMapping;
  onColumnMapping?: (mapping: ColumnMapping) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const BusinessContextStep: React.FC<BusinessContextStepProps> = ({
  additionalContext,
  setAdditionalContext,
  parsedData,
  columnMapping,
  onColumnMapping,
  onNext,
  onPrevious
}) => {
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const hasUploadedData = parsedData && parsedData.length > 0;

  const handleColumnMappingComplete = (mapping: ColumnMapping) => {
    if (onColumnMapping) {
      onColumnMapping(mapping);
    }
  };

  const handleNextFromBusinessContext = () => {
    if (hasUploadedData) {
      setCurrentSubStep(2); // Go to column identification
    } else {
      onNext(); // Skip directly to analysis if no data
    }
  };

  const handleSkipToAnalysis = () => {
    onNext(); // Skip directly to analysis
  };

  const handlePreviousStep = () => {
    if (currentSubStep === 2) {
      setCurrentSubStep(1); // Go back to business context
    } else {
      onPrevious(); // Go back to previous main step
    }
  };

  const renderCurrentSubStep = () => {
    if (currentSubStep === 1) {
      // Step 3.1: Business Context (free text)
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 3.1: Business Context</h2>
            <p className="text-gray-600">Provide additional context about your analysis (optional)</p>
          </div>

          <Card className="w-full shadow-sm border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1">
                  3.1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Business Context</h3>
                  <p className="text-gray-500 text-sm mt-1">Help us understand your data better (optional)</p>
                </div>
              </div>
              
              <Textarea
                placeholder="e.g., This data comes from our e-commerce platform and includes customer purchase history from the last 6 months..."
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                className="min-h-[120px] resize-none text-base border-gray-300 mb-6 bg-white"
              />
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2 bg-white hover:bg-gray-50">
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    onClick={handleSkipToAnalysis}
                    className="bg-white hover:bg-gray-50"
                  >
                    Skip to Analysis
                  </Button>
                  <Button 
                    onClick={handleNextFromBusinessContext}
                    className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 flex items-center gap-2"
                  >
                    {hasUploadedData ? 'Next: Data Setup' : 'Continue'} <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (currentSubStep === 2 && hasUploadedData) {
      // Step 3.2: Column Identification
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 3.2: Understand Your Data</h2>
            <p className="text-gray-600">Help us understand what your data represents (optional)</p>
          </div>
          
          <ColumnIdentificationStep
            parsedData={parsedData}
            onColumnMappingComplete={handleColumnMappingComplete}
            onNext={onNext}
            onPrevious={() => setCurrentSubStep(1)}
          />
          
          {/* Skip to Analysis button */}
          <div className="flex justify-center pt-4">
            <Button 
              variant="outline"
              onClick={handleSkipToAnalysis}
              className="bg-white hover:bg-gray-50"
            >
              Skip to Analysis
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator for sub-steps */}
      {hasUploadedData && (
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentSubStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              <FileText className="w-4 h-4" />
            </div>
            <div className={`w-8 h-0.5 ${
              currentSubStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentSubStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              <Database className="w-4 h-4" />
            </div>
          </div>
        </div>
      )}

      {renderCurrentSubStep()}

      {/* Summary */}
      {(columnMapping || additionalContext.trim()) && (
        <Card className="bg-gray-50 border-gray-200 mt-6">
          <CardContent className="pt-6">
            <h4 className="font-medium text-gray-900 mb-3">Context Summary:</h4>
            <div className="space-y-1 text-sm">
              {additionalContext.trim() && (
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span><strong>Business Context:</strong> Provided</span>
                </div>
              )}
              {columnMapping && (
                columnMapping.userIdColumn || 
                columnMapping.timestampColumn || 
                columnMapping.eventColumn || 
                columnMapping.valueColumns?.length > 0 || 
                columnMapping.categoryColumns?.length > 0
              ) && (
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span><strong>Data Structure:</strong> Configured</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BusinessContextStep;
