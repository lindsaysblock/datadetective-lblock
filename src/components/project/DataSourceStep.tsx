
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Upload, Database, FileText, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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

  const handleNext = () => {
    if (!hasUploadedData) {
      return;
    }
    onNext();
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(event);
    // Auto-upload after file selection
    if (event.target.files && event.target.files.length > 0) {
      setTimeout(() => {
        onFileUpload();
      }, 100);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 2: Connect Your Data</h2>
        <p className="text-gray-600">Upload your business data to start generating insights</p>
      </div>

      {!hasUploadedData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* File Upload Option */}
          <Card className="relative border-2 border-dashed border-blue-300 hover:border-blue-400 transition-colors cursor-pointer group">
            <CardHeader className="text-center">
              <Upload className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <CardTitle className="text-lg">Upload Files</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                CSV, Excel, or JSON files up to 100MB
              </p>
              <input
                type="file"
                accept=".csv,.xlsx,.xls,.json"
                multiple
                onChange={handleFileInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading || parsing}
              />
              <Button 
                variant="outline" 
                className="pointer-events-none"
                disabled={uploading || parsing}
              >
                {uploading || parsing ? 'Processing...' : 'Choose Files'}
              </Button>
            </CardContent>
          </Card>

          {/* Database Connection */}
          <Card className="border-gray-200 opacity-50">
            <CardHeader className="text-center">
              <Database className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <CardTitle className="text-lg text-gray-500">Database</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-400 mb-4">
                Connect to your database directly
              </p>
              <Button variant="outline" disabled className="opacity-50">
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          {/* API Integration */}
          <Card className="border-gray-200 opacity-50">
            <CardHeader className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <CardTitle className="text-lg text-gray-500">API</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-400 mb-4">
                Connect via REST API or webhooks
              </p>
              <Button variant="outline" disabled className="opacity-50">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <FileText className="w-5 h-5" />
              Data Connected Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-green-700 mb-4">
                {parsedData.length} data source{parsedData.length > 1 ? 's' : ''} ready for analysis
              </p>
            </div>
            
            {parsedData.map((data, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">
                    {data.name || files[index]?.name || `Dataset ${index + 1}`}
                  </span>
                  <span className="text-xs text-green-600">
                    ({data.summary?.totalRows || data.rows?.length || 0} rows × {data.summary?.totalColumns || data.columns?.length || 0} columns)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFile(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>
            ))}

            <div className="pt-2 border-t border-green-200">
              <Button
                variant="outline"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = '.csv,.xlsx,.xls,.json';
                  input.multiple = true;
                  input.onchange = (e) => handleFileInputChange(e as any);
                  input.click();
                }}
                className="flex items-center gap-2 text-green-700 border-green-300 hover:bg-green-100"
              >
                <Upload className="w-4 h-4" />
                Add More Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing State */}
      {(uploading || parsing) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-700 font-medium">
              {uploading ? 'Uploading your data...' : 'Processing and analyzing...'}
            </p>
            <p className="text-blue-600 text-sm mt-2">
              This may take a few moments depending on your file size
            </p>
          </CardContent>
        </Card>
      )}

      {/* Help Text */}
      {!hasUploadedData && files.length === 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800 text-sm">
            <strong>Need help?</strong> Upload CSV, Excel, or JSON files containing your business data. 
            Our AI will automatically detect data types and suggest the best analysis approaches.
          </p>
        </div>
      )}

      <div className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          onClick={onPrevious}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button 
          onClick={handleNext}
          disabled={!hasUploadedData}
          className={hasUploadedData ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"}
        >
          {hasUploadedData ? 'Next: Add Context' : 'Upload Data to Continue'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default DataSourceStep;
