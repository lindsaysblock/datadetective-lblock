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
    setFiles(prev => [...prev, file]);
  };

  const removeFile = (index: number) => {
    console.log('Removing file at index:', index);
    console.log('Current files:', files.map(f => f.name));
    console.log('Current parsedData length:', parsedData.length);
    
    if (index < 0 || index >= files.length) {
      console.error('Invalid file index:', index);
      toast({
        title: "Error",
        description: "Invalid file index.",
        variant: "destructive",
      });
      return;
    }

    // Remove from both arrays at the same index
    setFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      console.log('New files after removal:', newFiles.map(f => f.name));
      return newFiles;
    });
    
    setParsedData(prev => {
      const newParsedData = prev.filter((_, i) => i !== index);
      console.log('New parsedData length after removal:', newParsedData.length);
      return newParsedData;
    });

    toast({
      title: "File Removed",
      description: "The selected file has been removed from your project.",
    });
  };

  const handleFileUpload = async () => {
    if (files.length === 0) {
      console.log('No files to upload');
      return;
    }

    console.log('handleFileUpload called with files:', files.map(f => f.name));
    setUploading(true);
    setParsing(true);

    try {
      const parsedResults: ParsedData[] = [];
      
      for (const file of files) {
        console.log('Processing file:', file.name);
        const parsed = await parseFile(file);
        console.log('File parsed successfully:', parsed);
        parsedResults.push(parsed);
      }
      
      setParsedData(parsedResults);
      
      toast({
        title: "Files Uploaded Successfully!",
        description: `Processed ${parsedResults.length} file(s) with ${parsedResults.reduce((total, data) => total + (data.summary?.totalRows || 0), 0)} total rows.`,
      });
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

  const nextStep = () => {
    console.log('Moving to next step from:', step);
    setStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    console.log('Moving to previous step from:', step);
    setStep(prev => Math.max(prev - 1, 1));
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
    handleFileUpload,
    nextStep,
    prevStep
  };
};
