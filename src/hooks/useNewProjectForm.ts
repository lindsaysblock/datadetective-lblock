
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { parseFile } from '@/utils/dataParser';

export const useNewProjectForm = () => {
  const [step, setStep] = useState(1);
  const [researchQuestion, setResearchQuestion] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [columnMapping, setColumnMapping] = useState<any>({});
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [isProcessingAnalysis, setIsProcessingAnalysis] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const { toast } = useToast();

  const addFile = (file: File) => {
    console.log('Adding file:', file.name);
    setFiles(prev => [...prev, file]);
  };

  const removeFile = (index: number) => {
    console.log('Removing file at index:', index);
    setFiles(prev => prev.filter((_, i) => i !== index));
    setParsedData(prev => prev.filter((_, i) => i !== index));
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

    setUploading(true);
    setParsing(false);

    try {
      console.log('Starting file upload process for files:', files.map(f => f.name));
      
      // Small delay to show uploading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUploading(false);
      setParsing(true);
      
      const parsedResults = [];
      
      for (const file of files) {
        try {
          console.log('Parsing file:', file.name);
          const parsed = await parseFile(file);
          console.log('File parsed successfully:', file.name, parsed);
          
          parsedResults.push({
            name: file.name,
            summary: parsed.summary,
            columns: parsed.columns,
            rows: parsed.rows,
            totalRows: parsed.rowCount
          });
        } catch (error) {
          console.error('Error parsing file:', file.name, error);
          toast({
            title: "Parsing Error",
            description: `Failed to parse ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            variant: "destructive",
          });
        }
      }
      
      if (parsedResults.length > 0) {
        setParsedData(parsedResults);
        
        console.log('All files parsed successfully:', parsedResults.length);
        
        toast({
          title: "Files Processed",
          description: `Successfully processed ${parsedResults.length} file(s).`,
        });
      }
      
    } catch (error) {
      console.error('Error in file upload:', error);
      toast({
        title: "Upload Failed",
        description: `Failed to process files: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setParsing(false);
    }
  };

  const nextStep = () => {
    console.log('Moving to next step from:', step);
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    console.log('Moving to previous step from:', step);
    setStep(prev => prev - 1);
  };

  console.log('useNewProjectForm hook called');
  console.log('useNewProjectForm returning step:', step);
  console.log('useNewProjectForm parsedData:', parsedData.length > 0 ? 'has data' : 'no data');
  console.log('useNewProjectForm files count:', files.length);

  return {
    step,
    researchQuestion,
    setResearchQuestion,
    additionalContext,
    setAdditionalContext,
    files,
    setFiles,
    parsedData,
    setParsedData,
    columnMapping,
    setColumnMapping,
    analysisResults,
    setAnalysisResults,
    analysisCompleted,
    setAnalysisCompleted,
    isProcessingAnalysis,
    setIsProcessingAnalysis,
    uploading,
    parsing,
    addFile,
    removeFile,
    handleFileUpload,
    nextStep,
    prevStep
  };
};
