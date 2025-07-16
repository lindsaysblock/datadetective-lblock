
/**
 * Data Upload Hook
 * Refactored to meet coding standards with proper constants and error handling
 */

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { parseFile, generateDataInsights, type ParsedData } from '../utils/dataParser';
import { generateMockFindings, calculateEstimatedTime } from '../utils/dataProcessing';
import { TIMEOUTS } from '@/constants/ui';

export const useDataUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'uploading' | 'processing' | 'complete' | 'error'>('uploading');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | undefined>(undefined);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [researchQuestion, setResearchQuestion] = useState('');
  const [insights, setInsights] = useState<string[]>([]);
  const [findings, setFindings] = useState<any[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const { toast } = useToast();

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setFilename(selectedFile.name);
  };

  const handleFileUpload = async (file: File) => {
    console.log('Starting file upload:', file.name);
    setUploading(true);
    setUploadProgress(0);
    setUploadStatus('uploading');
    setUploadError(null);
    setFilename(file.name);
    setAnalyzing(true);
    setParsing(true);

    const fileSizeInMB = file.size / (1024 * 1024);
    const baseTime = calculateEstimatedTime(fileSizeInMB);
    setEstimatedTime(baseTime);

    try {
      // Upload phase (30% of progress)
      setUploadProgress(10);
      await new Promise(resolve => setTimeout(resolve, baseTime * 0.2));
      setUploadProgress(30);
      setEstimatedTime(baseTime * 0.7);
      
      console.log('Parsing file...');
      const parsed = await parseFile(file);
      console.log('File parsed successfully:', parsed.summary);
      setParsedData(parsed);
      setParsing(false);
      
      // Processing phase (50% of progress)
      setUploadProgress(50);
      setUploadStatus('processing');
      setEstimatedTime(baseTime * 0.5);
      
      await new Promise(resolve => setTimeout(resolve, baseTime * 0.3));
      setUploadProgress(80);
      setEstimatedTime(baseTime * 0.2);

      const generatedInsights = generateDataInsights(parsed);
      setInsights(generatedInsights);
      console.log('Generated insights:', generatedInsights.length);
      
      const mockFindings = generateMockFindings(parsed);
      setFindings(mockFindings);
      console.log('Generated findings:', mockFindings.length);
      
      // Final phase
      await new Promise(resolve => setTimeout(resolve, baseTime * 0.2));
      setUploadStatus('complete');
      setUploadProgress(100);
      setEstimatedTime(0);

      toast({
        title: "Upload Complete!",
        description: `Successfully processed ${file.name} with ${parsed.summary.totalRows} rows.`,
      });

      return parsed;
    } catch (error: any) {
      console.error("File upload error:", error);
      setUploadStatus('error');
      setUploadError(error.message || 'Failed to process file');
      setEstimatedTime(0);
      toast({
        title: "Upload Failed",
        description: `Failed to process ${file.name}: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
      throw error;
    } finally {
      setUploading(false);
      setAnalyzing(false);
    }
  };

  const handleResearchQuestionChange = (question: string) => {
    setResearchQuestion(question);
  };

  const handleStartAnalysis = () => {
    console.log('Starting analysis with research question:', researchQuestion);
    // Analysis logic would go here
  };

  const handleSaveDataset = () => {
    console.log('Saving dataset...');
    // Save logic would go here
  };

  const resetUpload = () => {
    setFile(null);
    setUploading(false);
    setUploadProgress(0);
    setUploadStatus('uploading');
    setUploadError(null);
    setFilename(undefined);
    setParsing(false);
    setParsedData(null);
    setResearchQuestion('');
    setInsights([]);
    setFindings([]);
    setAnalyzing(false);
    setEstimatedTime(0);
  };

  return {
    file,
    uploading,
    uploadProgress,
    uploadStatus,
    uploadError,
    filename,
    parsing,
    parsedData,
    researchQuestion,
    insights,
    findings,
    analyzing,
    estimatedTime,
    handleFileChange,
    handleFileUpload,
    handleResearchQuestionChange,
    handleStartAnalysis,
    handleSaveDataset,
    resetUpload
  };
};
