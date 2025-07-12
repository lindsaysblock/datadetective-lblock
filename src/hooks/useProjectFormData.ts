
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { parseFile, type ParsedData } from '@/utils/dataParser';

export const useProjectFormData = () => {
  const [step, setStep] = useState(1);
  const [researchQuestion, setResearchQuestion] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [parsedData, setParsedData] = useState<ParsedData[]>([]);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const { toast } = useToast();

  const addFile = (file: File) => {
    console.log('Adding file:', file.name);
    setFiles(prev => {
      const exists = prev.some(f => f.name === file.name && f.size === file.size);
      if (exists) {
        toast({
          title: "File already added",
          description: `${file.name} is already in your project.`,
        });
        return prev;
      }
      return [...prev, file];
    });
  };

  const removeFile = (index: number) => {
    console.log('Removing file at index:', index);
    
    if (index < 0 || index >= files.length) {
      console.error('Invalid file index:', index);
      toast({
        title: "Error",
        description: "Invalid file index.",
        variant: "destructive",
      });
      return;
    }

    setFiles(prev => prev.filter((_, i) => i !== index));
    setParsedData(prev => prev.filter((_, i) => i !== index));

    toast({
      title: "File Removed",
      description: "The selected file has been removed from your project.",
    });
  };

  const handleFileUpload = async () => {
    console.log('handleFileUpload called with files:', files.length);
    
    if (files.length === 0) {
      console.log('No files to upload - files array is empty');
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      });
      return;
    }

    console.log('Starting file upload process for files:', files.map(f => f.name));
    setUploading(true);
    setParsing(true);

    try {
      const parsedResults: ParsedData[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`Processing file ${i + 1}/${files.length}:`, file.name);
        
        try {
          const parsed = await parseFile(file);
          console.log('File parsed successfully:', {
            fileName: file.name,
            rows: parsed.rows?.length || 0,
            columns: parsed.columns?.length || 0
          });
          parsedResults.push(parsed);
        } catch (fileError) {
          console.error(`Error parsing file ${file.name}:`, fileError);
          toast({
            title: `Failed to parse ${file.name}`,
            description: fileError instanceof Error ? fileError.message : 'Unknown parsing error',
            variant: "destructive",
          });
        }
      }
      
      if (parsedResults.length > 0) {
        setParsedData(parsedResults);
        console.log('All files processed successfully:', {
          totalFiles: parsedResults.length,
          totalRows: parsedResults.reduce((sum, data) => sum + (data.rows?.length || 0), 0)
        });
        
        toast({
          title: "Files Uploaded Successfully!",
          description: `Processed ${parsedResults.length} file(s) with ${parsedResults.reduce((total, data) => total + (data.summary?.totalRows || 0), 0)} total rows.`,
        });
      } else {
        throw new Error('No files were successfully processed');
      }
      
    } catch (error: any) {
      console.error('File upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || 'Failed to process the files.',
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setParsing(false);
    }
  };

  // Updated file change handler to ensure files are properly added
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleFileChange called');
    const selectedFiles = event.target.files;
    
    if (!selectedFiles || selectedFiles.length === 0) {
      console.log('No files selected in event');
      return;
    }

    console.log('Files selected:', Array.from(selectedFiles).map(f => f.name));
    Array.from(selectedFiles).forEach(file => {
      addFile(file);
    });

    // Clear the input value to allow re-uploading the same file
    event.target.value = '';
  };

  const nextStep = () => {
    console.log('Moving to next step from:', step);
    setStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    console.log('Moving to previous step from:', step);
    setStep(prev => Math.max(prev - 1, 1));
  };

  const resetForm = () => {
    console.log('Resetting form');
    setStep(1);
    setResearchQuestion('');
    setAdditionalContext('');
    setFiles([]);
    setParsedData([]);
    setColumnMapping({});
    setUploading(false);
    setParsing(false);
  };

  return {
    step,
    researchQuestion,
    additionalContext,
    files,
    parsedData,
    columnMapping,
    uploading,
    parsing,
    setResearchQuestion,
    setAdditionalContext,
    setColumnMapping,
    addFile,
    removeFile,
    handleFileChange,
    handleFileUpload,
    nextStep,
    prevStep,
    resetForm
  };
};
