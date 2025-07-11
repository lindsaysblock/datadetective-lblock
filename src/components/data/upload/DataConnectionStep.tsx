
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import FileUploadSection from './FileUploadSection';

interface DataConnectionStepProps {
  file: File | null;
  uploading: boolean;
  parsing: boolean;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileUpload: () => void;
}

const DataConnectionStep: React.FC<DataConnectionStepProps> = ({
  file,
  uploading,
  parsing,
  onFileChange,
  onFileUpload
}) => {
  const handleFileChangeWithTextSupport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileChange(event);
      return;
    }

    const textData = prompt('Paste your data here:');
    if (textData) {
      const textBlob = new Blob([textData], { type: 'text/plain' });
      const textFile = new File([textBlob], 'pasted-data.txt', { type: 'text/plain' });
      
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(textFile);
      
      const mockEvent = {
        target: { files: dataTransfer.files, value: '' } as HTMLInputElement,
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

  return (
    <>
      <Separator />
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
            2
          </div>
          <Plus className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Connect Your Data</h3>
        </div>
        <FileUploadSection
          file={file}
          uploading={uploading}
          parsing={parsing}
          onFileChange={handleFileChangeWithTextSupport}
          onFileUpload={onFileUpload}
        />
      </div>
    </>
  );
};

export default DataConnectionStep;
