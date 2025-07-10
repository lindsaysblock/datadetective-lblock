
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Plus, CheckCircle, Upload } from 'lucide-react';
import FileUploadSection from '@/components/data/upload/FileUploadSection';

interface DataSourceStepProps {
  file: File | null;
  uploading: boolean;
  parsing: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const DataSourceStep: React.FC<DataSourceStepProps> = ({
  file,
  uploading,
  parsing,
  onFileChange,
  onFileUpload,
  onPrevious,
  onNext
}) => {
  const hasUploadedFile = file && !uploading && !parsing;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
            2
          </div>
          <Plus className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Data Source</h3>
        </div>

        {hasUploadedFile ? (
          <div className="space-y-4">
            {/* Success state */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h4 className="text-lg font-semibold text-green-800">Data Source Connected!</h4>
                  <p className="text-green-700">Your file "{file.name}" has been uploaded successfully.</p>
                </div>
              </div>
            </div>

            {/* Add additional source CTA */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-3">Want to add another data source?</p>
              <Button variant="outline" className="flex items-center gap-2">
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

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={onPrevious}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button onClick={onNext} disabled={!hasUploadedFile}>
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSourceStep;
