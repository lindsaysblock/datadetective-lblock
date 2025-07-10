
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface FileUploadSectionProps {
  file: File | null;
  uploading: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  file,
  uploading,
  onFileChange,
  onFileUpload
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Step 1: Upload Your Data</h3>
          <p className="text-gray-600 mb-4">
            Choose a CSV file or paste your data directly
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".csv,.txt,.json"
                  onChange={onFileChange}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-purple-400 transition-colors">
                  <FileText className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to browse files or drag and drop
                  </p>
                </div>
              </label>
            </div>
            
            {file && (
              <div className="bg-green-50 p-3 rounded border">
                <p className="text-sm text-green-700">
                  Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              </div>
            )}
            
            <Button 
              onClick={onFileUpload}
              disabled={!file || uploading}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Process Data
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploadSection;
