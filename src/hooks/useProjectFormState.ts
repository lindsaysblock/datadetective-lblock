
import { useState } from 'react';

export const useProjectFormState = () => {
  console.log('useProjectFormState initializing');
  
  const [step, setStep] = useState(1);
  const [researchQuestion, setResearchQuestion] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [currentProjectName, setCurrentProjectName] = useState('');

  console.log('useProjectFormState initialized with step:', step);

  const nextStep = () => {
    console.log('nextStep called, current step:', step);
    setStep(prev => {
      const newStep = prev + 1;
      console.log('Moving to step:', newStep);
      return newStep;
    });
  };
  
  const prevStep = () => {
    console.log('prevStep called, current step:', step);
    setStep(prev => {
      const newStep = prev - 1;
      console.log('Moving to step:', newStep);
      return newStep;
    });
  };

  const handleFileUpload = async () => {
    if (!files.length) return;
    
    setUploading(true);
    setParsing(true);
    
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setParsedData(files.map((file, index) => ({ 
        id: index, 
        name: file.name, 
        rows: 100, 
        columns: 10, 
        preview: [] 
      })));
    } catch (error) {
      console.error('File upload error:', error);
    } finally {
      setUploading(false);
      setParsing(false);
    }
  };

  const addFile = (file: File) => {
    console.log('Adding file:', file.name);
    setFiles(prev => [...prev, file]);
  };

  const removeFile = (index: number) => {
    console.log('Removing file at index:', index);
    setFiles(prev => prev.filter((_, i) => i !== index));
    setParsedData(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    console.log('Resetting form');
    setStep(1);
    setResearchQuestion('');
    setAdditionalContext('');
    setFiles([]);
    setUploading(false);
    setParsing(false);
    setParsedData([]);
    setCurrentProjectName('');
  };

  return {
    step,
    researchQuestion,
    additionalContext,
    files,
    uploading,
    parsing,
    parsedData,
    currentProjectName,
    setStep,
    setResearchQuestion,
    setAdditionalContext,
    setFiles,
    setUploading,
    setParsing,
    setParsedData,
    setCurrentProjectName,
    nextStep,
    prevStep,
    handleFileUpload,
    addFile,
    removeFile,
    resetForm
  };
};
