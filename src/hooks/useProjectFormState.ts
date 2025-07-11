
import { useState } from 'react';

export const useProjectFormState = () => {
  const [step, setStep] = useState(1);
  const [researchQuestion, setResearchQuestion] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [currentProjectName, setCurrentProjectName] = useState('');

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleFileUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setParsing(true);
    
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setParsedData({ rows: 100, columns: 10, preview: [] });
    } catch (error) {
      console.error('File upload error:', error);
    } finally {
      setUploading(false);
      setParsing(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setResearchQuestion('');
    setAdditionalContext('');
    setFile(null);
    setUploading(false);
    setParsing(false);
    setParsedData(null);
    setCurrentProjectName('');
  };

  return {
    step,
    researchQuestion,
    additionalContext,
    file,
    uploading,
    parsing,
    parsedData,
    currentProjectName,
    setStep,
    setResearchQuestion,
    setAdditionalContext,
    setFile,
    setUploading,
    setParsing,
    setParsedData,
    setCurrentProjectName,
    nextStep,
    prevStep,
    handleFileUpload,
    resetForm
  };
};
