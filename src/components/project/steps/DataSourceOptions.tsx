
import React, { useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Database } from 'lucide-react';
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Upload File Card */}
      <Card 
        className="border-2 border-dashed border-blue-300 bg-blue-50/30 hover:bg-blue-50/50 transition-colors cursor-pointer"
        onClick={handleFileSelect}
      >
        <CardContent className="p-8 text-center">
          <div 
            {...getRootProps()}
            className={`transition-colors ${isDragActive ? 'bg-blue-100/50' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Upload File</h3>
            <p className="text-blue-600 text-sm">
              CSV, JSON, or TXT
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Paste Data Card */}
      <Card 
        className="border-2 border-dashed border-green-300 bg-green-50/30 hover:bg-green-50/50 transition-colors cursor-pointer"
        onClick={handlePasteData}
      >
        <CardContent className="p-8 text-center">
          <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">Paste Data</h3>
          <p className="text-green-600 text-sm">
            Copy & paste your data
          </p>
        </CardContent>
      </Card>

      {/* Connect Source Card */}
      <Card 
        className="border-2 border-dashed border-purple-300 bg-purple-50/30 hover:bg-purple-50/50 transition-colors cursor-pointer"
        onClick={handleDatabaseConnect}
      >
        <CardContent className="p-8 text-center">
          <Database className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-purple-800 mb-2">Connect Source</h3>
          <p className="text-purple-600 text-sm">
            Database or API
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataSourceOptions;
