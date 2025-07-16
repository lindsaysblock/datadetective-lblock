
import React, { useCallback, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Database, ArrowLeft } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { getDropzoneAccept } from '@/utils/fileValidation';

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
  const [showConnectOptions, setShowConnectOptions] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: getDropzoneAccept(),
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

  const handleConnectSourceClick = () => {
    setShowConnectOptions(true);
  };

  const handleBackToMain = () => {
    setShowConnectOptions(false);
  };

  const handlePlatformConnect = (platform: string) => {
    const config = {
      apiKey: 'demo-key',
      projectId: 'demo-project'
    };
    onPlatformConnect(platform, config);
  };

  const handleDatabaseConnect = () => {
    const config = {
      type: 'postgres',
      host: 'localhost',
      database: 'sample_db',
      username: 'user',
      password: 'password'
    };
    onDatabaseConnect(config);
  };

  if (showConnectOptions) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToMain}
            className="text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <h3 className="text-lg font-semibold text-gray-900">Connect Data Source</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Database Connections */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleDatabaseConnect}>
            <CardContent className="p-4 text-center">
              <Database className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">PostgreSQL</h4>
              <p className="text-sm text-gray-600">Connect to PostgreSQL database</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleDatabaseConnect}>
            <CardContent className="p-4 text-center">
              <Database className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">MySQL</h4>
              <p className="text-sm text-gray-600">Connect to MySQL database</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={handleDatabaseConnect}>
            <CardContent className="p-4 text-center">
              <Database className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium text-gray-900 mb-1">MongoDB</h4>
              <p className="text-sm text-gray-600">Connect to MongoDB database</p>
            </CardContent>
          </Card>

          {/* Analytics Platforms */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handlePlatformConnect('amplitude')}>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-blue-500 rounded mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold">A</div>
              <h4 className="font-medium text-gray-900 mb-1">Amplitude</h4>
              <p className="text-sm text-gray-600">Product analytics platform</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handlePlatformConnect('looker')}>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-orange-500 rounded mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold">L</div>
              <h4 className="font-medium text-gray-900 mb-1">Looker</h4>
              <p className="text-sm text-gray-600">Business intelligence platform</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handlePlatformConnect('powerbi')}>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-yellow-500 rounded mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold">P</div>
              <h4 className="font-medium text-gray-900 mb-1">Power BI</h4>
              <p className="text-sm text-gray-600">Microsoft analytics platform</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handlePlatformConnect('tableau')}>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-blue-600 rounded mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold">T</div>
              <h4 className="font-medium text-gray-900 mb-1">Tableau</h4>
              <p className="text-sm text-gray-600">Data visualization platform</p>
            </CardContent>
          </Card>

          {/* Cloud Data Warehouses */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handlePlatformConnect('snowflake')}>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-cyan-500 rounded mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold">S</div>
              <h4 className="font-medium text-gray-900 mb-1">Snowflake</h4>
              <p className="text-sm text-gray-600">Cloud data warehouse</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handlePlatformConnect('bigquery')}>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-red-500 rounded mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold">B</div>
              <h4 className="font-medium text-gray-900 mb-1">BigQuery</h4>
              <p className="text-sm text-gray-600">Google Cloud data warehouse</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
        onClick={handleConnectSourceClick}
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
