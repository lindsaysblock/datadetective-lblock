
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { parseCSVFile, parseJSONFile } from '@/utils/dataParser';

export const useNewProjectForm = () => {
  const [step, setStep] = useState(1);
  const [researchQuestion, setResearchQuestion] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [columnMapping, setColumnMapping] = useState<any>({});
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [isProcessingAnalysis, setIsProcessingAnalysis] = useState(false);
  const [currentProjectName, setCurrentProjectName] = useState('');
  const [educationalMode, setEducationalMode] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  const { toast } = useToast();

  const nextStep = useCallback(() => {
    setStep(prev => Math.min(prev + 1, 4));
  }, []);

  const prevStep = useCallback(() => {
    setStep(prev => Math.max(prev - 1, 1));
  }, []);

  const addFile = useCallback((file: File) => {
    setFiles(prev => [...prev, file]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setParsedData(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleFileUpload = useCallback(async () => {
    if (files.length === 0) {
      return;
    }

    setUploading(true);
    setParsing(true);
    
    try {
      const newParsedData = [];
      
      for (const file of files) {
        console.log('Processing file:', file.name, file.type);
        
        let fileData;
        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          fileData = await parseCSVFile(file);
        } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
          fileData = await parseJSONFile(file);
        } else {
          // Try to parse as CSV for other text files
          fileData = await parseCSVFile(file);
        }
        
        if (fileData) {
          newParsedData.push({
            ...fileData,
            name: file.name
          });
        }
      }
      
      setParsedData(newParsedData);
      
      if (newParsedData.length > 0) {
        toast({
          title: "Files Processed Successfully",
          description: `${newParsedData.length} file(s) have been processed and are ready for analysis.`,
        });
      }
      
    } catch (error) {
      console.error('Error processing files:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error processing your files. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setParsing(false);
    }
  }, [files, toast]);

  const resetForm = useCallback(() => {
    setStep(1);
    setResearchQuestion('');
    setAdditionalContext('');
    setFiles([]);
    setUploading(false);
    setParsing(false);
    setParsedData([]);
    setColumnMapping({});
    setAnalysisResults(null);
    setAnalysisCompleted(false);
    setIsProcessingAnalysis(false);
    setCurrentProjectName('');
    setEducationalMode(false);
    setAnalysisError(null);
  }, []);

  return {
    step,
    researchQuestion,
    additionalContext,
    files,
    uploading,
    parsing,
    parsedData,
    columnMapping,
    analysisResults,
    analysisCompleted,
    isProcessingAnalysis,
    currentProjectName,
    educationalMode,
    analysisError,
    setStep,
    setResearchQuestion,
    setAdditionalContext,
    setFiles,
    setParsedData,
    setColumnMapping,
    setAnalysisResults,
    setAnalysisCompleted,
    setIsProcessingAnalysis,
    setCurrentProjectName,
    setEducationalMode,
    setAnalysisError,
    nextStep,
    prevStep,
    addFile,
    removeFile,
    handleFileUpload,
    resetForm
  };
};
