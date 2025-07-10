
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Database } from 'lucide-react';
import { File as FileIcon } from 'lucide-react';

interface FileUploadSectionProps {
  file: File | null;
  uploading: boolean;
  parsing: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  file,
  uploading,
  parsing,
  onFileChange,
  onFileUpload
}) => {
  const handlePasteData = () => {
    const textData = prompt('Paste your data here (CSV format):');
    if (textData) {
      const textBlob = new Blob([textData], { type: 'text/plain' });
      const textFile = new window.File([textBlob], 'pasted-data.csv', { type: 'text/csv' });
      
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(textFile);
      
      const mockEvent = {
        target: {
          files: dataTransfer.files,
          value: '',
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
    }
  };

  const handleConnectDataSource = () => {
    alert('Data source connection coming soon! For now, please upload a file or paste your data.');
  };

  return (
    <div className="space-y-4">
      <Input
        type="file"
        id="upload"
        className="hidden"
        onChange={onFileChange}
        accept=".csv,.json,.txt"
      />
      
      {!file ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Option 1: Upload File */}
          <Label 
            htmlFor="upload" 
            className="cursor-pointer bg-blue-100 text-blue-700 rounded-md py-4 px-6 hover:bg-blue-200 transition-colors duration-200 flex flex-col items-center gap-2 text-sm font-medium border-2 border-dashed border-blue-300"
          >
            <Upload className="w-6 h-6" />
            <span className="text-center">
              <div className="font-semibold">Upload File</div>
              <div className="text-xs text-blue-600">CSV, JSON, or TXT</div>
            </span>
          </Label>

          {/* Option 2: Paste Data */}
          <Button
            variant="outline"
            onClick={handlePasteData}
            className="h-auto py-4 px-6 flex flex-col items-center gap-2 border-2 border-dashed border-green-300 bg-green-50 hover:bg-green-100 text-green-700"
          >
            <FileText className="w-6 h-6" />
            <span className="text-center">
              <div className="font-semibold">Paste Data</div>
              <div className="text-xs">Copy & paste your data</div>
            </span>
          </Button>

          {/* Option 3: Connect Data Source */}
          <Button
            variant="outline"
            onClick={handleConnectDataSource}
            className="h-auto py-4 px-6 flex flex-col items-center gap-2 border-2 border-dashed border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-700"
          >
            <Database className="w-6 h-6" />
            <span className="text-center">
              <div className="font-semibold">Connect Source</div>
              <div className="text-xs">Database or API</div>
            </span>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-md py-2 px-3">
            <FileIcon className="w-4 h-4" />
            <span className="truncate max-w-xs">{file.name}</span>
          </div>
          <Button 
            onClick={onFileUpload} 
            disabled={uploading || parsing}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {uploading || parsing ? 'Processing...' : 'Upload'}
          </Button>
        </div>
      )}

      {parsing && (
        <div className="text-blue-600 flex items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
          Parsing data...
        </div>
      )}
    </div>
  );
};

export default FileUploadSection;
