
import { useToast } from '@/hooks/use-toast';
import { DataConnectors } from '@/utils/dataConnectors';
import { parseFile } from '@/utils/dataParser';

export const useDataSourceHandlers = (
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onFileUpload: () => void,
  setShowAddSource: (show: boolean) => void
) => {
  const { toast } = useToast();

  const handleFileUpload = async (uploadedFiles: File[]) => {
    console.log('handleFileUpload called with files:', uploadedFiles);
    
    if (uploadedFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      });
      return;
    }

    try {
      const processedData = [];
      
      for (const file of uploadedFiles) {
        console.log('Processing file:', file.name);
        const parsed = await parseFile(file);
        console.log('File parsed successfully:', parsed);
        
        const formattedData = {
          id: Date.now() + Math.random(),
          name: file.name,
          rows: parsed.rowCount,
          columns: parsed.columns.length,
          data: parsed.rows,
          preview: parsed.rows.slice(0, 5),
          summary: parsed.summary
        };
        
        processedData.push(formattedData);
      }

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
      
      setTimeout(() => {
        console.log('Triggering file upload');
        onFileUpload();
      }, 100);
      
      toast({
        title: "Files Processed",
        description: `Successfully processed ${processedData.length} file(s).`,
      });
      
      setShowAddSource(false);
      
    } catch (error) {
      console.error('Error processing files:', error);
      toast({
        title: "Processing Failed",
        description: `Failed to process files: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const handleDataPaste = async (data: string) => {
    try {
      const parsed = await DataConnectors.processPastedData(data);
      console.log('Pasted data processed:', parsed);
      
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

  return {
    handleFileUpload,
    handleDataPaste,
    handleDatabaseConnect,
    handlePlatformConnect
  };
};
