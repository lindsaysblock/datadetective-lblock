/**
 * Quick Form Step Components for Testing
 * Minimal implementations to get the form working
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Upload, FileText } from 'lucide-react';
import { SPACING, FORM_STEPS } from '@/constants/ui';

// Research Question Step
interface ResearchQuestionStepProps {
  researchQuestion: string;
  setResearchQuestion: (value: string) => void;
  onNext: () => void;
}

export const ResearchQuestionStep: React.FC<ResearchQuestionStepProps> = ({
  researchQuestion,
  setResearchQuestion,
  onNext
}) => {
  return (
    <div className={`space-y-${SPACING.LG}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">What do you want to investigate?</h2>
        <p className="text-gray-600">Start by defining your research question or hypothesis</p>
      </div>
      
      <div className={`space-y-${SPACING.MD}`}>
        <Label htmlFor="research-question">Research Question</Label>
        <Textarea
          id="research-question"
          placeholder="e.g., What factors influence customer churn rates?"
          value={researchQuestion}
          onChange={(e) => setResearchQuestion(e.target.value)}
          className="min-h-24"
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={onNext}
          disabled={!researchQuestion?.trim()}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

// Data Source Step
interface DataSourceStepProps {
  files: File[];
  uploading: boolean;
  parsing: boolean;
  parsedData: any[];
  processedFiles: any[];
  columnMapping: Record<string, string>;
  onFileChange: (file: File) => void;
  onFileUpload: () => void;
  onRemoveFile: (index: number) => void;
  onColumnMapping: (mapping: Record<string, string>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const DataSourceStep: React.FC<DataSourceStepProps> = ({
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
  return (
    <div className={`space-y-${SPACING.LG}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Your Data</h2>
        <p className="text-gray-600">Provide the evidence for your investigation</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            File Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`space-y-${SPACING.MD}`}>
            <input
              type="file"
              multiple
              accept=".csv,.json,.xlsx"
              onChange={(e) => {
                if (e.target.files) {
                  Array.from(e.target.files).forEach(file => onFileChange(file));
                }
              }}
              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg"
            />
            
            {files.length > 0 && (
              <div className={`space-y-${SPACING.SM}`}>
                <h4 className="font-medium">Selected Files:</h4>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {file.name}
                    </span>
                    <Button size="sm" variant="outline" onClick={() => onRemoveFile(index)}>
                      Remove
                    </Button>
                  </div>
                ))}
                
                <Button onClick={onFileUpload} disabled={uploading || parsing}>
                  {uploading || parsing ? 'Processing...' : 'Upload Files'}
                </Button>
              </div>
            )}
            
            {parsedData.length > 0 && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <p className="text-green-800 font-medium">
                  ✅ {parsedData.length} file(s) processed successfully
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <Button 
          onClick={onNext}
          disabled={parsedData.length === 0}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

// Business Context Step
interface BusinessContextStepProps {
  additionalContext: string;
  setAdditionalContext: (value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const BusinessContextStep: React.FC<BusinessContextStepProps> = ({
  additionalContext,
  setAdditionalContext,
  onNext,
  onPrevious
}) => {
  return (
    <div className={`space-y-${SPACING.LG}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Business Context</h2>
        <p className="text-gray-600">Provide additional context to improve analysis quality</p>
      </div>
      
      <div className={`space-y-${SPACING.MD}`}>
        <Label htmlFor="business-context">Additional Context (Optional)</Label>
        <Textarea
          id="business-context"
          placeholder="e.g., We're a SaaS company looking to reduce churn in our enterprise segment..."
          value={additionalContext}
          onChange={(e) => setAdditionalContext(e.target.value)}
          className="min-h-32"
        />
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <Button 
          onClick={onNext}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};