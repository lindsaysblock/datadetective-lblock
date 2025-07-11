
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import DataSourceOptions from './steps/DataSourceOptions';
import { DataConnectors } from '@/utils/dataConnectors';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const hasUploadedData = parsedData && parsedData.length > 0;

  const handleFileUpload = async (uploadedFiles: File[]) => {
    console.log('handleFileUpload called with files:', uploadedFiles);
    
    // Create a proper file input event
    const dataTransfer = new DataTransfer();
    uploadedFiles.forEach(file => dataTransfer.items.add(file));
    
    const mockEvent = {
      target: {
        files: dataTransfer.files,
        value: ''
      } as HTMLInputElement,
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
    
    // Wait a bit for the file to be processed, then trigger upload
    setTimeout(() => {
      console.log('Triggering file upload');
      onFileUpload();
    }, 100);
  };

  const handleDataPaste = async (data: string) => {
    try {
      const parsed = await DataConnectors.processPastedData(data);
      console.log('Pasted data processed:', parsed);
      
      // Convert to the expected format
      const formattedData = {
        id: Date.now(),
        name: 'Pasted Data',
        rows: parsed.rowCount,
        columns: parsed.columns.length,
        data: parsed.rows,
        preview: parsed.rows.slice(0, 5)
      };
      
      // Trigger the same flow as file upload
      const mockFiles = [new File([data], 'pasted-data.csv', { type: 'text/csv' })];
      handleFileUpload(mockFiles);
      
      toast({
        title: "Data Processed",
        description: "Your pasted data has been successfully processed.",
      });
    } catch (error) {
      console.error('Error processing pasted data:', error);
      toast({
        title: "Processing Failed",
        description: "Failed to process the pasted data. Please check the format.",
        variant: "destructive",
      });
    }
  };

  const handleDatabaseConnect = async (config: any) => {
    try {
      const parsed = await DataConnectors.connectDatabase(config);
      console.log('Database connected:', parsed);
      
      const formattedData = {
        id: Date.now(),
        name: `${config.type} Database`,
        rows: parsed.rowCount,
        columns: parsed.columns.length,
        data: parsed.rows,
        preview: parsed.rows.slice(0, 5)
      };
      
      // Mock the file upload process for database connections
      const mockFile = new File(['database'], 'database-connection', { type: 'application/json' });
      handleFileUpload([mockFile]);
      
      toast({
        title: "Database Connected",
        description: `Successfully connected to ${config.type} database.`,
      });
    } catch (error) {
      console.error('Database connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to the database. Please check your credentials.",
        variant: "destructive",
      });
    }
  };

  const handlePlatformConnect = async (platform: string, config: any) => {
    try {
      let parsed;
      
      switch (platform) {
        case 'amplitude':
          parsed = await DataConnectors.connectAmplitude(config);
          break;
        case 'looker':
          parsed = await DataConnectors.connectLooker(config);
          break;
        case 'powerbi':
          parsed = await DataConnectors.connectPowerBI(config);
          break;
        case 'tableau':
          parsed = await DataConnectors.connectTableau(config);
          break;
        case 'snowflake':
          parsed = await DataConnectors.connectSnowflake(config);
          break;
        case 'bigquery':
          parsed = await DataConnectors.connectBigQuery(config);
          break;
        default:
          throw new Error(`Platform ${platform} not supported`);
      }
      
      const formattedData = {
        id: Date.now(),
        name: platform.charAt(0).toUpperCase() + platform.slice(1),
        rows: parsed.rowCount,
        columns: parsed.columns.length,
        data: parsed.rows,
        preview: parsed.rows.slice(0, 5)
      };
      
      // Mock the file upload process for platform connections
      const mockFile = new File(['platform'], `${platform}-connection`, { type: 'application/json' });
      handleFileUpload([mockFile]);
      
      toast({
        title: "Platform Connected",
        description: `Successfully connected to ${platform}.`,
      });
    } catch (error) {
      console.error('Platform connection error:', error);
      toast({
        title: "Connection Failed",
        description: `Failed to connect to ${platform}. Please check your credentials.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 2: Upload Your Data</h2>
        <p className="text-gray-600">Upload your data files or connect to external sources</p>
      </div>

      {!hasUploadedData ? (
        <DataSourceOptions
          onFileUpload={handleFileUpload}
          onDataPaste={handleDataPaste}
          onDatabaseConnect={handleDatabaseConnect}
          onPlatformConnect={handlePlatformConnect}
        />
      ) : (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Data Connected Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop" 
                alt="Success" 
                className="w-32 h-24 object-cover rounded-lg mx-auto mb-4"
              />
              <p className="text-green-700 mb-4">
                {parsedData.length} data source{parsedData.length > 1 ? 's' : ''} connected and ready for analysis.
              </p>
            </div>
            
            {parsedData.map((data, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-100 rounded-lg mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-green-900">{data.name || `Dataset ${index + 1}`}</span>
                  <span className="text-xs text-green-600">
                    ({data.summary?.totalRows || data.rows || 0} rows × {data.summary?.totalColumns || data.columns || 0} columns)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFile(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          onClick={onPrevious}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button 
          onClick={onNext}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {hasUploadedData ? 'Next: Business Context' : 'Skip to Business Context'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default DataSourceStep;
