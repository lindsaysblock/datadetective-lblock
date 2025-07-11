
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle, Upload, Plus } from 'lucide-react';
import FileUploadSection from '@/components/data/upload/FileUploadSection';

interface DataSourceStepProps {
  file: File | null;
  uploading: boolean;
  parsing: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const DataSourceStep: React.FC<DataSourceStepProps> = ({
  file,
  uploading,
  parsing,
  onFileChange,
  onFileUpload,
  onNext,
  onPrevious
}) => {
  const hasUploadedFile = file && !uploading && !parsing;

  const handleAddAdditionalSource = () => {
    // Create a new file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv,.json,.txt,.xlsx';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (e) => {
      const selectedFile = (e.target as HTMLInputElement).files?.[0];
      if (selectedFile) {
        // Create a mock event to trigger the file change handler
        const mockEvent = {
          target: { files: [selectedFile] as FileList, value: '' } as HTMLInputElement,
          currentTarget: {} as HTMLInputElement,
          preventDefault: () => {},
          stopPropagation: () => {},
          nativeEvent: new Event('change'),
          isDefaultPrevented: () => false,
          isPropagationStopped: () => false,
          persist: () => {},
          bubbles: false,
          cancelable: false,
          defaultPrevented: false,
          eventPhase: 0,
          isTrusted: false,
          timeStamp: Date.now(),
          type: 'change'
        } as React.ChangeEvent<HTMLInputElement>;
        
        onFileChange(mockEvent);
      }
    };
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  return (
    <Card className="w-full shadow-sm border-0 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-1 ${
            hasUploadedFile 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
          }`}>
            {hasUploadedFile ? <CheckCircle className="w-4 h-4" /> : '2'}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Connect Your Data</h3>
            <p className="text-gray-500 text-sm mt-1">Upload a file or connect to your data source</p>
          </div>
        </div>

        {hasUploadedFile ? (
          <div className="space-y-4">
            {/* Success state */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="text-lg font-semibold text-green-800">Data Source Connected!</h4>
                  <p className="text-green-700">Your file "{file.name}" has been uploaded successfully.</p>
                </div>
              </div>
            </div>

            {/* Add additional source CTA */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50/50">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-3">Want to add another data source?</p>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 bg-white hover:bg-gray-50"
                onClick={handleAddAdditionalSource}
              >
                <Plus className="w-4 h-4" />
                Add Additional Source
              </Button>
            </div>
          </div>
        ) : (
          <FileUploadSection
            file={file}
            uploading={uploading}
            parsing={parsing}
            onFileChange={onFileChange}
            onFileUpload={onFileUpload}
          />
        )}

        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2 bg-white hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          <Button 
            onClick={onNext}
            disabled={!hasUploadedFile}
            className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 flex items-center gap-2"
          >
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSourceStep;
