import React, { useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Database, Plus } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

interface DataSourceOptionsProps {
  onFileUpload: (files: File[]) => void;
  onDataPaste: (data: string) => void;
  onDatabaseConnect: (config: any) => void;
  onPlatformConnect: (platform: string, config: any) => void;
}

const DataSourceOptions: React.FC<DataSourceOptionsProps> = ({
  onFileUpload,
  onDataPaste,
  onDatabaseConnect,
  onPlatformConnect
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: true,
    noClick: true
  });

  const handleFileSelect = () => {
    open();
  };

  const handlePasteData = () => {
    const textData = prompt('Paste your data here (CSV format):');
    if (textData) {
      onDataPaste(textData);
    }
  };

  const handleDatabaseConnect = () => {
    // Mock database connection for demo
    const config = {
      type: 'postgres',
      host: 'localhost',
      database: 'sample_db',
      username: 'user',
      password: 'password'
    };
    onDatabaseConnect(config);
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <Card className="border-dashed border-2 border-blue-300 bg-blue-50/50">
        <CardContent className="p-6">
          <div 
            {...getRootProps()} 
            className={`text-center transition-colors ${
              isDragActive ? 'bg-blue-100' : ''
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Upload Files</h3>
            <p className="text-blue-600 mb-4">
              {isDragActive 
                ? 'Drop your files here...' 
                : 'Drag and drop files here, or click to select'
              }
            </p>
            <Button 
              onClick={handleFileSelect}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Choose Files
            </Button>
            <p className="text-xs text-blue-500 mt-2">
              Supports CSV, JSON, TXT, and Excel files
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Other Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handlePasteData}>
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Paste Data</h4>
            <p className="text-sm text-gray-600">Copy & paste your data directly</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleDatabaseConnect}>
          <CardContent className="p-4 text-center">
            <Database className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Connect Database</h4>
            <p className="text-sm text-gray-600">Connect to existing databases</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataSourceOptions;
